import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import axios from 'axios';
import Role from '../../../userstate/Role';

function Dialog({ onClose }) {
    return (
      <div className="dialog">
        <p>참가 신청이 완료 되었습니다!</p>
        <button onClick={onClose}>확인</button>
      </div>
    );
  }

function PopupPost({ post, onClose }) {
    const [popupData, setPopupData] = useState(null);
    const [nickname, setNickname] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [count, setCount] = useState('');
    const [field, setField] = useState('');
    const [currentCount, setCurrentCount] = useState('');
    const [isParticipating, setIsParticipating] = useState(false);
    const [showModal, setShowModal] = useState(false);


    const [isDialogOpen, setIsDialogOpen] = useState(false);



    const handleParticipate = () => {
        const token = localStorage.getItem('token'); // 로그인한 사용자의 토큰값
        axios.put(`http://112.154.249.74:8080/recruitments/participate/${post.recruitmentId}?isParticipating=true`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                setIsParticipating(true);
                console.log(response.data);
            })
            .catch(error => {
                console.error(error);
            });
            setIsDialogOpen(true);

    }

    const handleCloseDialog = () => {
        // 다이얼로그 닫기
        setIsDialogOpen(false);
      };

    const handleCancel = () => {
        const token = localStorage.getItem('token'); // 로그인한 사용자의 토큰값
        axios.put(`http://112.154.249.74:8080/recruitments/participate/${post.recruitmentId}?isParticipating=false`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                setIsParticipating(false);
                console.log(response.data)
            })
            .catch(error => {
                console.error(error);
            });
    }



    const handleDeletePost = () => {
        axios.delete(`http://112.154.249.74:8080/recruitments/delete/${post.recruitmentId}`)
            .then(response => {
                onClose();
                console.log(response.data)

            })
            .catch(error => {
                console.error(error);
            })
    }

    const handleUpdatePost = () => {
        const updatedPost = {
            title: title || popupData.title,
            content: content || popupData.content,
            count: count || popupData.count,
            field: field || popupData.field,
        };
        axios
            .put(`http://112.154.249.74:8080/recruitments/update/${post.recruitmentId}`, updatedPost)
            .then((response) => {
                setPopupData(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
            setShowModal(false);

    };

    useEffect(() => {
        axios
            .get(`http://112.154.249.74:8080/recruitments/${post.recruitmentId}`)
            .then((response) => {
                const data = response.data.data;
                // const hostData = data[Role.HOST];
                // const guestData = data[Role.GUEST];
                const participationData = data[Role.PARTICIPATION];
                const firstKey = Object.keys(data)[0];
                console.log(data);
                if (firstKey === Role.HOST) {
                    post.type = firstKey;
                } else if(firstKey === Role.GUEST || firstKey === Role.PARTICIPATION) {
                    post.type = firstKey;
                } 

                console.log(data);
                setPopupData(post);
                setIsParticipating(participationData);

            })
            .catch((error) => {
                console.error(error);
            });
    }, [post.recruitmentId]);

    useEffect(() => {
        if (popupData) {
            setNickname(popupData.nickname);
            setTitle(popupData.title);
            setContent(popupData.content);
            setCount(popupData.count);
            setField(popupData.field);
            setCurrentCount(popupData.currentCount);
        }
    }, [popupData]);
    
    return (
        <>
            {popupData && (
                <>
                    <ModalContainer onClick={onClose} />
                    
                    <PopupContainer>
                        {popupData.type === Role.HOST && (
                            <>
                            {/* <p>HOST 전용 내용</p> */}
                            <h2>{popupData.title}</h2>
                            <p>{popupData.content}</p>
                            <p>인원수: {popupData.currentCount}/{popupData.count}</p>
                            <p>관심분야: {popupData.field}</p>
                            <button onClick={() => setShowModal(true)}>수정</button>
                            <button onClick={handleDeletePost}>삭제</button>
                            
                          </>                  
                        )}
                        

                        {popupData.type === Role.GUEST && (
                            <>
                                {/* <p>GUEST 전용 내용</p> */}
                                <h2>{popupData.title}</h2>
                                <p>{popupData.content}</p>
                                <p>인원수: {popupData.currentCount}/{popupData.count}</p>
                                <p>관심분야: {popupData.field}</p>
                                {isParticipating ? (
                                    <button onClick={handleCancel}>취소하기</button>
                                ) : (
                                    <button onClick={handleParticipate}>참여하기</button>
                                )}
                                <Dialoging>
                                      {isDialogOpen && <Dialog onClose={handleCloseDialog} />}
                                </Dialoging>
                            </>
                        )}
                        {popupData.type === Role.PARTICIPATION && (
                            <>
                                {/* <p>GUEST 전용 내용</p> */}
                                <h2>{popupData.title}</h2>
                                <p>내용: {popupData.content}</p>
                                <p>인원수: {popupData.currentCount}/{popupData.count}</p>
                                <p>관심분야: {popupData.field}</p>
                                {isParticipating ? (
                                    <button onClick={handleCancel}>취소하기</button>
                                ) : (
                                    <button onClick={handleParticipate}>참여하기</button>
                                )}
                                

                            </>
                            
                        )}
                    </PopupContainer>
                    {showModal && (
  <Modal>
    <form onSubmit={handleUpdatePost}>
      제목<input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      내용<textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      인원수<input
        type="text"
        value={count}
        onChange={(e) => setCount(e.target.value)}
      />
      관심분야<input
        type="text"
        value={field}
        onChange={(e) => setField(e.target.value)}
      />
      <button type="submit">저장</button>
      <button type="button" onClick={() => setShowModal(false)}>
        취소
      </button>
    </form>
  </Modal>
)}
                </>
            )}
            
        </>
    );

}
export default PopupPost;

const PopupContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  width: 500px;
  height: auto;
  transform: translate(-50%, -50%);
  z-index: 9990;
  background-color: white;
  padding: 20px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  overflow: hidden;
`;

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 99;
`;

const Modal = styled.div`
z-index: 9998;

  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  form {
    background-color: #fff;

    padding: 20px;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    input,
    textarea {
      margin-bottom: 10px;
      padding: 10px;
      border-radius: 4px;
      border: 1px solid #ddd;
    }
    button {
      margin-top: 10px;
      padding: 10px;
      border-radius: 4px;
      border: none;
      background-color: #1976d2;
      color: #fff;
      cursor: pointer;
      &:hover {
        background-color: #115293;
      }
    }
  }
`;

const Dialoging = styled.div`
z-index: 9999;
`;

// if (hostData) {
                //     setPopupData(hostData);
                //   } else if (guestData) {
                //     setPopupData(guestData);
                //   } else if (participationData) {
                //     setIsParticipating(participationData);
                //   }
                //   console.log(data);
                // const firstKey = Object.keys(data);
                // console.log(firstKey);

                // if (firstKey === 'HOST') {
                //     setPopupData(firstKey);
                // } else if (firstKey === 'GUEST' || firstKey === 'PARTICIPATION') {

                //       if (firstKey === 'GUEST') {
                //         console.log(firstKey);
                //         setPopupData(firstKey);
                //       } else {
                //         setIsParticipating(firstKey);
                //         const secondKey = Object.keys(data)[1]
                //         console.log(secondKey);
                //         setPopupData(secondKey);
                //     }
                //     };

                // console.log(host, guest, participation);
                // console.log(keys)
               

//-----------------------------------------------------------------------------------



                // const userType = post.nickname === hostData.nickname ? Role.HOST : Role.GUEST;

                // const isParticipating = participationData[post.nickname];

                // console.log(userType);

                // setPopupData({ ...popupData, userType, isParticipating, ...data[userType] });