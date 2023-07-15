import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ChatPanel from "./ChatPanel";
import { FaUser } from 'react-icons/fa';

function ChatRoomPanel() {
  const [roomData, setRoomData] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [selectedRoomTitle, setSelectedRoomTitle] = useState(null);
  const [isChatRoomSelected, setIsChatRoomSelected] = useState(false); // 채팅방 선택 여부 상태 추가

  useEffect(() => {
    axios
      .get("http://13.124.68.20:8080/chatRoom/list")
      .then((response) => {
        const data = response.data;
        const chatRoomData = data.data.map((item) => {
          const { currentCount, currentDateTime, hostNickname, roomId, title } = item;
          return { currentCount, currentDateTime, hostNickname, roomId, title };
        });
        setRoomData(chatRoomData);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleChatRoomClick = (roomId, roomTitle) => {
    setSelectedRoomId(roomId);
    setSelectedRoomTitle(roomTitle);
    setIsChatRoomSelected(true); // 채팅방 선택 시 상태 변경
  };

  return (
    <Div>
      <div className="row">
        <ChatRoomList className={`${isChatRoomSelected ? "selected" : ""}`}>
          <div>
            {/* 채팅방 목록 */}
            {roomData.map((item) => (
              <div
                key={item.roomId}
                className={`card ${selectedRoomId === item.roomId ? "active" : ""}`}
                onClick={() => handleChatRoomClick(item.roomId, item.title)}
              >
                <div className="card-body">
                  {/* 채팅방 목록 내용 */}
                  <p><img className="heart-icon" src="Images/logos/owner.png"/>{item.hostNickname}</p>

                  <h5>{item.title}</h5><p><FaUser/> {item.currentCount}</p>
                  {/* <p>인원수: {item.currentCount}</p> */}
                </div>
              </div>
            ))}
          </div>
          <VerticalLine />
        </ChatRoomList>
        <div className="col-md-8 col-lg-9">
          {/* 채팅창 */}
          <ChatPanel roomId={selectedRoomId} roomTitle={selectedRoomTitle} />
        </div>
        

      </div>
    </Div>
  );
}

export default ChatRoomPanel;

const ChatRoomList = styled.div`
  height: 100px; /* 화면 높이에서 20px만큼 뺀 크기로 설정 */
  overflow-y: auto; /* 내용이 넘칠 경우 스크롤 표시 */
  width: 80%; /* 좌우 간격을 조정하는 부분입니다. 필요에 따라 값 수정 가능 */
  padding-right: 10px; /* 우측 간격 조정 */
  transition: width 0.3s; /* 애니메이션 효과를 위한 트랜지션 추가 */
  
  
  &.selected {
    width: 25%; /* 채팅방 선택 시 좁아지는 너비로 설정 */
    
  }
  .heart-icon{
    width: 30px;
    height: 30px;
    object-fit: cover;
    margin-right: 10px;
  }
`;

const VerticalLine = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  border-right: 1px solid #ccc;
`;

const Div = styled.div`
  padding-left: 10px;
  padding-top: 10px;
  height: 100%;
  background-color: #2F4074
`;

const activeColor = "#f8f8f8"; // 활성화된 채팅방 배경색
const hoverColor = "#f2f2f2"; // 마우스 호버 시 배경색

const Card = styled.div`
  background-color: ${(props) => (props.isActive ? activeColor : "white")};
  transition: background-color 0.3s;

  &:hover {
    background-color: ${(props) => (props.isActive ? activeColor : hoverColor)};
  }
`;
