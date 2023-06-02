import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Drawer } from '@mui/material';

const ChatRightPanel = ({ chatPersonList, chatTodoList, liveChatTodoList }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [personList, setPersonList] = useState([]);
  const [todoList, setTodoList] = useState([]);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (chatPersonList) {
      setPersonList(chatPersonList);
    }
  }, [chatPersonList]);

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
            <ProfileImage src={"http://112.154.249.74:8080/" + item.imagePath} />
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

