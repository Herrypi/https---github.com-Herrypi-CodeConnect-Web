import axios from 'axios';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import PopupQnAPost from './PopupQnAPost';

const { localStorage } = window;

function QnAPanel() {
    const [position, setPosition] = useState(0);
    const [qnaIds, setqnaIds] = useState([]);
    const [qnAPost, setQnAPosts] = useState([]);
    const [showPopupCreat, setShowPopupCreat] = useState(false);
    const [nickname] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [currentDateTime] = useState('');
    const [searchText, setSearchText] = useState('');
    const [searchResult, setSearchResult] = useState([]);

    const [selectedQnA, setSelectedQnA] = useState(null);
    const [showQnAPost, setShowQnAPost] = useState(null);

    const [imageList, setImageList] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);

    const [profileImageList, setProfileImageList] = useState([]);

    const accessToken = localStorage.getItem('accessToken');

    const config = {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    };

    const addQnAPost = () => {
        const newQnA = {
            title,
            content,
            base64Image: selectedImage ? selectedImage.replace(/^data:image\/[a-z]+;base64,/, "") : null,
        };

        fetch('http://52.79.53.62:8080/qna/create', {
            method: 'POST',
            config,
            body: JSON.stringify(newQnA)
        })
            .then(response => response.json())
            .then(data => {
                setQnAPosts(prevQnAPosts => [...prevQnAPosts, data]);
            })
            .catch(error => console.error(error));
    }

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const imageData = reader.result;
                setSelectedImage(imageData);
                console.log(imageData);
            };
            reader.readAsDataURL(file);
        }
    };

    const searchQnAPosts = () => {
        const keyword = searchText === '' ? null : searchText;


        axios.get(`http://52.79.53.62:8080/qna/search/${keyword}`, config)
            .then(response => {
                const data = response.data;
                const qnaData = data.data.map(item => {
                    const { commentCount, content, imagePath, profileImagePath, likeCount, currentDateTime, modifiedDateTime, nickname, qnaId, title } = item;
                    return { commentCount, content, imagePath, profileImagePath, likeCount, currentDateTime, modifiedDateTime, nickname, qnaId, title };
                });
                setSearchResult(qnaData);
            })
            .catch(error => console.error(error));
    }

    function handleQnAClick(qnapost) {
        setSelectedQnA(qnapost);
        setShowQnAPost(true);
    }

    function handleWheel(event) {
        // Update the position based on the amount of scrolling
        setPosition(position + event.deltaY);
    }

    useEffect(() => {
        axios.get('http://52.79.53.62:8080/qna/list', config)
            .then(response => {
                const data = response.data;
                const qnaData = data.data.map(item => {
                    const { commentCount, content, imagePath, profileImagePath, likeCount, currentDateTime, modifiedDateTime, nickname, qnaId, title } = item;
                    return { commentCount, content, imagePath, profileImagePath, likeCount, currentDateTime, modifiedDateTime, nickname, qnaId, title };
                });
                console.log(data);
                setqnaIds(qnaData);
                setImageList(qnaData.map(item => item.imagePath));
                setProfileImageList(qnaData.map(item => item.profileImagePath));
            })
            .catch(error => console.error(error));
    }, []);

    return (
        <Div>
            <Div1>
                <Posting onClick={() => setShowPopupCreat(true)}>
                    <AiOutlinePlusCircle />
                </Posting>
                <Label>Q&A 게시판</Label>

                <SearchQnAFeed>
                    <input
                        type="text"
                        placeholder="검색어를 입력하세요"
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                    />
                    <button onClick={searchQnAPosts}>검색</button>
                </SearchQnAFeed>

                {showPopupCreat && (
                    <PopupCreat>
                        <input
                            type="text"
                            placeholder="제목을 입력하세요"
                            onChange={e => setTitle(e.target.value)}
                        />
                        <br />
                        <textarea
                            placeholder="내용을 입력하세요."
                            onChange={e => setContent(e.target.value)}
                        />
                        <br />
                        <input
                            type="file"
                            accept=".jpeg"
                            id="photo_file"
                            name="photo_file"
                            onChange={handleImageChange}
                        />
                        <br />
                        <button onClick={() => setShowPopupCreat(false)}>Cancel</button>
                        <button
                            onClick={() => {
                                if (title && content) {
                                    addQnAPost();
                                    setShowPopupCreat(false);
                                    setTitle('');
                                    setContent('');
                                    setSelectedImage(null);
                                } else {
                                    alert('빈칸을 채워 주세요.');
                                }
                            }}
                        >
                            Create
                        </button>
                    </PopupCreat>
                )}
            </Div1>
            <Container>
                <QnapostContainer onWheel={handleWheel}>
                    <QnAFeed>
                        <StyledQnAFeed>
                            <ul className="list-unstyled">
                                {searchResult.length > 0 ? (
                                    searchResult.map((item, index) => (
                                        <QnAPost key={item.qnaId} onClick={() => handleQnAClick(item)}>
                                            <div className="qna-card-profile">
                                                {item.profileImagePath && (
                                                    <img className="profile-image" src={"http://52.79.53.62:8080/" + item.profileImagePath} alt="프로필 이미지" />
                                                )}
                                                <p className="nickname">{item.nickname}</p>
                                            </div>
                                            <li className="qna-post">
                                                <div className="qna-card">
                                                    <h2 className="qna-card-title">{item.title}</h2>
                                                    <p className="qna-card-content">내용: {item.content}</p>
                                                    <p className="qna-card-time">시간: {item.currentDateTime}</p>
                                                    <div className="like-count-container">
                                                        <img className="heart-icon" src="Images/logos/heart.png" alt="하트 아이콘" />
                                                        <p className="like-count">{item.likeCount}</p>
                                                        <img style={{ marginLeft: '15px' }} className="heart-icon" src="Images/logos/coment.png" alt="댓글 아이콘" />
                                                        <p style={{ marginTop: '15px' }} className="like-count">{item.commentCount}</p>
                                                    </div>
                                                </div>
                                            </li>
                                        </QnAPost>


                                    ))
                                ) : (
                                    qnaIds.map((item, index) => (
                                        <QnAPost key={item.qnaId} onClick={() => handleQnAClick(item)}>
                                            <div className="qna-card-profile">
                                                {item.profileImagePath && (
                                                    <img className="profile-image" src={"http://52.79.53.62:8080/" + item.profileImagePath} alt="프로필 이미지" />
                                                )}
                                                <p className="nickname">{item.nickname}</p>
                                            </div>
                                            <li className="qna-post">
                                                <div className="qna-card">
                                                    <h2 className="qna-card-title">{item.title}</h2>

                                                    <p className="qna-card-content">내용: {item.content}</p>
                                                    <p className="qna-card-time">
                                                        시간: {item.currentDateTime}
                                                    </p>
                                                    <div className="like-count-container">
                                                        <img className="heart-icon" src="Images/logos/heart.png" alt="하트 아이콘" />
                                                        <p style={{ marginTop: '15px' }} className="like-count">{item.likeCount}</p>
                                                        <img style={{ marginLeft: '15px' }} className="heart-icon" src="Images/logos/coment.png" alt="댓글 아이콘" />
                                                        <p style={{ marginTop: '15px' }} className="like-count">{item.commentCount}</p>


                                                    </div>
                                                </div>
                                            </li>
                                        </QnAPost>
                                    ))
                                )}
                            </ul>
                        </StyledQnAFeed>

                        {showQnAPost && (
                            <PopupQnAPost qnapost={selectedQnA} onClose={() => setShowQnAPost(false)} />
                        )}
                    </QnAFeed>
                </QnapostContainer>
            </Container>
        </Div>
    );
}

