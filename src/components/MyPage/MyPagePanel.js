import axios from "axios";
import React, { useEffect, useState } from "react";
import { Row, Col, Form, Button, Modal, ButtonGroup, Dropdown } from "react-bootstrap";
import "./MyPagePanel.css"; // CSS 파일 import
import styled from "styled-components";

import PopupPost from "../MainPage/MainPanel/PopupPost";
import PopupQnAPost from "../QnAPage/PopupQnAPost";

const { localStorage } = window;

function MyPagePanel() {


    const [position, setPosition] = useState(0);

    const [myInfo, setMyInfo] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("myposts");
    const [editProfileModalOpen, setEditProfileModalOpen] = useState(false); // 프로필 편집 모달 상태

    const [newAddress, setNewAddress] = useState(""); // 새로운 주소 입력 상태
    const [newFieldList, setNewFieldList] = useState([]); // 새로운 관심 분야 입력 상태
    const [newNickname, setNewNickname] = useState(""); // 새로운 닉네임 입력 상태
    const [newProfileImage, setNewProfileImage] = useState([]); // 새로운 프로필 이미지 파일 상태

    const [profileData, setProfileData] = useState(null);

    const [selectedPost, setSelectedPost] = useState(null);
    const [showPopupPost, setShowPopupPost] = useState(null);

    const [selectedFields, setSelectedFields] = useState([]);//모달창에서 필드 선택
    const [fieldCheckState, setFieldCheckState] = useState({
        안드로이드: false,
        운영체제: false,
        ios: false,
        알고리즘: false,
        서버: false,
        웹: false,
        머신러닝: false,
        // ...
    });

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
      

    const [result, setResults] = useState([]);
    const [dong, setDong] = useState("");


    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    const token = localStorage.getItem("token");

    const [nickname, setNickname] = useState("");
    const [myPosts, setMyPosts] = useState([]);
    const [myQna, setMyQna] = useState([]);
    const [myJoin, setMyJoin] = useState([]);

    let currentPosts;

    if (selectedCategory === "joinposts") {
        currentPosts = myJoin;
    } else if (selectedCategory === "myqna") {
        currentPosts = myQna;
    } else if (selectedCategory === "myposts") {
        currentPosts = myPosts;
    } else {
        // 선택된 카테고리가 위의 세 가지 중 어떤 것에도 해당하지 않을 경우에 대한 처리
        currentPosts = [];
    }



    const handleFieldSelection = (fieldName) => {
        setFieldCheckState((prevState) => ({
            ...prevState,
            [fieldName.toLowerCase()]: !prevState[fieldName.toLowerCase()],
        }));
    };


    const handleSearch = async () => {
        try {
            const response = await fetch(
                `http://api.vworld.kr/req/data?service=data&request=GetFeature&data=LT_C_ADEMD_INFO&key=D3D9E0D0-062C-35F0-A49D-FC9E863B3AD5&format=json&geometry=false&attrFilter=emd_kor_nm:like:${newAddress}`
            );
            const data = await response.json();
            console.log(data)
            if (data && data.response && data.response.result && data.response.result.featureCollection) {
                setResults(data.response.result.featureCollection.features);
            } else {
                console.log("Invalid response:", data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {

        axios
            .get(`http://13.124.68.20:8080/profile/myinfo`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                const data = response.data.data;
                console.log(data);

                const infodata = {
                    // email: data.email,
                    nickname: data.nickname,
                    fieldList: data.fieldList,
                    address: data.address,
                    profileImagePath: data.profileImagePath,
                };
                console.log(data.profileImagePath)
                setMyInfo(infodata);
                setNickname(data.nickname);
            })
            .catch((error) => console.error(error));
    }, [nickname]);

    useEffect(() => {
        axios
            .get(`http://13.124.68.20:8080/profile/userRecruitment/${nickname}`)
            .then((response) => {
                const data = response.data;

                const myPostData = data.data.map((item) => {
                    const { recruitmentId, title, content, count, field, currentCount } = item;
                    return { recruitmentId, title, content, count, field, currentCount, showCurrentCount: true };
                });
                console.log(data);
                setMyPosts(myPostData);

            })
            .catch((error) => console.error(error));
    }, [nickname]);


    useEffect(() => {
        axios
            .get(`http://13.124.68.20:8080/profile/userQna/${nickname}`)
            .then((response) => {
                const data = response.data;
                console.log(data);

                const myQnaData = data.data.map((item) => {
                    const { commentCount, content, imagePath, currentDateTime, profileImagePath, qnaId, title } = item;
                    return { commentCount, content, imagePath, currentDateTime, profileImagePath, qnaId, title, showImgae: true };
                });
                setMyQna(myQnaData);
                console.log(myQnaData);

            })
            .catch((error) => console.error(error));
    }, [nickname]);

    useEffect(() => {
        axios.get(`http://13.124.68.20:8080/profile/${nickname}`)
            .then((response) => {
                const data = response.data;
                console.log(data);

                const joinData = data.data.map((item) => {
                    const { address, content, count, currentCount, currentDateTime, field, nickname, profileImagePath, recruitmentId, title } = item;
                    return { address, content, count, currentCount, currentDateTime, field, nickname, profileImagePath, recruitmentId, title };
                });
                setMyJoin(joinData);

            }).catch((error) => console.error(error));

    }, [nickname]);


    function handleWheel(event) {
        // Update the position based on the amount of scrolling
        setPosition(position + event.deltaY);
    }

    const openPostModal = (post) => {
        setSelectedPost(post);
    };

    // 모달 창 닫기
    const closePostModal = () => {
        setSelectedPost(null);
    };

    // 프로필 편집 모달 열기
    const openEditProfileModal = () => {
        setEditProfileModalOpen(true);
    };

    // 프로필 편집 모달 닫기
    const closeEditProfileModal = () => {
        setEditProfileModalOpen(false);
    };

    // 새로운 프로필 이미지 선택 시
    // 새로운 프로필 이미지 선택 시
    const handleProfileImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const profileimagedata = reader.result;
                const imageValueWithoutQuotes = profileimagedata;
                setNewProfileImage(imageValueWithoutQuotes);
                console.log(imageValueWithoutQuotes);
            };
            reader.readAsDataURL(file);
        }
    };




    const saveProfileChanges = () => {
        const selectedFieldList = Object.keys(fieldCheckState).filter(
            (fieldName) => fieldCheckState[fieldName]
        );

        const updateProfile = {
            address: newAddress === "" ? myInfo.address : newAddress,
            fieldList: selectedFieldList.length > 0 ? selectedFieldList : myInfo.fieldList,
            nickname: newNickname === "" ? myInfo.nickname : newNickname,
            base64Image: newProfileImage.replace(/^data:image\/[a-z]+;base64,/, "")
        };

        axios
            .put("http://13.124.68.20:8080/profile/update", updateProfile)
            .then((response) => {
                console.log(response.data);
                console.log(updateProfile);
            })
            .catch((error) => {
                console.error(error);
                console.log(updateProfile);
            });

        closeEditProfileModal();
    };



    return (
        <Div style={{ overflowY: 'scroll', height: '100%', backgroundColor:'#F3F6FF' }} onWheel={handleWheel}>
            <Container >
                
                <Row >
                    <Col md={4}>
                        <Profile>
                            <img
                                className="profile-image"
                                src={"http://13.124.68.20:8080/" + myInfo.profileImagePath}
                                alt="Profile"
                            />
                            <Button variant="secondary" onClick={openEditProfileModal}>
                                Edit Profile
                            </Button>
                        </Profile>
                    </Col>

                    <Col md={8}>
                        <div className="member-info">
                            <h2>이름: {myInfo.nickname}</h2>
                        </div>
                        <Form>
                            <Form.Group >
                                <Form.Label>주소: {myInfo.address}</Form.Label>
                            </Form.Group>

                            <Form.Group>
                                <Info>
                                {myInfo && myInfo.fieldList && Array.isArray(myInfo.fieldList) && (
                                    <Form.Label>
                                        관심분야
                                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                                            {myInfo.fieldList.map((field, index) => (
                                                <div
                                                    key={index}
                                                    className={`${getColorClass(field)} field-item`}
                                                    style={{
                                                        border: '1px solid black',
                                                        borderRadius: '40px',
                                                        padding: '8px',
                                                        marginRight: '8px',
                                                        width: 'auto'
                            
                                                      }}
                                                >
                                                    {field}
                                                </div>
                                            ))}
                                        </div>
                                    </Form.Label>
                                )}</Info>


                            </Form.Group>
                        </Form>
                    </Col>
                </Row>
                <hr/>
                <List>
                    <ButtonGroup>

                        <Button
                            variant="outline-primary"
                            onClick={() => handleCategoryChange("myposts")}
                            active={selectedCategory === "myposts"}
                        >
                            My Posts
                        </Button>{" "}
                        <Button
                            variant="outline-primary"
                            onClick={() => handleCategoryChange("myqna")}
                            active={selectedCategory === "myqna"}
                        >
                            My Q&A
                        </Button>
                        <Button
                            variant="outline-primary"
                            onClick={() => handleCategoryChange("joinposts")}
                            active={selectedCategory === "joinposts"}
                        >
                            Join Posts
                        </Button>

                    </ButtonGroup>
                    <br />

                    <Posts className="post-container">

                        <Row>
                            {selectedCategory === "myposts" && (
                                currentPosts.map((post) => (
                                    <Col md={4} key={post.recruitmentId}>
                                        <Post>
                                            <div className="post-item" onClick={() => openPostModal(post)}>
                                                <div className="post-title">{post.title}</div>
                                                <div className="post-content">{post.content}</div>
                                                <p>현재 인원: {post.currentCount}/{post.count}</p>
                                            </div>
                                        </Post>
                                    </Col>
                                ))
                            )}

                            {selectedCategory === "myqna" && (
                                currentPosts.map((post) => (
                                    <Col md={4} key={post.qnaId}>
                                        <Post>
                                            <div className="post-item" onClick={() => openPostModal(post)}>
                                                <div className="post-title">{post.title}</div>
                                                {post.imagePath && (
                                                    <img className="post-image" src={"http://13.124.68.20:8080/" + post.imagePath} />
                                                )}
                                                {!post.imagePath && (
                                                    <div className="post-content">{post.content}</div>
                                                )}
                                            </div>
                                        </Post>
                                    </Col>
                                ))
                            )}

                            {selectedCategory === "joinposts" && (
                                currentPosts.map((post) => (
                                    <Col md={4} key={post.recruitmentId}>
                                        <Post>
                                            <div className="post-item" onClick={() => openPostModal(post)}>
                                                <div className="post-title">{post.title}</div>
                                                <div className="post-content">{post.content}</div>
                                                <p>현재 인원: {post.currentCount}/{post.count}</p>
                                            </div>
                                        </Post>
                                    </Col>
                                ))
                            )}

                        </Row>
                    </Posts>
                </List>
            </Container>

            {/* 프로필 편집 모달 */}
            <Modal show={editProfileModalOpen} onHide={closeEditProfileModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={saveProfileChanges}>
                        <Form>
                            <Row>
                                <Col md={9}>
                                    <Form.Group>
                                        <Form.Label>주소</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder={myInfo.address}
                                            value={newAddress}
                                            onChange={(e) => setNewAddress(e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={3} className="d-flex align-items-end justify-content-end">
                                    <Button variant="primary" onClick={handleSearch}>검색</Button>
                                </Col>
                            </Row>
                            {result.length > 0 && (
                                <Form.Group >
                                    {/* 주소 검색 결과를 텍스트 창 아래에 표시 */}
                                    {result.map((result, index) => (
                                        <Button
                                            key={index}
                                            onClick={() => {
                                                // 결과 항목을 선택하면 해당 항목을 텍스트 창에 자동으로 입력
                                                setNewAddress(result.properties.full_nm);
                                                setResults([])
                                            }}
                                        >
                                            {result.properties.full_nm}
                                        </Button>
                                    ))}
                                </Form.Group>
                            )}

                            <Form.Group >
                                <Form.Label>관심분야</Form.Label>
                                {Object.keys(fieldCheckState).map((fieldName) => (
                                    <Form.Check
                                        key={fieldName}
                                        type="checkbox"
                                        label={fieldName}
                                        checked={fieldCheckState[fieldName]}
                                        onChange={() => handleFieldSelection(fieldName)}
                                    />
                                ))}
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>닉네임</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter new nickname"
                                    onChange={(e) => setNewNickname(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>프로필 이미지</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept=".jpeg, .png"
                                    id="photo_file"
                                    name="photo_file"
                                    onChange={handleProfileImageChange}
                                />
                            </Form.Group>
                        </Form>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeEditProfileModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={saveProfileChanges}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            {selectedPost && selectedCategory === "myposts" && (
                <PopupPost post={selectedPost} onClose={closePostModal} />
            )}
            {selectedPost && selectedCategory === "myqna" && (
                <PopupQnAPost qnapost={selectedPost} onClose={closePostModal} />
            )}
            {selectedPost && selectedCategory === "joinposts" && (
                <PopupPost post={selectedPost} onClose={closePostModal} />
            )}
        </Div>
    );
}

export default MyPagePanel;

const Div = styled.div`
  padding-left: 10px;
  padding-top: 50px;
  height: 100%;
  background-color: white;

  
`;

const Container = styled.div`
width: 85%
heigth: 85%;
`;
const Info = styled.div`
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

const Posts = styled.div`
width: 80%;

  .post-item {
    border-radius: 4px;
    border: 1px solid #ddd;
    background-color: white;
    width: 100%;
    padding: 10px;
    height: 0;
    padding-bottom: 80%; /* 정사각형 비율을 위해 padding-bottom 값을 80%로 설정 */
    position: relative;
    overflow: hidden;
  }
`;

const Post = styled.div`
  .post-item {
    border-radius: 4px;
    border: 1px solid #ddd;
    background-color: white;
    width: 100%; /* 너비를 100%로 지정 */
    padding: 10px; /* 원하는 패딩값 설정 */
    height: 0;
    padding-bottom: 100%; /* 1:1 비율을 위해 padding-bottom 값을 100%로 설정 */
    position: relative;
    overflow: hidden;
  }
  .post-image{
    width: 220px;
    height: 200px;
  }
`;


const Profile = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  .profile-image {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 10px;
  }
`;

const List = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  margin-top: 20px;
`;
