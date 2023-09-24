import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import Role from '../../userstate/Role';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';

const { localStorage } = window;


function PopupQnAPost({ qnapost, onClose }) {
    const [qnaData, setQnaData] = useState(null);
    const [nickname, setNickname] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [currentDateTime, setCurrentDateTime] = useState('');
    const [hostCMData, setHostCMData] = useState([]);
    const [guestCMData, setGuestCMData] = useState([]);
    const [cmIds, setcmIds] = useState([]);
    const [comment, setComment] = useState('');
    const [position, setPosition] = useState(0);
    const [profileImageList, setProfileImageList] = useState([]);
    const [liked, setLiked] = useState(false);
    const [likedCount, setLikedCount] = useState('')

    const [postImages, setPostImages] = useState([]);


    const accessToken = localStorage.getItem('accessToken');

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    };


    const getColorClass = (field) => {
        switch (field) {
            case '안드로이드':
                return 'color-and';
            case 'ios':
                return 'color-ios';
            case '알고리즘':
                return 'color-algorithm';
            case '데이터베이스':
                return 'color-database';
            case '운영체제':
                return 'color-os';
            case '서버':
                return 'color-server';
            case '웹':
                return 'color-web';
            case '머신러닝':
                return 'color-ml';
            default:
                return '';
        }
    };

    const handleLikeQnaPost = () => {
        axios.put(`http://52.79.53.62:8080/qna/like/${qnapost.qnaId}`, { config })
            .then((response) => {
                const liked = response.data.data.liked;
                const updatedLikeCount = response.data.data.likeCount;

                setLiked(liked);
                setQnaData(prevQnaData => ({
                    ...prevQnaData,
                    likeCount: updatedLikeCount
                }));
                console.log(response.data.data.liked);
            })
            .catch((error) => {
                console.error(error);
            });
    };




    useEffect(() => {
        axios
            .get(`http://52.79.53.62:8080/qna/detail/${qnapost.qnaId}`, { headers: { 'Authorization': `Bearer ${accessToken}` } })
            .then((response) => {
                const data = response.data.data;
                const key1 = Object.keys(data)[0];
                const gcData = data[Role.COMMENT_GUEST]

                const commentHostData = data.COMMENT_HOST ? data.COMMENT_HOST.map(item => {
                    const { cocommentCount, comment, profileImagePath, likeCount, liked, imagePath, commentId, currentDateTime, modifiedDateTime, nickname, qnaId, role } = item;

                    setPostImages(prevImages => [...prevImages, `http://52.79.53.62:8080/${profileImagePath}`]);

                    return { cocommentCount, comment, profileImagePath, likeCount, liked, imagePath, commentId, currentDateTime, modifiedDateTime, nickname, qnaId, role };
                }) : [];
                const commentGuestData = data.COMMENT_GUEST ? data.COMMENT_GUEST.map(item => {
                    const { cocommentCount, comment, profileImagePath, likeCount, liked, imagePath, commentId, currentDateTime, modifiedDateTime, nickname, qnaId, role } = item;

                    return { cocommentCount, comment, profileImagePath, likeCount, liked, imagePath, commentId, currentDateTime, modifiedDateTime, nickname, qnaId, role };
                }) : [];

                const commentAllData = commentHostData.concat(commentGuestData);

                if (key1 === Role.HOST) {
                    qnapost.type = key1;
                } else if (key1 === Role.GUEST) {
                    qnapost.type = key1;
                }

                qnapost.commentData = commentAllData;

                setQnaData(qnapost);
                setLiked(qnapost.liked); // 추가된 코드
                console.log(profileImageList);
                // ------------------------------------------------------------------------
                if(commentAllData.length !== 0){
                    return;
                }
                const imagePromises = commentAllData.map((post) => {
                    const imageUrl = `http://52.79.53.62:8080/${post.profileImagePath}`;
                    console.log(imageUrl);
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
                            const objectURL = URL.createObjectURL(blob);
                            return objectURL;
                        })
                        .catch((error) => {
                            console.error('Error:', error);
                            return null;
                        });
                });

                Promise.all(imagePromises)
                    .then((imageUrls) => {
                        const updateQnaCommetdata = qnapost.commentData.map((post, index) => ({
                            ...post,
                            imageUrl: imageUrls[index],
                        }));
                        setProfileImageList(updateQnaCommetdata);
                    })
                    .catch((error) => {
                        console.error('Error fetching images:', error);
                    });

                // ------------------------------------------------------------------------


                const fetchProfileImages = async () => {
                    if (qnaData && qnaData.commentData) { // Check if qnaData.commentData is not null or undefined
                        const profileImageUrls = await Promise.all(qnaData.commentData.map(async (comment) => {
                            if (comment.profileImagePath) {
                                const response = await axios.get(`http://52.79.53.62:8080/${comment.profileImagePath}`, { responseType: 'arraybuffer', headers: { 'Authorization': `Bearer ${accessToken}` } });
                                const base64Image = Buffer.from(response.data, 'binary').toString('base64');
                                return `data:image/jpeg;base64,${base64Image}`;
                            }
                            return null;
                        }));
                        setProfileImageList(profileImageUrls);
                    } else {
                        // Handle the case where qnaData.commentData is null or undefined
                        // You can set a default value or perform other error handling here
                    }
                };


                fetchProfileImages();

            })
            .catch((error) => {
                console.log(error);
            })

    }, [qnapost.qnaId, accessToken]);
    // --------------------------------------------------------------------------------

    // useEffect(() => {


    //     if (qnaData.commentData.length === 0) {
    //         return;
    //     }
    //     const image_profile = qnaData.commentData.map((comment) => {
    //         const imageUrl = `http://52.79.53.62:8080/${comment.profileImagePath}`;
    //         const token = accessToken;

    //         return fetch(imageUrl, {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         })
    //             .then((response) => {
    //                 if (!response.ok) {
    //                     throw new Error('Network response was not ok');
    //                 }
    //                 return response.blob();
    //             })
    //             .then((blob) => {
    //                 // Create an object URL from the blob
    //                 const objectURL = URL.createObjectURL(blob);
    //                 return objectURL;
    //             })
    //             .catch((error) => {
    //                 console.error('Error:', error);
    //                 return null; // Handle errors by returning null
    //             });
    //     });
    //     Promise.all(image_profile)
    //         .then((imageUrls) => {
    //             const updateQnaCommetdata = qnaData.commentData.map((post, index) => ({
    //                 ...post,
    //                 imageUrl: imageUrls[index],
    //             }));

    //             setQnaData(updateQnaCommetdata);
    //         })
    //         .catch((error) => {
    //             console.error('Error fetching images:', error);
    //         });
    // }, [qnaData, qnapost.qnaId, accessToken])
    // --------------------------------------------------------------------------------

    useEffect(() => {
        if (qnaData) {
            setNickname(qnaData.nickname);
            setTitle(qnaData.title);
            setContent(qnaData.content);
            setCurrentDateTime(qnaData.currentDateTime);
            setProfileImageList(qnaData.profileImagePath);
            setLiked(qnaData.liked);
            setLikedCount(qnaData.likeCount);


        } else {
            setNickname('');
            setTitle('');
            setContent('');
            setCurrentDateTime('');
            setProfileImageList('');
            setLiked('');
            setLikedCount('');

        }
        // console.log(qnaData);
    }, [qnaData]);

    // console.log(qnaData);
    const handleSubmit = (e) => {
        e.preventDefault(); // 폼의 기본 동작을 막습니다.

        // 댓글을 작성하는 API로 댓글을 전송합니다.
        axios.post(`http://52.79.53.62:8080/comment/create/${qnapost.qnaId}`, {
            comment,
        }, { config })
            .then((response) => {
                // console.log(response.data);
                setComment('');
                setQnaData(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
        onClose();
    };

    const handleDeleteComment = (commentId) => {
        axios.delete(`http://52.79.53.62:8080/comment/delete/${commentId}`, { config })
            .then(response => {
                // console.log(response.data);
                // 댓글 삭제 후 새로운 댓글 목록을 가져올 수 있도록 API를 호출하거나, qnaData.commentData 배열에서 삭제된 댓글을 제거할 수 있습니다.
            })
            .catch(error => {
                console.log(error);
            })
    }

    const handleDeleteQnaPost = () => {
        axios.delete(`http://52.79.53.62:8080/qna/delete/${qnapost.qnaId}`, { config })
            .then(response => {
                onClose();
                // console.log(response.data);
            })
            .catch(error => {
                console.error(error);
            })
    }

    function handleWheel(event) {
        // Update the position based on the amount of scrolling
        setPosition(position + event.deltaY);
    }


    return (
        <>
            {qnaData && (
                <>
                    <ModalContainer onClick={onClose} />

                    <PopupContainer>

                        {qnaData.type === Role.HOST && (
                            <>
                                <PostsContainer onWheel={handleWheel}>
                                    <div className="qna-card-profile">
                                        <img
                                            className="profile-image"
                                            src={"http://52.79.53.62:8080/" + qnapost.profileImagePath}
                                            alt="프로필이미지"
                                        />
                                        <p>{qnaData.nickname}</p>
                                    </div>
                                    <h2 className="mb-4">{qnaData.title}</h2>
                                    <div onWheel={handleWheel}>
                                        {qnaData.imagePath && ( //게시물 내용에 들어가는 사진
                                            <img
                                                className="qna-card-image"
                                                src={"http://52.79.53.62:8080/" + qnaData.imagePath}
                                                alt="게시글이미지"
                                            />
                                        )}
                                        <div dangerouslySetInnerHTML={{ __html: qnaData.content }} />
                                    </div>
                                </PostsContainer>
                                <div className="qna-card-buttons">
                                    <button className="btn btn-danger me-3" onClick={handleDeleteQnaPost}>
                                        삭제
                                    </button>
                                    <button className="btn btn-primary">수정</button>
                                </div>
                                <div className="like-count-container">
                                    <img
                                        className="heart-icon"
                                        src={`Images/logos/${qnapost.liked ? 'pinkheart' : 'heart'}.png`} // 변경된 코드
                                        alt="하트 아이콘"
                                        onClick={handleLikeQnaPost}
                                    />
                                    <p style={{ marginTop: '15px' }} className="like-count">{qnaData.likeCount}</p>
                                </div>
                                <hr />
                                <CommentContainer onWheel={handleWheel}>
                                    {qnaData.commentData
                                        .sort((a, b) => a.commentId - b.commentId)
                                        .map((comment) => {
                                            if (comment.role === Role.COMMENT_GUEST) {
                                                return (
                                                    <p key={comment.commentId}>
                                                        {comment.profileImagePath && (
                                                            <img
                                                                className="profile-image"
                                                                src={"http://52.79.53.62:8080/" + comment.profileImagePath}
                                                                alt="프로필이미지"
                                                            />
                                                        )}
                                                        {comment.nickname}: {comment.comment}
                                                    </p>
                                                );
                                            } else if (comment.role === Role.COMMENT_HOST) {
                                                return (
                                                    <p key={comment.commentId}>
                                                        {comment.profileImagePath && (
                                                            <img
                                                                className="profile-image"
                                                                src={"http://52.79.53.62:8080/" + comment.profileImagePath}
                                                                alt="프로필이미지"
                                                            />
                                                        )}
                                                        {comment.nickname}: {comment.comment}{" "}
                                                        <button onClick={() => handleDeleteComment(comment.commentId)}>
                                                            삭제
                                                        </button>
                                                    </p>
                                                );
                                            } else {
                                                return null;
                                            }
                                        })}
                                </CommentContainer>


                                <form onSubmit={handleSubmit} className="mb-3">
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="댓글을 입력하세요"
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                        />
                                        <button type="submit" className="btn btn-primary">
                                            <FontAwesomeIcon icon={faPaperPlane} />
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}

                        {qnaData.type === Role.GUEST && (
                            <>
                                <PostsContainer onWheel={handleWheel}>

                                    <div className="qna-card-profile">
                                        <img
                                            className="profile-image"
                                            src={"http://52.79.53.62:8080/" + qnapost.profileImagePath}
                                            alt="프로필이미지"
                                        />
                                        <p>{qnaData.nickname}</p>
                                    </div>
                                    <h2 className="mb-4">{qnaData.title}</h2>
                                    {qnaData.imagePath && (
                                        <img
                                            className="qna-card-image"
                                            src={"http://52.79.53.62:8080/" + qnaData.imagePath}
                                            alt="게시글이미지"
                                        />
                                    )}
                                    <div dangerouslySetInnerHTML={{ __html: qnaData.content }} />
                                </PostsContainer>
                                <div className="like-count-container">
                                    <img
                                        className="heart-icon"
                                        src={`Images/logos/${qnapost.liked ? 'pinkheart' : 'heart'}.png`}
                                        alt="하트 아이콘"
                                        onClick={handleLikeQnaPost}
                                    />
                                    <p style={{ marginTop: '15px' }} className="like-count">{qnaData.likeCount}</p>
                                </div>
                                <hr />
                                <CommentContainer onWheel={handleWheel}>
                                    {qnaData.commentData
                                        .sort((a, b) => a.commentId - b.commentId)
                                        .map((comment) => {
                                            if (comment.role === Role.COMMENT_GUEST) {
                                                return (
                                                    <>
                                                        <p key={comment.commentId}>
                                                            {comment.profileImagePath && (
                                                                <img
                                                                    className="profile-image"
                                                                    src={"http://52.79.53.62:8080/" + comment.profileImagePath}
                                                                    alt="프로필이미지"
                                                                />
                                                            )}
                                                            {comment.nickname}: {comment.comment}
                                                        </p>
                                                    </>
                                                );
                                            } else if (comment.role === Role.COMMENT_HOST) {
                                                return (
                                                    <>
                                                        <p key={comment.commentId}>
                                                            {comment.profileImagePath && (
                                                                <img
                                                                    className="profile-image"
                                                                    src={comment.imageUrl ? comment.imageUrl : "fallback-profile-image.jpg"}
                                                                    alt="프로필이미지"
                                                                />
                                                            )}
                                                            {comment.nickname}: {comment.comment}{" "}
                                                            <button onClick={() => handleDeleteComment(comment.commentId)}>
                                                                삭제
                                                            </button>
                                                        </p>
                                                    </>
                                                );
                                            } else {
                                                return null;
                                            }
                                        })}
                                </CommentContainer>
                                <form onSubmit={handleSubmit} className="mb-3">
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="댓글을 입력하세요"
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                        />
                                        <button type="submit" className="btn btn-primary">
                                            <FontAwesomeIcon icon={faPaperPlane} />
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </PopupContainer>
                </>
            )}
        </>
    );
}

export default PopupQnAPost

const ModalContainer = styled.div`
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.6);
            z-index: 99;
            `;

const PopupContainer = styled.div`
            position: fixed;
            top: 50%;
            left: 50%;
            width: 500px;
            height: 800px;
            transform: translate(-50%, -50%);
            z-index: 9990;
            background-color: white;
            padding: 20px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
            overflow: hidden;

            .form {
                margin - bottom: 20px;
  }
            .qna-card-image {
                width: 450px;
            max-height: 200px; /* 원하는 높이로 조절하세요 */
            object-fit: contain; /* 이미지 비율 유지를 위한 옵션입니다. 필요에 따라 변경할 수 있습니다. */
    

  }
            .profile-image {
                width: 30px;
            height: 30px;
            border-radius: 50%;
            object-fit: cover;
            margin-right: 10px;
  }
            .qna-card-profile {
                display: flex;
            align-items: center;
            margin-right: 20px;
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
            .qna-card-buttons{
                display: flex;
            justify-content: flex-end;
  }
            `;

const CommentContainer = styled.div`
            overflow-y: auto;
            height: 200px;
            margin-top: 10px;

            .profile-image {
                width: 30px;
            height: 30px;
            border-radius: 50%;
            object-fit: cover;
            margin-right: 10px;
  }
            `;

const PostsContainer = styled.div`
            overflow-y: auto;
            height: 400px;
            `;
