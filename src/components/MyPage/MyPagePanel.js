import axios from "axios";
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "./MyPagePanel.css"; // CSS 파일 import
import { FaUserCircle } from "react-icons/fa";
import styled from "styled-components";

const { localStorage } = window;


function MyPagePanel() {
    //찐데이터 서버에서 가져온 보인 회원 정보
    const [myInfo, setMyInfo] = useState([]);
    // 가정: 서버에서 가져온 회원 정보
    const [selectedCategory, setSelectedCategory] = useState("myposts");

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    const token = localStorage.getItem('token');

    const [myNickname, setNickname] = useState('');


    // 가정: 서버에서 가져온 게시물 리스트
    const [myPosts, setMyPosts] = useState([]);

    const [myQna, setMyQna] = useState([]);

    const currentPosts = selectedCategory === "myposts" ? myPosts : myQna;

    useEffect(() => { //본인 계정 정보 조회
        axios.get(`http://112.154.249.74:8080/profile/myinfo`
            // , {
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Authorization': `Bearer ${token}}`
            //     }
            // }
        )
            .then(response => {
                const data = response.data.data;

                const infodata = {
                    email: data.email,
                    nickname: data.nickname,
                    fieldlist: data.fieldlist,
                    address: data.address
                }

                console.log(data);
                setMyInfo(infodata);
                setNickname(data.nickname)
            })
            .catch(error => console.error(error));
    }, []);

    useEffect(() => { //본인이 올린 스터디 게시물 조회
        axios.get(`http://112.154.249.74:8080/profile/userRecruitment/${myNickname}`)
            .then(response => {
                const data = response.data;
                // console.log(data);
                const myPostData = data.data.map(item => {
                    const { recruitmentId, title, content, count, field, currentCount } = item;
                    return { recruitmentId, title, content, count, field, currentCount };
                });
                // console.log(data.data)
                setMyPosts(myPostData);
            })
            .catch(error => console.error(error));
    }, [myNickname]);

    useEffect(() => { //본인이 올린 Q&A 게시물 조회
        axios.get(`http://112.154.249.74:8080/profile/userQna/${myNickname}`)
            .then(response => {
                const data = response.data;
                // console.log(data);
                const myQnaData = data.data.map(item => {
                    const { commentCount, content, currentDateTime, modifiedDateTime, qnaId, title } = item;
                    return { commentCount, content, currentDateTime, modifiedDateTime, qnaId, title };
                });
                // console.log(data.data)
                setMyQna(myQnaData);
            })
            .catch(error => console.error(error));
    }, [myNickname]);

    return (
        <Div>

            <Container>

                <Row>
                    <Col md={4}>
                        <div className="user-icon">
                            <FaUserCircle size={200} /> {/* 이모티콘 크기 조절 */}
                        </div>
                    </Col>

                    <Col md={8}>
                        <div className="member-info">
                            <h2>이름: {myInfo.nickname}</h2>
                        </div>
                        <Form>
                            {/* <Form.Group controlId="formBasicName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                plaintext
                readOnly
                defaultValue={myInfo.nickname}
              />
            </Form.Group> */}

                            <Form.Group controlId="formBasicBio">
                                <Form.Label>주소: {myInfo.address}</Form.Label>
                                {/* <Form.Control
                                as="textarea"
                                rows={3}
                                plaintext
                                readOnly
                                defaultValue={myInfo.address}
                            /> */}
                            </Form.Group>

                            <Form.Group controlId="formBasicWebsite">

                                <Form.Label>관심분야:{myInfo.fieldlist}</Form.Label>

                                {/* <Form.Control
                                type="text"
                                plaintext
                                readOnly
                                defaultValue={myInfo.fieldlist}
                            /> */}
                            </Form.Group>

                            <Button variant="primary" type="submit" disabled>
                                Save Changes
                            </Button>
                        </Form>
                    </Col>
                </Row>
                <hr />
                <h2>My Posts</h2>
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
                <br />
                <br />

                <div className="post-container">
                    <Row>
                            {currentPosts.map((post) => (
                                <Col md={4} key={selectedCategory === 'myposts' ? post.recruitmentId : post.qnaId}>
                                    <Post>
                                    <div className="post-item">
                                        <div className="post-title">{post.title}</div>
                                    </div>
                                    </Post>

                                </Col>


                            ))}
                    </Row>
                </div>
            </Container>
        </Div>

    );
}

export default MyPagePanel;

const Div = styled.div`
padding-left: 10px;
padding-top: 10px;
  height: 100%;
background-color: #CFDCFF;

`;

const Post = styled.div`
background-color: white;

`;