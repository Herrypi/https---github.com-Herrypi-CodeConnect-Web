import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Client } from '@stomp/stompjs';
import axios from 'axios';

const ChatPanel = ({roomId, roomTitle}) => {
  const [messageList, setMessageList] = useState([]);
  const [inputText, setInputText] = useState('');
  const [nickname, setNickname] = useState("");
  const [subscription, setSubscription] = useState(null);
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    if (!roomId) {
      return;
    }

    // Fetch previous chat history
    axios.get(`http://112.154.249.74:8080/chatRoom/${roomId}`)
      .then(response => {
        const data = response.data;
        setMessageList(data.data.CHAT);
        console.log(data)
        setNickname(data.data.MY_NICKNAME)
      })
      .catch(error => {
        console.error('Failed to fetch chat history:', error);
      });

    const client = new Client({
      brokerURL: 'ws://112.154.249.74:8080/ws',
      debug: function (str) {
        console.log(str);
      },
    });

    const connectStompClient = async () => {
      try {
        await client.activate();
        console.log('STOMP 연결 성공');
        setStompClient(client);

        const subscribeCallback = (message) => {
          const receivedMessage = JSON.parse(message.body);
          setMessageList(prevList => [...prevList, receivedMessage]);
        };

        const destination = `/sub/chat/room/${roomId}`;
        const subscription = client.subscribe(destination, subscribeCallback);
        setSubscription(subscription);
      } catch (error) {
        console.error('STOMP 연결 실패:', error);
      }
    };

    const initStompClient = async () => {
      await connectStompClient();
    };

    initStompClient();

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
      client.deactivate();
    };
  }, [roomId]);

  const sendMessage = (text) => {
    if (!stompClient || !stompClient.connected) {
      console.error("STOMP 클라이언트가 초기화되지 않았거나 연결되지 않았습니다.");
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

    setMessageList((prevList) => [...prevList, message]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!inputText) {
      return;
    }

    sendMessage(inputText);

    setInputText('');
  };

  return (
    <Container>
      <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
      />
      <div className="container">
        <div className="row">
          <div className="col-md-7">
            <div className="card">
              <div className="card-body">
                <ChatTitle>{roomTitle}</ChatTitle>
                <ChatContent>
                  {messageList.map((message, index) => (
                    <MessageBubble key={index} isMyMessage={message.nickname === nickname}>
                      {message.nickname === nickname ? '나' : message.nickname}: {message.message}
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
          </div>
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  width: 800px;
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
`;

const ChatContent = styled.div`
  overflow-y: auto;
  height: 400px;
  padding: 5px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const MessageBubble = styled.div`
  display: inline-block;
  max-width: 70%;
  padding: 10px;
  border-radius: 20px;
  margin-bottom: 10px;
  background-color: ${props => props.isMyMessage ? '#DCF8C6' : '#E0E0E0'};
  align-self: ${props => props.isMyMessage ? 'flex-end' : 'flex-start'};
`;

const ChatInput = styled.div`
  position: sticky;
  bottom: 0;
  background-color: #fff;
  padding: 10px;
  z-index: 1;
`;

export default ChatPanel;
