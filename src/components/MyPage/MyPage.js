import React from 'react'
import styled from 'styled-components'
import LeftSidePanel from '../MainPage/MainPanel/LeftSidePanel';
import MyPagePanel from './MyPagePanel';

function MyPage() {
  return (
    <Container>
        <SideLeft>
                <LeftSidePanel />
            </SideLeft>

            <Middle>
            <MyPagePanel/>
            </Middle>
    </Container>
  )
}

export default MyPage

const Container = styled.div`

`;

const SideLeft = styled.div`
width: 300px; /* sidepanel의 너비 조절 */
height: 100%; /* sidepanel의 높이 조절 */
position: fixed; /* 화면에서 고정 위치 */
top: 0; /* 화면 상단에 위치 */
left: 0; /* 화면 왼쪽에 위치 */
background-color: #fff; /* 배경색상 조절 */
`;

const Middle = styled.div`
width: 80%; /* sidepanel의 너비 조절 */
height: 100%; /* sidepanel의 높이 조절 */
position: fixed; /* 화면에서 고정 위치 */
top: 0; /* 화면 상단에 위치 */
left: 300px; /* 화면 왼쪽에 위치 */
background-color: #fff; /* 배경색상 조절 */
border-left: 1px solid #ccc; /* 오른쪽 선 스타일 추가 */

`;

const SideRight = styled.div`
width: 30%; /* sidepanel의 너비 조절 */
height: 100%; /* sidepanel의 높이 조절 */
position: fixed; /* 화면에서 고정 위치 */
top: 0; /* 화면 상단에 위치 */
left: 80%; /* 화면 왼쪽에 위치 */
background-color: #fff; /* 배경색상 조절 */
border-left: 1px solid #ccc; /* 왼쪽 선 스타일 추가 */

`;
