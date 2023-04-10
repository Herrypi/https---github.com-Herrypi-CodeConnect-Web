import React, { useState } from 'react'
import styled from 'styled-components'
import { AiOutlinePlusCircle } from 'react-icons/ai'
const { localStorage } = window;

function MiddlePanel() {
  const [position, setPosition] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [posts, setPosts] = useState([]); // 게시물 목록을 저장할 변수
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [count, setCount] = useState("");
  const [role, setRole] = useState("");
  const [field, setField] = useState("");


  function handleWheel(event) {
    // Update the position based on the amount of scrolling
    setPosition(position + event.deltaY);
  }
  const token = localStorage.getItem('token');

  const addPost = () => {
    const newPost = {
      title,
      content,
      count,
      role,
      field,
      timestamp: Date.now()
    };
    fetch('http://112.154.249.74:8080/recruitments/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newPost)
    })
      .then(response => response.json())
      .then(data => {
        setPosts([...posts, data]); // update the state with the new post returned by the server
      })
      .catch(error => console.error(error));
  };

  return (
    <Div style={{ overflowY: 'scroll', height: '100%' }} onWheel={handleWheel}>
      <Container>
        <Posting onClick={() => setShowPopup(true)}>
          <AiOutlinePlusCircle />
        </Posting>
        {showPopup && (
          <Popup>
            <input type="text" placeholder="Enter a title." onChange={(e) => setTitle(e.target.value)} />
            <textarea placeholder="Enter your content." onChange={(e) => setContent(e.target.value)}></textarea>
            <input type="text" placeholder="Enter a count." onChange={(e) => setCount(e.target.value)} />
            <input type="text" placeholder="Enter a role." onChange={(e) => setRole(e.target.value)} />
            <input type="text" placeholder="Enter a field." onChange={(e) => setField(e.target.value)} />
            <button onClick={() => setShowPopup(false)}>Cancel</button>
            <button onClick={() => {
              if (title && content && count && role && field) {
                // Add logic for creating a new post
                addPost();
                setShowPopup(false);
                setTitle("");
                setContent("");
                setCount("");
                setRole("");
                setField("");
              } else {
                alert("Please enter all the fields.");
              }
            }}>Create</button>
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
  left: 30%;
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
  left: 30%
  margin: 10px;
  background-color: #F3F8FF;
  border-radius: 10px;
`;
