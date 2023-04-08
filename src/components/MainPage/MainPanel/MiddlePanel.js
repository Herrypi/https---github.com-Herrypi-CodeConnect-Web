import React, {useState} from 'react'
import styled from 'styled-components'
import { AiOutlinePlusCircle } from 'react-icons/ai'

function MiddlePanel() {

  const [position, setPosition] = useState(0);

  function handleWheel(event) {
    // Update the position based on the amount of scrolling
    setPosition(position + event.deltaY);
  }

  const [showPopup, setShowPopup] = React.useState(false);
  const [posts, setPosts] = React.useState([]); // 게시물 목록을 저장할 변수
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");


  const addPost = () => {
    const newPost = {
      title,
      content,
      timestamp: Date.now()
    };
    setPosts([...posts, newPost]);
  };

  return (
    <Div style={{overflowY: 'scroll', height: '100%'}} onWheel={handleWheel}>
    <Container>
      <Posting onClick={() => setShowPopup(true)}>
        <AiOutlinePlusCircle />
      </Posting>
      {showPopup && (
        <Popup>
          <input type="text" placeholder="제목을 입력하세요." onChange={(e) => setTitle(e.target.value)} />
          <textarea placeholder="내용을 입력하세요." onChange={(e) => setContent(e.target.value)}></textarea>
          <button onClick={() => setShowPopup(false)}>취소</button>
          <button onClick={() => {
            if (title && content) {
              // 게시물 추가 로직
              addPost();
              setShowPopup(false);
              setTitle("");
              setContent("");
            } else {
              alert("제목과 내용을 모두 입력해주세요.");
            }
          }}>작성</button>
        </Popup>
      )}
      <Feed>
        {posts.map((post, index) => (
          <Post key={index}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <small>{new Date(post.timestamp).toLocaleString()}</small>
          </Post>
        ))}
      </Feed>
    </Container>
    </Div>

  )
}

export default MiddlePanel

const Div = styled.div`
height:100%;
background-color: #CFDCFF;

`;

const Container = styled.div`
height: auto;
background-color: #CFDCFF;

`;

const Posting = styled.div`
  float: right;
  font-size: 40px;
  cursor: pointer;
  z-index: 999;
  position: fixed;
  margin: 25px;

`;

const Feed = styled.div`
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
padding-top: 20px;
`;

const Popup = styled.div`
  position: absolute;
  width:700px;
  height:500px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border: 1px solid black;
  
`;

const Post = styled.div`
  border: 1px solid #ddd;
  padding: 20px;
  width: 500px;
  height: auto;
  margin: 10px;
  background-color: #F3F8FF;
  border-radius: 10px;
`;
