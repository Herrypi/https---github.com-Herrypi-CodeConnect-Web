import axios from 'axios'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import PopupQnAPost from '../../QnAPage/PopupQnAPost';

const { localStorage } = window;


function RightSidePanel() {
  const [popularPosts, setPopularPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [position, setPosition] = useState(0);
  const accessToken = localStorage.getItem('accessToken');

  function handleWheel(event) {
    // Update the position based on the amount of scrolling
    setPosition(position + event.deltaY);
  }

  useEffect(() => {
    axios.get(`http://52.79.53.62:8080/qna/popular`)
      .then((response) => {
        const data = response.data
        console.log(data)
        const popularPostsData = data.data.map(item => {
          const { commentCount, content, imagePath, currentDateTime, likeCount, liked, nickname, profileImagePath, qnaId, title } = item;
          return { commentCount, content, imagePath, currentDateTime, likeCount, liked, nickname, profileImagePath, qnaId, title };
        });
        setPopularPosts(popularPostsData);
      })
      .catch(error => console.error(error));
  }, []);

  const handlePostClick = (post) => {
    setSelectedPost(post);
  };

  useEffect(() => {
    if (popularPosts.length === 0) {
      return; // No post data available, exit the useEffect
    }

    // Create an array to store promises for fetching images
    const imagePromises = popularPosts.map((post) => {
      const imageUrl = `http://52.79.53.62:8080/${post.profileImagePath}`;
      const token = accessToken;

      return fetch(imageUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.blob();
        })
        .then((blob) => {
          // Create an object URL from the blob
          const objectURL = URL.createObjectURL(blob);
          return objectURL;
        })
        .catch((error) => {
          console.error('Error:', error);
          return null; // Handle errors by returning null
        });
    });

    // Wait for all image fetch promises to resolve
    Promise.all(imagePromises)
      .then((imageUrls) => {
        // Set the image URLs to the respective posts
        const updatedPostIds = popularPosts.map((post, index) => ({
          ...post,
          imageUrl: imageUrls[index], // Add the imageUrl property
        }));

        // Update the state with the updated post data
        setPopularPosts(updatedPostIds);
      })
      .catch((error) => {
        console.error('Error fetching images:', error);
      });
  }, [accessToken, popularPosts]);

  return (
    <Container>
      <Headers><img className="heart-icon" src="Images/logos/pinkheart.png" /> 많은 Q&A</Headers>
      <Div onWheel={handleWheel}>
        {popularPosts.map((post) => (
          <PostItem key={post.qnaId} onClick={() => handlePostClick(post)}>
            <div className="qna-card-profile">
              <img className="profile-image" src={post.imageUrl ? post.imageUrl : "fallback-profile-image.jpg"} alt="프로필 이미지" />
              <p style={{ marginTop: '15px' }} className="nickname">{post.nickname}</p>
            </div>
            <h2 className='qna-card-title'>{post.title}</h2>
            {/* <p>{post.content}</p> */}
            <div className="like-count-container">
              <img className="heart-icon" src="Images/logos/heart.png" alt="하트 아이콘" />
              <p className="like-count" style={{ marginTop: '15px' }}>{post.likeCount}</p>
              <img style={{ marginLeft: '15px' }} className="heart-icon" src="Images/logos/coment.png" alt="댓글 아이콘" />
              <p style={{ marginTop: '15px' }} className="like-count">{post.commentCount}</p>
            </div>
          </PostItem>
        ))}
        {selectedPost && (
          <PopupQnAPost qnapost={selectedPost} onClose={() => setSelectedPost(null)} />
        )}
      </Div>
    </Container>
  )
}

export default RightSidePanel

const Container = styled.div`
  width: 66%;
  height: 100%;
  background-color: white;
  /* 추가된 스타일 */
  overflow: hidden;
  padding-bottom: 10px;
  
`;
const Headers = styled.div`
font-weight: bold;
  color: white;
  background-color: #2F4074;
  display: flex;
  justify-content: center;
  align-items: center;
  
  .heart-icon {
    width: 30px;
    height: 30px;
    object-fit: cover;
    margin-right: 10px;
  }

`;

const PostItem = styled.div`
  margin-top: 10px;
  cursor: pointer;
  margin-bottom: 10px;
  margint: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #F3F8FF;

  &:hover {
    background-color: #f5f5f5;
  }
  .qna-card-profile {
    display: flex;
    align-items: center;
    margin-right: 20px;
  }
  .profile-image {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 10px;
  }

  .nickname {
    font-weight: bold;
  }
  .qna-card-title {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }
  .heart-icon{
    width: 30px;
    height: 30px;
    object-fit: cover;
    margin-right: 10px;
  }
  .like-count-container{
    display: flex;
    align-items: center;
    margin-right: 20px;
  }
`;

const Div = styled.div`
overflow-y: auto;
height: 100%;


`;