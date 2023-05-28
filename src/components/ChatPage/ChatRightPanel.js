import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const ChatRightPanel = ({ chatPersonList }) => {
  const [personList, setPersonList] = useState([]);

  useEffect(() => {
    if (chatPersonList) {
      setPersonList(chatPersonList);
    }
  }, [chatPersonList]);

  return (
    <Div>
      <TodoList>
        <h3>Todo List</h3>
      </TodoList>


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
height: 100%
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
