import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Drawer } from '@mui/material';

const { localStorage } = window;



const ChatRightPanel = ({ chatPersonList, chatTodoList, liveChatTodoList }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [personList, setPersonList] = useState([]);
  const [todoList, setTodoList] = useState([]);
  const accessToken = localStorage.getItem('accessToken');


  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (chatPersonList) {
      setPersonList(chatPersonList);
      // console.log(chatPersonList);
    }
  }, [chatPersonList]);

// -----------------------------------------------------------
  useEffect(() => {
    if (chatPersonList.length === 0) {
      return; // No post data available, exit the useEffect
    }
    
    // Create an array to store promises for fetching images
    const imagePromises = chatPersonList.map((post) => {
      const imageUrl = `http://52.79.53.62:8080/${post.imagePath}`;
      const token = accessToken;

      return fetch(imageUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.blob();
        })
        .then((blob) => {
          // Create an object URL from the blob
          const objectURL = URL.createObjectURL(blob);
          return objectURL;
        })
        .catch((error) => {
          console.error('Error:', error);
          return null; // Handle errors by returning null
        });
    });

    // Wait for all image fetch promises to resolve
    Promise.all(imagePromises)
      .then((imageUrls) => {
        // Set the image URLs to the respective posts
        const updatedPostIds = chatPersonList.map((post, index) => ({
          ...post,
          imageUrl: imageUrls[index], // Add the imageUrl property
        }));

        // Update the state with the updated post data
        setPersonList(updatedPostIds);
      })
      .catch((error) => {
        console.error('Error fetching images:', error);
      });
  }, [accessToken, chatPersonList]);
// -----------------------------------------------------------

  useEffect(() => {
    if (chatTodoList) {
      setTodoList(chatTodoList);
    }
  }, [chatTodoList]);

  return (
    <Div>
      <button className="btn btn-primary" onClick={toggleDrawer}>TodoList</button>
      <CustomDrawer anchor="right" open={isOpen} onClose={toggleDrawer}>
        <TodoList>
          <h2>TodoList</h2>
          {todoList && todoList.map((item) => (
            <UserContainer key={item.todoId}>
              <input type="checkbox" />
              <p>{item.content}</p>
            </UserContainer>
          ))}
        </TodoList>
      </CustomDrawer>
      <UserList>
        {personList && personList.map((item) => (
          <UserContainer key={item.id}>
            <ProfileImage src={item.imageUrl ? item.imageUrl : "fallback-profile-image.jpg"} alt={item.nickname} />
            <ProfileName>{item.nickname}</ProfileName>
          </UserContainer>
        ))}
      </UserList>
    </Div>
  );
};

export default ChatRightPanel;


const Div = styled.div`
  width: 100%;
  height: 100%;
`;

const TodoList = styled.div`
  background-color: lightgray;
  padding: 10px;
`;

const UserList = styled.div`
  background-color: white;
`;

const UserContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  background-color: white;
`;

const ProfileImage = styled.img`
  margin-left: 25px;
  width: 23px;
  height: 23px;
  border-radius: 50%;
  margin-right: 5px;
`;

const ProfileName = styled.span`
  font-size: 25px;
  margin-left: 10px;
`;

const CustomDrawer = styled(Drawer)`
  /* 원하는 스타일을 적용하세요 */
  width: 300px; /* 넓이 조절 */
  
`;

