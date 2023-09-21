import { useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import { Client } from '@stomp/stompjs';
import axios from 'axios';
import ChatRightPanel from './ChatRightPanel';

const { localStorage } = window;


const ChatPanel = ({ roomId, roomTitle }) => {
  const [messageList, setMessageList] = useState([]);
  const [inputText, setInputText] = useState('');
  const [nickname, setNickname] = useState('');
  const [stompClient, setStompClient] = useState(null);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [myProfileImage, setMyProfileImage] = useState([]);
  const [showChecklist, setShowChecklist] = useState(false);
  const chatContentRef = useRef(null);
  const [chatPersonList, setChatPersonList] = useState([]);
  const [showPersonList, setShowPersonList] = useState(false);
  const [todoList, setTodoList] = useState([])
  const [creattodo, setCreateTodo] = useState('');
  const [subscribedTodoList, setSubscribedTodoList] = useState([]);

  const [fileContentType, setFileContentType] = useState("");
  const [filePath, setFilePath] = useState("")
  const [fileSize, setFileSize] = useState("")
  const [profileImageUrl, setProfileImageUrl] = useState(null);


  const accessToken = localStorage.getItem('accessToken');

  const toggleChecklist = () => {
    setShowChecklist(!showChecklist);
  };

  const togglePersonList = () => {
    setShowPersonList(!showPersonList);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];

    if (file) {
      setFileToUpload(file);
    }
  };

  const handleFileDownload = async (message) => {
    // const filePath = message.message.match(/파일경로:\s(.*?)\n/)[1];
    // const fileType = message.message.match(/파일타입:\s(.*?)\n/)[1];
    // const fileSize = message.message.match(/파일크기:\s(.*?)MB/)[1];

    if (message.messageType === "FILE") {
      const downloadUrl = `http://52.79.53.62:8080/chat/file/download?filePath=${filePath}&fileContentType=${fileContentType}`;

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", `파일경로: ${filePath}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
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
    axios.get(`http://52.79.53.62:8080/chatRoom/${roomId}`)
      .then(response => {
        const data = response.data;
        console.log(data);
        setMessageList(data.data.CHAT);
        setNickname(data.data.MY_NICKNAME);
        setMyProfileImage(data.data.NICKNAME_IMAGE);
        setTodoList(data.data.TODO_LIST);

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

        // 프로필 이미지를 불러오는 부분을 여기에 추가
        // 이미지를 불러올 대상 목록 (예: myProfileImage)
        // const imageList = Object.values(data.data.NICKNAME_IMAGE);
        console.log(chatPersonList);

      })
      .catch(error => {
        console.error('Failed to fetch chat history:', error);
      });



    const client = new Client({
      brokerURL: 'ws://52.79.53.62:8080/ws',
      debug: function (str) {
        console.log(str);
      },
      onConnect: () => {
        console.log('STOMP 연결 성공');
        const subscribeCallback = (message) => {
          const receivedMessage = JSON.parse(message.body);
          console.log(receivedMessage)
          // 채팅일 경우
          if (receivedMessage.type === "chat") {
            receivedMessage.messageType = "CHAT";
          } else if (receivedMessage.type === "file") {
            receivedMessage.messageType = "FILE";
          }

          // console.log(receivedMessage.messageType);
          setMessageList(prevList => [...prevList, receivedMessage]);
          // console.log(prevList => [...prevList, receivedMessage])
          scrollToBottom();

        };
        const updateSubscribedTodoList = (message) => {
          const receivedTodoList = JSON.parse(message.body);
          setSubscribedTodoList(prevList => [...prevList, receivedTodoList]);
        };
        const destination = `/sub/chat/room/${roomId}`;
        const subscription = client.subscribe(destination, subscribeCallback);

        const todoSubscription = client.subscribe(`/sub/todo/room/${roomId}`, updateSubscribedTodoList);


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
  }, [roomId, accessToken]); // roomId와 accessToken이 업데이트될 때에만 실행

  // --------------------------------------------------------------------------------
  const fetchProfileImage = () => {
    if (!accessToken || !myProfileImage) {
      return;
    }

    // 프로필 이미지 URL을 가져올 엔드포인트를 지정합니다.
    console.log(myProfileImage);
    const profileImageUrlEndpoint = `http://52.79.53.62:8080/${myProfileImage}`;

    fetch(profileImageUrlEndpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.blob();
      })
      .then((blob) => {
        // Blob을 URL로 변환합니다.
        const objectURL = URL.createObjectURL(blob);
        setProfileImageUrl(objectURL);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };


  useEffect(() => {
    if (myProfileImage && accessToken) {
      fetchProfileImage();
    }
  }, [myProfileImage, accessToken]);

  // --------------------------------------------------------------------------------







  // useEffect(() => {
  //   if (chatPersonList.length === 0) {
  //     return; // No post data available, exit the useEffect
  //   }

  //   // Create an array to store promises for fetching images
  //   const imagePromises = chatPersonList.map((post) => {
  //     const imageUrl = `http://52.79.53.62:8080/${post.imagePath}`;
  //     const token = accessToken;

  //     return fetch(imageUrl, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     })
  //       .then((response) => {
  //         if (!response.ok) {
  //           throw new Error('Network response was not ok');
  //         }
  //         return response.blob();
  //       })
  //       .then((blob) => {
  //         // Create an object URL from the blob
  //         const objectURL = URL.createObjectURL(blob);
  //         return objectURL;
  //       })
  //       .catch((error) => {
  //         console.error('Error:', error);
  //         return null; // Handle errors by returning null
  //       });
  //   });

  //   // Wait for all image fetch promises to resolve
  //   Promise.all(imagePromises)
  //     .then((imageUrls) => {
  //       // Set the image URLs to the respective posts
  //       const updatedPostIds = chatPersonList.map((post, index) => ({
  //         ...post,
  //         imageUrl: imageUrls[index], // Add the imageUrl property
  //       }));

  //       // Update the state with the updated post data
  //       setChatPersonList(updatedPostIds);
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching images:', error);
  //     });
  // }, [accessToken, chatPersonList]);




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
    axios.get(`http://52.79.53.62:8080/chatRoom/${roomId}`)
      .then(response => {
        const data = response.data;
        console.log(data);
        setMessageList(data.data.CHAT);
        setNickname(data.data.MY_NICKNAME);
        setMyProfileImage(data.data.NICKNAME_IMAGE);
        setTodoList(data.data.TODO_LIST)
        // console.log(data.data.TODO_LIST)

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
      brokerURL: 'ws://52.79.53.62:8080/ws',
      debug: function (str) {
        console.log(str);
        console.log(chatPersonList);
      },
      onConnect: () => {
        console.log('STOMP 연결 성공');
        const subscribeCallback = (message) => {
          const receivedMessage = JSON.parse(message.body);
          console.log(receivedMessage)
          // 채팅일 경우
          if (receivedMessage.type === "chat") {
            receivedMessage.messageType = "CHAT";
          } else if (receivedMessage.type === "file") {
            receivedMessage.messageType = "FILE";
          }

          // console.log(receivedMessage.messageType);
          setMessageList(prevList => [...prevList, receivedMessage]);
          // console.log(prevList => [...prevList, receivedMessage])
          scrollToBottom();

        };
        const updateSubscribedTodoList = (message) => {
          const receivedTodoList = JSON.parse(message.body);
          setSubscribedTodoList(prevList => [...prevList, receivedTodoList]);
        };
        const destination = `/sub/chat/room/${roomId}`;
        const subscription = client.subscribe(destination, subscribeCallback);

        const todoSubscription = client.subscribe(`/sub/todo/room/${roomId}`, updateSubscribedTodoList);


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

  //아래꺼 파일 보내기

  const sendFile = async (file) => {
    if (!stompClient || !stompClient.connected) {
      console.error("STOMP 클라이언트가 초기화되지 않았거나 연결되지 않았습니다.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://52.79.53.62:8080/chat/file/upload', formData);
      const fileId = response.data.fileId;
      const fileName = response.data.fileName;
      const data = response.data;
      console.log(response.data);
      setFileContentType(data.data.fileContentType);
      setFilePath(data.data.filePath);
      setFileSize(data.data.fileSize);

      const message = {
        roomId: roomId,
        nickname: nickname,
        message: `파일경로: ${data.data.filePath}\n파일타입: ${data.data.fileContentType}\n파일크기: ${data.data.fileSize}`,
        messageType: "FILE",
        fileId: fileId,
        fileName: fileName,
      };

      stompClient.publish({
        destination: "/pub/chat/message",
        body: JSON.stringify(message),
      });
    } catch (error) {
      console.error('파일 업로드 실패:', error);
    }
  };


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
      messageType: "CHAT",
      fileContentType: fileContentType,
      filePath: filePath,
      message: text,
      type: "chat"
    };

    stompClient.publish({
      destination: "/pub/chat/message",
      body: JSON.stringify(message),
    });
    setInputText('');
  };


  //투두리스트 보내기
  const sendTodoList = (content) => {
    if (!stompClient || !stompClient.connected) {
      console.error("STOMP 클라이언트가 초기화되지 않았거나 연결되지 않았습니다.");
      return;
    }
    if (!content) { // Check if content is empty
      return;
    }

    const create = {
      roomId: roomId,
      content: content,
    };

    stompClient.publish({
      destination: "/pub/todo/create",
      body: JSON.stringify(create),
    });
    setCreateTodo('');
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    if (fileToUpload) {
      sendFile(fileToUpload);
      setFileToUpload(null);

    } else if (inputText) {
      sendMessage(inputText);
    }

    setInputText('');
  };


  const handleTodoSubmit = (event) => { //투두리스트 전송
    event.preventDefault();

    if (!creattodo) {
      return;
    }

    sendTodoList(creattodo);
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
                <button onClick={toggleChecklist}>todoList 생성하기</button>
                {showChecklist && (
                  <form onSubmit={handleTodoSubmit}>
                    <div>
                      <input
                        type="text"
                        value={creattodo}
                        onChange={event => setCreateTodo(event.target.value)}
                      />
                      <button type="submit">추가하기</button>
                    </div>
                  </form>
                )}
                <ChatContent ref={chatContentRef}>
                  {messageList.map((message, index) => (
                    <MessageBubble
                      key={index}
                      isMyMessage={message.nickname === nickname}
                    >
                      {message.nickname !== nickname && (
                        <ProfileImage
                          src={profileImageUrl ? profileImageUrl : "fallback-profile-image.jpg"}
                          alt="프로필 이미지"
                        />
                      )}

                      <MessageContent>
                        {message.nickname !== nickname && (
                          <MessageNickname>{message.nickname}</MessageNickname>
                        )}
                        {message.messageType === "FILE" ? (
                          <FileMessage isMyMessage={message.nickname === nickname}>
                            <FileName>{message.message}<br /></FileName>
                            <FileDownloadButton onClick={() => handleFileDownload(message)}>
                              다운로드
                            </FileDownloadButton>
                          </FileMessage>
                        ) : (
                          <MessageText isMyMessage={message.nickname === nickname}>
                            {message.message}
                          </MessageText>
                        )}
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
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                        onChange={handleFileUpload}
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
            <ChatRightPanel chatPersonList={chatPersonList} chatTodoList={todoList} liveChatTodoList={subscribedTodoList} />
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

const VerticalLine = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  height: 1000px;
  border-right: 1px solid #ccc;
`;

const FileMessage = styled.div`
width: 250px;
background-color: ${({ isMyMessage }) =>
    isMyMessage ? "#DCF8C6" : "#F2F2F2"};
padding: 8px;
border-radius: 10px;
margin-right: 5px;
font-size: 14px;
white-space: pre-wrap; // 줄바꿈을 지원하는 스타일 추가

`;

const FileName = styled.span`
  font-size: 4px;
  margin-right: 4px;
`;

const FileDownloadButton = styled.button`
  padding: 4px 8px;
  background-color: #7EAEF6;
  border: none;
  border-radius: 4px;
  color: #333;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #999999;
  }
`;