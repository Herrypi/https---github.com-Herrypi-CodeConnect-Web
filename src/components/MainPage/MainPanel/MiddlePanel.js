import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { AiOutlinePlusCircle } from 'react-icons/ai'
import axios from 'axios';
import { NavLink } from 'react-router-dom';

const { localStorage } = window;

function MiddlePanel() {
  const [position, setPosition] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [posts, setPosts] = useState([]); // 게시물 목록을 저장할 변수
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [count, setCount] = useState("");
  const [field, setField] = useState("");

  const [postIds, setPostIds] = useState([]);//게시물 목록중 recruited_id만 저장
  // const [postTitle, setPostTitles] = useState([]);
  // const [postContent, setPostContents] = useState([]);
  // const [postCount, setPostCounts] = useState([]);
  // const [postField, setPostFields] = useState([]);



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
      field,
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
        setPosts(prevPosts => [...prevPosts, data]); // update the state with the new post returned by the server
      })
      .catch(error => console.error(error));
  };


  useEffect(() => {
    axios.get('http://112.154.249.74:8080/recruitments/list')
      .then(response => {
        const data = response.data;
        const recruitmentData = data.data.map(item => {
          const { recruitmentId, title, content, count, field } = item;
          return { recruitmentId, title, content, count, field };
        });
        
        // const titles = data.data.map(item => item.title);
        // const contents = data.data.map(item => item.content);
        // const counts = data.data.map(item => item.count);
        // const fields = data.data.map(item => item.field);

        setPostIds(recruitmentData);
        // setPostIds(titles);
        // setPostIds(contents);
        // setPostIds(counts);
        // setPostIds(fields);

        if (Array.isArray(data)) {
          setPosts(data.data);
        } else {
          setPosts([data.data]);
          data.data.forEach(item => {
            console.log(item);
          });
        }
      })
      .catch(error => console.error(error));
  }, []);


  return (
    <Div style={{ overflowY: 'scroll', height: '100%' }} onWheel={handleWheel}>
      <Container>
        <Posting onClick={() => setShowPopup(true)}>
          <AiOutlinePlusCircle />
        </Posting>
        {showPopup && (
          <Popup>
            <input type="text" placeholder="제목을 입력하세요." onChange={(e) => setTitle(e.target.value)} /><br />
            <textarea placeholder="내용을 입력하세요." onChange={(e) => setContent(e.target.value)} /><br />
            <input type="text" placeholder="총 인원수를 설정하세요." onChange={(e) => setCount(e.target.value)} /><br />
            <input type="text" placeholder="관심분야를 입력하세요." onChange={(e) => setField(e.target.value)} /><br />
            <button onClick={() => setShowPopup(false)}>Cancel</button>
            <button onClick={() => {
              if (title && content && count && field) {
                // Add logic for creating a new post
                addPost();
                setShowPopup(false);
                setTitle("");
                setContent("");
                setCount("");
                setField("");
              } else {
                alert("Please enter all the fields.");
              }
            }}>Create</button>
          </Popup>
        )}

        <Feed>
          <ul>
            {postIds.map((item) => {
              return (
                <Post key={item.recruitmentId}>
                  <li>
                  <NavLink to={`/posts/${item.recruitmentId}`}>
                    <p>{item.recruitmentId}</p>
                    <h2>제목: {item.title}</h2>
                    <p>내용: {item.content}</p>
                    <p>인원수:{item.count}</p>
                    <p>관심분야: {item.field}</p>
                    </NavLink>
                  </li>
                </Post>
              );
            })}
          </ul>
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

// display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "fixed", top: 0, bottom: 0, left: 0, right: 0, backgroundColor: "rgba(0,0,0,0.5)"
const Popup = styled.div`
flexDirection: column;
alignItems: center;
justifyContent: center;
  position: fixed;
  width:700px;
  height:auto;
  top: 50%;
  left: 30%;
  transform: translate(0%, -50%);
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

  .post-content {
    margin-top: 10px;
    font-size: 16px;
    white-space: pre-wrap;
  }
`;


// const Post = styled.div`
//   border: 1px solid #ddd;
//   padding: 20px;
//   width: 500px;
//   height: auto;
//   left: 30%
//   margin: 10px;
//   background-color: #F3F8FF;
//   border-radius: 10px;
// `;
