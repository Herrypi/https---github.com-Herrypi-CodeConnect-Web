import { useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import { Client } from '@stomp/stompjs';
import axios from 'axios';
import { FaUser } from 'react-icons/fa';
import ChatRightPanel from './ChatRightPanel';


const ChatPanel = ({ roomId, roomTitle }) => {
  const [messageList, setMessageList] = useState([]);
  const [inputText, setInputText] = useState('');
  const [nickname, setNickname] = useState('');
  const [stompClient, setStompClient] = useState(null);

  const [myProfileImage, setMyProfileImage] = useState([]);
  const [showChecklist, setShowChecklist] = useState(false);

  const chatContentRef = useRef(null);

  const [chatPersonList, setChatPersonList] = useState([]);


  const [showPersonList, setShowPersonList] = useState(false);

  const togglePersonList = () => {
    setShowPersonList(!showPersonList);
  };





  useEffect(() => {
    if (!roomId) {
      return;
    }

    const scrollToBottom = () => {
      if (chatContentRef.current) {
        chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
      }
    };

    // Fetch previous chat history
    axios.get(`http://112.154.249.74:8080/chatRoom/${roomId}`)
      .then(response => {
        const data = response.data;
        // console.log(data);
        setMessageList(data.data.CHAT);
        setNickname(data.data.MY_NICKNAME);
        setMyProfileImage(data.data.NICKNAME_IMAGE);

        // console.log(data.data.NICKNAME_IMAGE)

        const profileData = [];

        Object.keys(data.data.NICKNAME_IMAGE).forEach(nickname => {
          const imagePath = data.data.NICKNAME_IMAGE[nickname];
          const profile = {
            nickname: nickname,
            imagePath: imagePath
          };
          profileData.push(profile);
        });

        setChatPersonList(profileData, () => {
          console.log(chatPersonList);
        });
      })
      .catch(error => {
        console.error('Failed to fetch chat history:', error);
      });


    const client = new Client({
      brokerURL: 'ws://112.154.249.74:8080/ws',
      debug: function (str) {
        console.log(str);
      },
      onConnect: () => {
        console.log('STOMP 연결 성공');
        const subscribeCallback = (message) => {
          const receivedMessage = JSON.parse(message.body);
          setMessageList(prevList => [...prevList, receivedMessage]);
          scrollToBottom();
        };
        const destination = `/sub/chat/room/${roomId}`;
        const subscription = client.subscribe(destination, subscribeCallback);
        setStompClient(client);
      },
    });

    const connectStompClient = async () => {
      try {
        client.activate();
      } catch (error) {
        console.error('STOMP 연결 실패:', error);
      }
    };

    const initStompClient = async () => {
      await connectStompClient();
    };

    initStompClient();

    setShowChecklist(false);
    setShowPersonList(false);

    return () => {
      if (stompClient && stompClient.connected) {
        stompClient.deactivate();
      }
    };
  }, [roomId]);

  const sendMessage = (text) => {
    if (!stompClient || !stompClient.connected) {
      console.error("STOMP 클라이언트가 초기화되지 않았거나 연결되지 않았습니다.");
      return;
    }

    if (!text) { // Check if text is empty
      return;
    }

    const message = {
      roomId: roomId,
      nickname: nickname,
      message: text,
    };

    stompClient.publish({
      destination: "/pub/chat/message",
      body: JSON.stringify(message),
    });

    setInputText('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!inputText) {
      return;
    }

    sendMessage(inputText);
  };

  if (!roomId) {
    return null;
  }

  return (
    <Container>
      <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
      />
      <div className="container">
        <div className="row">
          <div className="col-md-9">
            <div className="card">
              <div className="card-body">

                <ChatTitle>
                  {roomTitle}
                </ChatTitle>
                
                <ChatContent ref={chatContentRef}>
                  {messageList.map((message, index) => (
                    <MessageBubble
                      key={index}
                      isMyMessage={message.nickname === nickname}
                    >
                      {message.nickname !== nickname && (
                        <ProfileImage
                          src={"http://112.154.249.74:8080/" + myProfileImage[message.nickname]}
                          alt="프로필 이미지"
                        />
                      )}

                      <MessageContent>
                        {message.nickname !== nickname && (
                          <MessageNickname>{message.nickname}</MessageNickname>
                        )}
                        <MessageText isMyMessage={message.nickname === nickname}>
                          {message.message}
                        </MessageText>
                      </MessageContent>
                    </MessageBubble>
                  ))}
                </ChatContent>

                <ChatInput>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="메시지 입력"
                        value={inputText}
                        onChange={event => setInputText(event.target.value)}
                      />
                    </div>
                    <button type="submit" className="btn btn-primary">
                      전송
                    </button>
                  </form>

                </ChatInput>
              </div>
            </div>
            <VerticalLine />

          </div>

          <div className="col-md-3">
            <ChatRightPanel chatPersonList={chatPersonList} />
          </div>
        </div>

      </div>

    </Container>
  );
};

export default ChatPanel;


const Container = styled.div`
  width: 100%;
  height: 500px;
  margin: 0 auto;
`;

const ChatTitle = styled.h4`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  position: sticky;
  top: 0;
  background-color: #fff;
  padding: 10px;
  z-index: 1;

  .fa-user {
    font-size: 16px; /* 아이콘의 크기 조정 */
    margin-right: 5px;
  }
`;


const ChatContent = styled.div`
  flex: 1;
  overflow-y: auto;
  height: 400px;
  padding: 5px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const MessageBubble = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px;

  ${props =>
    props.isMyMessage &&
    css`
      justify-content: flex-end;
      align-items: flex-end;
    `}
`;

const ChatInput = styled.div`
  position: sticky;
  bottom: 0;
  background-color: #fff;
  padding: 10px;
  z-index: 1;
`;

const MessageContent = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
`;

const MessageNickname = styled.span`
  font-size: 12px;
  margin-bottom: 4px;
`;

const MessageText = styled.div`
  background-color: ${({ isMyMessage }) =>
    isMyMessage ? "#DCF8C6" : "#F2F2F2"};
  padding: 8px;
  border-radius: 10px;
  margin-right: 5px;
  font-size: 14px;
`;

const ProfileImage = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: 5px;
`;

const ListButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: transparent;
  border: none;
  cursor: pointer;
`;

const ListIcon = styled.i`
  font-size: 24px;
  color: #555;
`;

const Drawer = styled.div`
  position: absolute;
  top: 40px;
  right: 10px;
  background-color: #fff;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const DrawerPerson = styled.div`
  position: absolute;
  top: 40px;
  left: 70px;
  background-color: #fff;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const DrawerContent = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 12px;
`;


const DrawerItem = styled.div`
  cursor: pointer;
  padding: 5px;
  &:hover {
    background-color: #f2f2f2;
  }
`;

const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
`;

const ProfileName = styled.span`
  font-size: 12px;
  margin-left: 5px;
`;

const VerticalLine = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  height: 1000px;
  border-right: 1px solid #ccc;
`;

