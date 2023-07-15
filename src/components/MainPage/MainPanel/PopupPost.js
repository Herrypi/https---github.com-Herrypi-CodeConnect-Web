import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Role from '../../../userstate/Role';

function Dialog({ onClose }) {
  return (
    <DialogContainer>
      <p>참가 신청이 완료 되었습니다!</p>
      <Button onClick={onClose}>확인</Button>
    </DialogContainer>
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


  const handleParticipate = () => {
    const token = localStorage.getItem('token');
    axios
      .put(
        `http://13.124.68.20:8080/recruitments/participate/${post.recruitmentId}?isParticipating=true`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setIsParticipating(true);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleCancel = () => {
    const token = localStorage.getItem('token');
    axios
      .put(
        `http://13.124.68.20:8080/recruitments/participate/${post.recruitmentId}?isParticipating=false`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setIsParticipating(false);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleDeletePost = () => {
    axios
      .delete(`http://13.124.68.20:8080/recruitments/delete/${post.recruitmentId}`)
      .then((response) => {
        onClose();
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleUpdatePost = () => {
    const updatedPost = {
      title: title || popupData.title,
      content: content || popupData.content,
      count: count || popupData.count,
      field: field || popupData.field,
    };
    axios
      .put(`http://13.124.68.20:8080/recruitments/update/${post.recruitmentId}`, updatedPost)
      .then((response) => {
        setPopupData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
    setShowModal(false);
  };

  useEffect(() => {
    axios
      .get(`http://13.124.68.20:8080/recruitments/${post.recruitmentId}`)
      .then((response) => {
        const data = response.data.data;
        const participationData = data[Role.PARTICIPATION];
        const firstKey = Object.keys(data)[0];
        console.log(data);
        if (firstKey === Role.HOST) {
          post.type = firstKey;
        } else if (firstKey === Role.GUEST || firstKey === Role.PARTICIPATION) {
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
                <h2>{popupData.title.replace(/\n/g, '\n')}</h2>
                <pre>{popupData.content.replace(/\n/g, '\n')}</pre>
                {popupData.currentCount < popupData.count ? (
                  <p style={{
                    border: '1px solid white',
                    borderRadius: '40px',
                    padding: '8px',
                    marginRight: '8px',
                    backgroundColor: '#2F4074',
                    color: 'white',
                    width: 'auto',
                    textAlign: 'center'
                  }}>모집중[{popupData.currentCount}/{popupData.count}]</p>
                ) : (
                  <h3 style={{ position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}>모집완료</h3>
                )}
                <p>관심분야: {popupData.field}</p>
                <Button onClick={() => setShowModal(true)}>수정</Button>
                <Button onClick={handleDeletePost}>삭제</Button>
              </>
            )}
            {popupData.type === Role.GUEST && (
              <>
                <h2>{popupData.title.replace(/\n/g, '\n')}</h2>
                <pre>{popupData.content.replace(/\n/g, '\n')}</pre>
                {popupData.currentCount < popupData.count ? (
                  <p style={{
                    border: '1px solid white',
                    borderRadius: '40px',
                    padding: '8px',
                    marginRight: '8px',
                    backgroundColor: '#2F4074',
                    color: 'white',
                    width: 'auto',
                    textAlign: 'center'
                  }}>모집중[{popupData.currentCount}/{popupData.count}]</p>
                ) : (
                  <h3 style={{ position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}>모집완료</h3>
                )}
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <div
                    className={getColorClass(popupData.field)}
                    style={{
                      border: '1px solid white',
                      borderRadius: '40px',
                      padding: '8px',
                      marginRight: '8px',
                      width: 'auto'

                    }}
                  >
                    #{popupData.field}
                  </div>
                </div>                {isParticipating ? (
                  <CancelButton onClick={handleCancel}>취소하기</CancelButton>
                ) : (
                  <ParticipateButton onClick={handleParticipate}>참여하기</ParticipateButton>
                )}
                {isDialogOpen && <Dialog onClose={handleCloseDialog} />}
              </>
            )}
            {popupData.type === Role.PARTICIPATION && (
              <>
                <h2>{popupData.title.replace(/\n/g, '\n')}</h2>
                <pre> {popupData.content.replace(/\n/g, '\n')}</pre>
                {popupData.currentCount < popupData.count ? (
                  <p style={{
                    border: '1px solid white',
                    borderRadius: '40px',
                    padding: '8px',
                    marginRight: '8px',
                    backgroundColor: '#2F4074',
                    color: 'white',
                    width: 'auto',
                    textAlign: 'center'
                  }}>모집중[{popupData.currentCount}/{popupData.count}]</p>
                ) : (
                  <h3 style={{ position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}>모집완료</h3>
                )}
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <div
                    className={getColorClass(popupData.field)}
                    style={{
                      border: '1px solid white',
                      borderRadius: '40px',
                      padding: '8px',
                      marginRight: '8px',
                      width: 'auto'

                    }}
                  >
                    #{popupData.field}
                  </div>
                </div>
                {isParticipating && popupData.currentCount < popupData.count ? (
                  <CancelButton onClick={handleCancel}>취소하기</CancelButton>
                ) : (
                  isParticipating && popupData.currentCount >= popupData.count ? (
                    <p>참가/취소 불가능</p>
                  ) : (
                    <ParticipateButton style={{marginLeft:'230px'}} onClick={handleParticipate}>참여하기</ParticipateButton>
                  )
                )}
              </>
            )}

          </PopupContainer>
          {showModal && (
            <Modal>
              <form onSubmit={handleUpdatePost}>
                <Input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="제목"
                />
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="내용"
                />
                <Input
                  type="text"
                  value={count}
                  onChange={(e) => setCount(e.target.value)}
                  placeholder="인원수"
                />
                <Input
                  type="text"
                  value={field}
                  onChange={(e) => setField(e.target.value)}
                  placeholder="관심분야"
                />
                <Button type="submit">저장</Button>
                <Button type="button" onClick={() => setShowModal(false)}>
                  취소
                </Button>
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
  width: 600px;
  height: auto;
  transform: translate(-50%, -50%);
  z-index: 9990;
  background-color: white;
  padding: 20px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  border-radius: 30px;

  .color-and {
    background-color: #576EF3;
    font-weight: bold;

  }
  .color-ios {
    background-color: #42ABDD;
    font-weight: bold;

  }
  .color-algorithm {
    background-color: #45C64A;
        font-weight: bold;
  }
  .color-database {
    background-color: #E1A856;
        font-weight: bold;
  }
  .color-os {
    background-color: #ED6236
        font-weight: bold;
  }
  .color-server {
    background-color: #A025B5
        font-weight: bold;
  }
  .color-web {
    background-color: #2783CC
        font-weight: bold;
  }
  .color-ml {
    background-color: #E6B41D
        font-weight: bold;
  }

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

const Button = styled.button`
  margin-right: 10px;
  padding: 10px 20px;
  border-radius: 4px;
  border: none;
  background-color: #1976d2;
  color: #fff;
  cursor: pointer;
  &:hover {
    background-color: #115293;
  }
`;

const ParticipateButton = styled(Button)`
  background-color: #4caf50;
  &:hover {
    background-color: #45a049;
  }
`;

const CancelButton = styled(Button)`
  background-color: #f44336;
  &:hover {
    background-color: #d32f2f;
  }
`;

const Input = styled.input`
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ddd;
`;

const Textarea = styled.textarea`
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ddd;
`;

const DialogContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  p {
    margin-bottom: 10px;
  }
`;
