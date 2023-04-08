import React from 'react'
import styled from 'styled-components'
import { AiFillMessage } from 'react-icons/ai'
import { AiFillHome } from 'react-icons/ai'
import { RiQuestionnaireFill } from 'react-icons/ri'
import { CgProfile } from 'react-icons/cg'
import { useNavigate } from "react-router-dom";




function LeftSidePanel() {

  const navigate = useNavigate();

  const goToMain = () => {
    navigate("/");
  }

  const goToQnA = () => {
    navigate("/q&apage")
  }

  const goToProfile = () => {
    navigate("/mypage")
  }

  const goTochat = () => {
    navigate("/chatpage")
  }

  return (

    <Container>
      <Logo>
        CodeConnect
      </Logo>
      <NavItem onClick={goToMain}>
        <Icon>
          <AiFillHome />
        </Icon>
        <Title>Study</Title>
      </NavItem>
      <NavItem onClick={goToQnA}>
        <Icon>
          <RiQuestionnaireFill />
        </Icon>
        <Title>Q&A</Title>
      </NavItem>
      <NavItem onClick={goTochat}>
        <Icon>
          <AiFillMessage />
        </Icon>
        <Title>Chat</Title>
      </NavItem>
      <NavItem onClick={goToProfile}>
        <Icon>
          <CgProfile />
        </Icon>
        <Title>MyPage</Title>
      </NavItem>

    </Container >

  )
}


export default LeftSidePanel

const Container = styled.div`
  width: 300px;
  background-color: #F3F8FF;
  position: fixed;
  display: flex;
  flex-direction: column;
  width: 300px;
  height: 100%;
  background-color: #CFDCFF;

`;

// CFDCFF F3F8FF
const Logo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 50px;
  padding-top: 20px;
  font-size: 40px;

  color:#515151;

  font-family: 'Yeongdo', sans-serif;
  &:first-letter {
    font-family: 'Yeongdo-Rg', sans-serif;
  }
  
  
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  &:hover {
    background-color: #F3F8FF;
  }
`;

const Icon = styled.div`
font-size: 30px;
padding: 25px;
color: white;
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-left: 10px;
`;