export default QnAPanel;


{/* <div className="rounded-circle profile-img mr-3">👤</div> */ }

const Div = styled.div`
height:100%;
`;
const Div1 = styled.div`
background-color: #2F4074;
padding-bottom:20px;

`;

const Container = styled.div`
height: 100%;
background-color: white;

`;
const QnAFeed = styled.div`
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
padding-top: 20px;

`;

const QnAPost = styled.div`
  border: 1px solid #ddd;
  padding: 20px;
  width: 650px;
  height: auto;
  margin: 10px;
  background-color: #F3F8FF;
  border-radius: 10px;

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

  .post-content {
    margin-top: 10px;
    font-size: 16px;
    white-space: pre-wrap;
  }
  .qna-card-image {
    max-width: 100%;
    max-height: 300px; /* 원하는 높이로 조절하세요 */
    object-fit: contain; /* 이미지 비율 유지를 위한 옵션입니다. 필요에 따라 변경할 수 있습니다. */
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

const Posting = styled.div`
font-size: 40px;
cursor: pointer;
position: fixed;
margin: 25px;
top: 130px;

`;
const PopupCreat = styled.div`
z-index: 9999;
flexDirection: column;
alignItems: center;
justifyContent: center;
  position: fixed;
  width:700px;
  height:500px;
  top: 50%;
  left: 30%;
  transform: translate(0%, -50%);
  background-color: white;
  padding: 20px;
  border: 1px solid black;
  
`;

const SearchQnAFeed = styled.div`
display: flex;
justify-content: center;
align-items: center;
padding-top: 20px;

`;

const QnapostContainer = styled.div`
overflow-y: auto;
  height: 750px;
  margin-top: 10px;
`

const StyledQnAFeed = styled.div`
  .qna-post {
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
  }

  .profile-icon {
    font-size: 2rem;
    margin-right: 0.5rem;
  }

  .qna-card {
    background-color: #f8f9fa;
    border-radius: 10px;
    padding: 1rem;
    width: 100%;
  }

  .qna-card-title {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  .qna-card-content {
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }

  .qna-card-time {
    font-size: 0.8rem;
    color: gray;
  }
`;
const Label = styled.label`
    display:flex;
  font-size: 30px;
  padding-top: 30px;
  margin-bottom: 0.5rem;
  margin-left: 360px;
  color: white;
  font-weight: bolder;
`;