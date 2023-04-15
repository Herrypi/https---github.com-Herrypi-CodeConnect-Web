import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PostDetail({ match }) {
  const { id } = match.params;
  const [post, setPost] = useState(null);
  
  useEffect(() => {
    axios.get(`http://112.154.249.74:8080/recruitments/${id}`)
      .then(response => {
        const data = response.data.data;
        setPost(data);
      })
      .catch(error => console.error(error));
  }, [id]);

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <p>인원수: {post.count}</p>
      <p>관심분야: {post.field}</p>
      {/* 여기서부터 추가해주세요 */}
      <p>HOST: {post.host}</p>
      <p>GUEST: {post.guest}</p>
      {/* 여기까지 */}
    </div>
  );
}

export default PostDetail;
