import React from 'react'
import styled,{ keyframes } from 'styled-components'
import { AiFillMessage } from 'react-icons/ai'
import { AiFillHome } from 'react-icons/ai'
import { RiQuestionnaireFill } from 'react-icons/ri'
import { CgProfile } from 'react-icons/cg'
import { useNavigate } from "react-router-dom";


// const fadeInOut = keyframes`
//   0% { background-color: black; }
//   100% { background-color: white; }
// `;

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
        <LogoImage src='Images/logos/reallogo.png' />
      </Logo>
      <Tapbar>
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
      </Tapbar>
    </Container >

  )
}


export default LeftSidePanel

const Container = styled.div`
  width: 30%;
  background-color: #F3F8FF;
  position: fixed;
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: white ;

`;

// CFDCFF F3F8FF
const Logo = styled.div`
  display: flex;
  align-items: center;
background-color: white;

`;
// animation: ${fadeInOut} 5s linear infinite;

const LogoImage = styled.img`
  width: 300px; /* 원하는 크기로 변경 */
  height: 70px; /* 원하는 크기로 변경 */

`;


const NavItem = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  &:hover {
    background-color: #F3F6FF;
  }
`;

const Icon = styled.div`
font-size: 30px;
padding: 25px;
color: #515151;
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-left: 10px;
  color: #515151;
`;

const Tapbar = styled.div`
height: 100%;
background-color: white;

`;