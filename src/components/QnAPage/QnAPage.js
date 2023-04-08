import React from 'react'
import styled from 'styled-components'
import LeftSidePanel from '../MainPage/MainPanel/LeftSidePanel'

function QnAPage() {
  return (
    <Container>
        <SideLeft>
                <LeftSidePanel />
            </SideLeft>

            <Middle>
            <h1>QnAPage</h1>
            </Middle>

            <SideRight>
            </SideRight>
    </Container>
  )
}

export default QnAPage

const Container = styled.div`

`;

const SideLeft = styled.div`
width: 300px; /* sidepanel의 너비 조절 */
height: 100%; /* sidepanel의 높이 조절 */
position: fixed; /* 화면에서 고정 위치 */
top: 0; /* 화면 상단에 위치 */
left: 0; /* 화면 왼쪽에 위치 */
background-color: #fff; /* 배경색상 조절 */
border-right: 1px solid #ccc; /* 오른쪽 선 스타일 추가 */
`;

const Middle = styled.div`
width: 800px; /* sidepanel의 너비 조절 */
height: 100%; /* sidepanel의 높이 조절 */
position: fixed; /* 화면에서 고정 위치 */
top: 0; /* 화면 상단에 위치 */
left: 301px; /* 화면 왼쪽에 위치 */
background-color: #fff; /* 배경색상 조절 */
border-right: 1px solid #ccc; /* 오른쪽 선 스타일 추가 */

`;

const SideRight = styled.div`
width: 300px; /* sidepanel의 너비 조절 */
height: 100%; /* sidepanel의 높이 조절 */
position: fixed; /* 화면에서 고정 위치 */
top: 0; /* 화면 상단에 위치 */
left: 1102px; /* 화면 왼쪽에 위치 */
background-color: #fff; /* 배경색상 조절 */
`;