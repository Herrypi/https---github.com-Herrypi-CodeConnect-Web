import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { AiOutlinePlusCircle } from 'react-icons/ai'
import axios from 'axios';
import PopupPost from './PopupPost';

const { localStorage } = window;

function MiddlePanel() {
  const [position, setPosition] = useState(0);
  const [showPopupCreat, setShowPopupCreat] = useState(false);
  const [posts, setPosts] = useState([]); // 게시물 목록을 저장할 변수
  const [nickname, setNickname] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [count, setCount] = useState("");
  const [field, setField] = useState("");
  const [currentCount, setCurrentCount] = useState('');
  const [postIds, setPostIds] = useState([]);//게시물 목록중 recruited_id만 저장
  const [selectedPost, setSelectedPost] = useState(null);
  const [showPopupPost, setShowPopupPost] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [dong, setDong] = useState("");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const toggleModal = () => setIsOpen(!isOpen);
  const [errors, setErrors] = useState({});
  const [selectedValue, setSelectedValue] = useState('');
  const [formValues, setFormValues] = useState("")
  



  function handlePostClick(post) {
    setSelectedPost(post);
    setShowPopupPost(true);
  }


  function handleWheel(event) {
    // Update the position based on the amount of scrolling
    setPosition(position + event.deltaY);
  }
  const token = localStorage.getItem('token');

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://api.vworld.kr/req/data?service=data&request=GetFeature&data=LT_C_ADEMD_INFO&key=D3D9E0D0-062C-35F0-A49D-FC9E863B3AD5&format=json&geometry=false&attrFilter=emd_kor_nm:like:${encodeURIComponent(dong)}`);
      const data = await response.json();
      if (data && data.response && data.response.result && data.response.result.featureCollection) {
        setResults(data.response.result.featureCollection.features);
      } else {
        console.log("Invalid response:", data);
      }
    } catch (error) {
      console.error(error);
    }

  };

  const addPost = () => {
    const newPost = {
      nickname,
      title,
      content,
      count,
      field,
      currentCount,
    };

    fetch('http://112.154.249.74:8080/recruitments/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newPost)
    })
      .then(response => response.json())
      .then(data => {
        setPosts(prevPosts => [...prevPosts, data]); // update the state with the new post returned by the server
      })
      .catch(error => console.error(error));
  };

  useEffect(() => {
    axios.get(`http://112.154.249.74:8080/recruitments/main`)
      .then(response => {
        const data = response.data;
        const recruitmentData = data.data.map(item => {//recruitmentData 안에 게시물 정보 다 저장하기
          const { recruitmentId, title, nickname, content, count, field, currentCount } = item;
          return { recruitmentId, title, nickname, content, count, field, currentCount };
        });

        console.log(data)
        setPostIds(recruitmentData);
      })
      .catch(error => console.error(error));
  }, []);
    useEffect(() => {

      const addressKeyword = selectedValue === '' ? null : selectedValue;

      axios.get(`http://112.154.249.74:8080/recruitments/main?address=${addressKeyword}`)
        .then(response => {
          const data = response.data;
          const recruitmentData = data.data.map(item => {//recruitmentData 안에 게시물 정보 다 저장하기
            const { recruitmentId, title, nickname, content, count, field, currentCount } = item;
            return { recruitmentId, title, nickname, content, count, field, currentCount };
          });

          console.log(data.data)
          setPostIds(recruitmentData);

          // if (Array.isArray(data)) {
          //   setPosts(data.data);
          // } else {
          //   setPosts([data.data]);
          //   data.data.forEach(item => {
          //   });
          // }
        })
        .catch(error => console.error(error));
    }, [selectedValue]);


    // useEffect(() => {
    //   axios.get('http://112.154.249.74:8080/recruitments/list')
    //   .then(response => {
    //     const data = response.data;
    //     const postData = data.data.map(item => {
    //       const {recruitmentId, nickname, title, content, count, field, currentCount} =item;
    //       return {recruitmentId, nickname, title, content, count, field, currentCount };

    //     });
    //     setPostIds(postData);

    //   })
    //   .catch(error => console.log(error))
    // })


    useEffect(() => {
      if (searchTerm) {
        axios.get(`http://112.154.249.74:8080/recruitments/search?keyword=${searchTerm}`)
          .then(response => {
            const data = response.data;
            console.log(data)
            const searchResultData = data.data.map(item => {
              const { recruitmentId, nickname, title, content, count, field, currentCount } = item;
              return { recruitmentId, nickname, title, content, count, field, currentCount };
            });

            setSearchResults(searchResultData);
          })
          .catch(error => console.error(error));
      }
    }, [searchTerm]);





    return (
      <Div style={{ overflowY: 'scroll', height: '100%' }} onWheel={handleWheel}>
        <Container>

          <Posting onClick={() => setShowPopupCreat(true)}>
            <AiOutlinePlusCircle />
          </Posting>

          <SerachAddres>
            <InputContainer>
              <Label htmlFor="city">주소 검색</Label>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Input
                  style={{ width: "300px" }}
                  type="text"
                  id="address"
                  name="address"
                  value={selectedValue !== '' ? selectedValue : formValues.address}
                  onChange={(e) => setFormValues(e.target.value)}
                  required
                />
                {errors.address && <span>{errors.address}</span>}
                <button className='search-button' onClick={toggleModal}>주소검색</button>
              </div>
              {isOpen && (
                <StyledModal >
                  <div className="modal-content">
                    <h2>주소 검색(동을 입력하세요)</h2>
                    <div className='search-content' style={{ display: "flex", alignItems: "center" }}>
                      <input className="text-content" value={dong} onChange={(e) => setDong(e.target.value)} />
                      <button type='text' onClick={handleSearch}>검색</button>
                      <button type="button" onClick={() => setIsOpen(false)}>취소</button>
                    </div>
                    {results.map((result) => (
                      <div key={result.properties.emd_cd}>
                        <span>{result.properties.full_nm}</span>
                        <button className="choice-content" onClick={() => {
                          setSelectedValue(result.properties.full_nm);
                          toggleModal();
                        }}>선택</button>
                      </div>
                    ))}
                  </div>
                </StyledModal>
              )}
            </InputContainer>


          </SerachAddres>

          <SearchFeed>
            <input type='text' placeholder=' ' onChange={(e) => setSearchTerm(e.target.value)} />
          </SearchFeed>

          {showPopupCreat && (
            <PopupCreat>
              <input type="text" placeholder="제목을 입력하세요." onChange={(e) => setTitle(e.target.value)} /><br />
              <textarea placeholder="내용을 입력하세요." onChange={(e) => setContent(e.target.value)} /><br />
              <input type="text" placeholder="총 인원수를 설정하세요." onChange={(e) => setCount(e.target.value)} /><br />
              <input type="text" placeholder="관심분야를 입력하세요." onChange={(e) => setField(e.target.value)} /><br />
              <button onClick={() => setShowPopupCreat(false)}>Cancel</button>
              <button onClick={() => {
                if (title && content && count && field) {
                  // Add logic for creating a new post
                  addPost();
                  setShowPopupCreat(false);
                  setTitle("");
                  setContent("");
                  setCount("");
                  setField("");
                } else {
                  alert("빈칸을 채워 주세요.");
                }
              }}>Create</button>
            </PopupCreat>
          )}
          <Feed>
            <ul>
              {searchTerm ? // 검색어가 입력되어 있다면 검색 결과 목록을 보여줌
                searchResults.map((item) => {
                  const isFull = item.currentCount >= item.count;
                  return (
                    <Post key={item.recruitmentId} onClick={() => handlePostClick(item)}>
                      <li style={{ position: 'relative' }}>
                        <p>{item.nickname}</p>
                        <h2>제목: {item.title}</h2>
                        <p>내용: {item.content}</p>
                        <p>인원수: {item.currentCount}/{item.count}</p>
                        <p>관심분야: {item.field}</p>
                        {isFull && <h3 style={{ position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}>모집완료</h3>}
                      </li>
                    </Post>
                  );
                }) :
                // 검색어가 입력되어 있지 않다면 모든 게시물 목록을 보여줌
                postIds.map((item) => {
                  const isFull = item.currentCount >= item.count;

                  return (
                    <Post key={item.recruitmentId} onClick={() => handlePostClick(item)}>
                      <li style={{ position: 'relative' }}>
                        <p>{item.nickname}</p>
                        <h2>제목: {item.title}</h2>
                        <p>내용: {item.content}</p>
                        <p>인원수: {item.currentCount}/{item.count}</p>
                        <p>관심분야: {item.field}</p>
                        {isFull && <h3 style={{ position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}>모집완료</h3>}
                      </li>
                    </Post>
                  );
                })
              }
            </ul>
            {showPopupPost && (
              <PopupPost post={selectedPost} onClose={() => setShowPopupPost(false)} />
            )}

          </Feed>

        </Container>
      </Div>
    )
  }

export default MiddlePanel

  const Div = styled.div`
height:100%;
background-color: #CFDCFF;

`;

  const Container = styled.div`
height: auto;
background-color: #CFDCFF;

`;

  const Posting = styled.div`
  float: right;
  font-size: 40px;
  cursor: pointer;
  position: fixed;
  margin: 25px;

`;

  const Feed = styled.div`
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
padding-top: 20px;
`;

  // display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "fixed", top: 0, bottom: 0, left: 0, right: 0, backgroundColor: "rgba(0,0,0,0.5)"
  const PopupCreat = styled.div`
z-index: 9999;
flexDirection: column;
alignItems: center;
justifyContent: center;
  position: fixed;
  width:700px;
  height:auto;
  top: 50%;
  left: 30%;
  transform: translate(0%, -50%);
  background-color: white;
  padding: 20px;
  border: 1px solid black;
  
`;

  const Post = styled.div`
  border: 1px solid #ddd;
  padding: 20px;
  width: 500px;
  height: auto;
  margin: 10px;
  background-color: #F3F8FF;
  border-radius: 10px;

  .post-content {
    margin-top: 10px;
    font-size: 16px;
    white-space: pre-wrap;
  }
`;

  const SearchFeed = styled.div`
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
padding-top: 20px;
`;



  const StyledModal = styled.div`
z-index: 999;
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;
background-color: rgba(0, 0, 0, 0.5);
display: flex;
justify-content: center;
align-items: center;

}

.search-content {
  padding-bottom: 0px;
}

.modal-content {
display:flex;
align-items: center;
background-color: white;
padding: 20px;
border-radius: 5px;
box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
width:40%;
height:auto;


}

h2 {
margin-top: 0;
}

.text-content {
  flex: 1;
  padding: 8px ;
  font-size: 16px;
  border: 2px solid #ccc;
  border-radius: 5px;
  width: 70%;
  box-sizing: border-box;
  margin-right: 20px;
  
}

button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}

.choice-content{
  background-color: #4CAF50;
  color: white;
  padding: 3px 10px;
  margin-left: 5px;
  border: none;
  border-radius: 5px;
  font-size: 10px;
  cursor: pointer;
}
`;

  const Label = styled.label`
display:flex;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color:gray;
  font-weight: bolder;
`;

  const Input = styled.input`
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid gray;
  border-radius: 0.3rem;
  width: 100%;
  margin-top: 0.5rem;
  border-color: #CFDCFF;
`;

  const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  width: 100%;
  max-width: 450px;

.search-button{
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  margin-left: 20px;
  font-size: 15px;
  cursor: pointer;
  padding: 10px 7px;

}
`;

  const SerachAddres = styled.div``;