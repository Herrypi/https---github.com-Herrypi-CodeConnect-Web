import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ChatPanel from "./ChatPanel";

function ChatRoomPanel() {
  const [roomData, setRoomData] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [selectedRoomTitle, setSelectedRoomTitle] = useState(null);

  useEffect(() => {
    axios.get('http://112.154.249.74:8080/chatRoom/list')
      .then(response => {
        const data = response.data;
        const chatRoomData = data.data.map(item => {
          const { currentCount, currentDateTime, hostNickname, roomId, title } = item;
          return { currentCount, currentDateTime, hostNickname, roomId, title };
        });
        setRoomData(chatRoomData);
        // console.log);
      })
      .catch(error => console.error(error));
  }, []);

  const handleChatRoomClick = (roomId, roomTitle) => {
    setSelectedRoomId(roomId);
    setSelectedRoomTitle(roomTitle);

  };

  return (
    <Div>
      <div className="row">
        <ChatRoomList className="col-md-4">
          <div>
            {/* 채팅방 목록 */}
            {roomData.map((item) => (
              <div key={item.roomId} className="card" onClick={() => handleChatRoomClick(item.roomId, item.title)}>
                <div className="card-body">
                  {/* 채팅방 목록 내용 */}
                  <p>방장: {item.hostNickname}</p>
                  <p>인원수: {item.currentCount}</p>
                  <h5>{item.title}</h5>
                </div>
              </div>
            ))}

            <VerticalLine />
          </div>
        </ChatRoomList >
        <div className="col-md-8">
          {/* 채팅창 */}
          <ChatPanel roomId={selectedRoomId} roomTitle={selectedRoomTitle}/>
          {/* {selectedRoomId && <ChatPanel roomId={selectedRoomId} />} */}
        </div>
      </div>
    </Div>
  );
}

export default ChatRoomPanel;

const ChatRoomList = styled.div`

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
  background-color: #CFDCFF;
`;