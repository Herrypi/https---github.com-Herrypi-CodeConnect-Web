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

    const [postImages, setPostImages] = useState([]);

    const accessToken = localStorage.getItem('accessToken');

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    };

    const markdownText = `
# 네이버 링크 공유합니다

[Naver](https://naver.com)

## 샾2개 - 리스트
- 항목 1
- 항목 2
- 항목 3
`;

    const htmlText = '<h1>이것은 HTML 헤더입니다</h1><p>이것은 <strong>강조</strong>된 텍스트입니다</p>';


    const addQnAPost = () => {
        const newQnA = {
            title,
            content,
            base64Image: selectedImage ? selectedImage.replace(/^data:image\/[a-z]+;base64,/, "") : null,
        };

        fetch('http://52.79.53.62:8080/qna/create', {
            method: 'POST',

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


        axios.get(`http://52.79.53.62:8080/qna/search/${keyword}`, { config })
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
        axios.get('http://52.79.53.62:8080/qna/list', { config })
            .then(response => {
                const data = response.data;
                const qnaData = data.data.map(item => {
                    const { commentCount, content, imagePath, profileImagePath, likeCount, currentDateTime, modifiedDateTime, nickname, qnaId, title } = item;

                    setPostImages(prevImages => [...prevImages, `http://52.79.53.62:8080/${profileImagePath}`]);

                    return { commentCount, content, imagePath, profileImagePath, likeCount, currentDateTime, modifiedDateTime, nickname, qnaId, title };
                });
                console.log(data);
                setqnaIds(qnaData);
                setImageList(qnaData.map(item => item.imagePath));
                setProfileImageList(qnaData.map(item => item.profileImagePath));


            })
            .catch(error => console.error(error));
    }, []);

    useEffect(() => {
        if (qnaIds.length === 0) {
            return; // No post data available, exit the useEffect
        }
        // console.log(qnaIds)
        // Create an array to store promises for fetching images
        const imagePromises = qnaIds.map((post) => {
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
                const updatedPostIds = qnaIds.map((post, index) => ({
                    ...post,
                    imageUrl: imageUrls[index], // Add the imageUrl property
                }));

                // Update the state with the updated post data
                setqnaIds(updatedPostIds);
            })
            .catch((error) => {
                console.error('Error fetching images:', error);
            });
    }, [accessToken, qnaIds]);

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
                        <div className='body'>
                            <div className='form-set'>
                                <input
                                    type="text"
                                    placeholder="제목을 입력하세요"
                                    onChange={e => setTitle(e.target.value)}
                                />
                                <textarea className='text'
                                    placeholder="내용을 입력하세요."
                                    onChange={e => setContent(e.target.value)}
                                />
                            </div>
                            <input
                                type="file"
                                accept=".jpeg"
                                id="photo_file"
                                name="photo_file"
                                onChange={handleImageChange}
                            />
                            <div className='btn'>
                            <button className='ok'
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
                            <button className='no' onClick={() => setShowPopupCreat(false)}>Cancel</button>
                            </div>
                        </div>
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
                                                    <img
                                                        className="profile-image"
                                                        src={item.imageUrl ? item.imageUrl : "fallback-profile-image.jpg"} // Provide a fallback profile image URL
                                                        alt="Profile"
                                                    />
                                                )}
                                                <p className="nickname">{item.nickname}</p>
                                            </div>
                                            <li className="qna-post">
                                                <div className="qna-card">
                                                    <h2 className="qna-card-title">{item.title}</h2>
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
                                                    <img
                                                        className="profile-image"
                                                        src={item.imageUrl ? item.imageUrl : "fallback-profile-image.jpg"} // Provide a fallback profile image URL
                                                        alt="Profile"
                                                    />
                                                )}
                                                <p className="nickname">{item.nickname}</p>
                                            </div>
                                            <li className="qna-post">
                                                <div className="qna-card">
                                                    <h2 className="qna-card-title">{item.title}</h2>
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
.body{
    z-index: 9999;
    flex-direction: column;
    align-items: center;
    justifyContent: center;
    position: fixed;
    width:30%;
    height:auto;
    top: 50%;
    left: 41%;
    transform: translate(0%, -50%);
    background-color: #fff;
    padding: 20px;
    border-radius: 15px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
}

.body::before {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5); /* 회색 배경색 및 투명도 설정 */
    z-index: 9998; /* 팝업 창 뒤에 오도록 z-index 조정 */
    display: none;
}

.body.active::before {
    display: block;
}

.form-set {
    display:flex;
    flex-direction:column;
}

.text {
    height: 200px;
    margin-top: 10px;
    border:none;
    border-bottom: 1px solid black;
    resize: none;
}

input {
    border: none;
    margin-top: 10px;
    border-bottom: 1px solid black
  
  }
  
  button {
    width: 100%;
    border-radius: 20px;
  }
  
  .btn {
    display: flex;
  }
  
  .ok {
    border: none;
  
    background-color: #4CAF50;
  }
  
  .no {
    border: none;
  
    background-color: red;
  
  }
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