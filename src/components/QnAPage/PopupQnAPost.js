import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import Role from '../../userstate/Role';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

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
        axios.put(`http://13.124.68.20:8080/qna/like/${qnapost.qnaId}`)
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
            .get(`http://13.124.68.20:8080/qna/detail/${qnapost.qnaId}`)
            .then((response) => {
                const data = response.data.data;
                const key1 = Object.keys(data)[0];
                const gcData = data[Role.COMMENT_GUEST]

                const commentHostData = data.COMMENT_HOST ? data.COMMENT_HOST.map(item => {
                    const { cocommentCount, comment, profileImagePath, likeCount, liked, imagePath, commentId, currentDateTime, modifiedDateTime, nickname, qnaId, role } = item;
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
                console.log(data);

                setQnaData(qnapost);
                setLiked(qnapost.liked); // 추가된 코드

            })
            .catch((error) => {
                console.log(error);
            })
    }, [qnapost.qnaId]);


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
        axios.post(`http://13.124.68.20:8080/comment/create/${qnapost.qnaId}`, {
            comment,
        })
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
        axios.delete(`http://13.124.68.20:8080/comment/delete/${commentId}`)
            .then(response => {
                // console.log(response.data);
                // 댓글 삭제 후 새로운 댓글 목록을 가져올 수 있도록 API를 호출하거나, qnaData.commentData 배열에서 삭제된 댓글을 제거할 수 있습니다.
            })
            .catch(error => {
                console.log(error);
            })
    }

    const handleDeleteQnaPost = () => {
        axios.delete(`http://13.124.68.20:8080/qna/delete/${qnapost.qnaId}`)
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
                                            src={"http://13.124.68.20:8080/" + qnapost.profileImagePath}
                                            alt="게시글이미지"
                                        />
                                        <p>{qnaData.nickname}</p>
                                    </div>
                                    <h2 className="mb-4">{qnaData.title}</h2>
                                    <div onWheel={handleWheel}>
                                        {qnaData.imagePath && ( //게시물 내용에 들어가는 사진
                                            <img
                                                className="qna-card-image"
                                                src={"http://13.124.68.20:8080/" + qnaData.imagePath}
                                                alt="게시글이미지"
                                            />
                                        )}
                                        <p>{qnaData.content}</p>
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
                                                                src={"http://13.124.68.20:8080/" + comment.profileImagePath}
                                                                alt="게시글이미지"
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
                                                                src={"http://13.124.68.20:8080/" + comment.profileImagePath}
                                                                alt="게시글이미지"
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
                                            src={"http://13.124.68.20:8080/" + qnapost.profileImagePath}
                                            alt="게시글이미지"
                                        />
                                        <p>{qnaData.nickname}</p>
                                    </div>
                                    <h2 className="mb-4">{qnaData.title}</h2>
                                    {qnaData.imagePath && (
                                        <img
                                            className="qna-card-image"
                                            src={"http://13.124.68.20:8080/" + qnaData.imagePath}
                                            alt="게시글이미지"
                                        />
                                    )}
                                    <p>{qnaData.content}</p>
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
                                                                    src={"http://13.124.68.20:8080/" + comment.profileImagePath}
                                                                    alt="게시글이미지"
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
                                                                    src={"http://13.124.68.20:8080/" + comment.profileImagePath}
                                                                    alt="게시글이미지"
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
            height: 750px;
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
