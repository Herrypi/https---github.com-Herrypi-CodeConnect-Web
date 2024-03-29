import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { AiOutlinePlusCircle } from 'react-icons/ai'
import axios from 'axios';
import PopupPost from './PopupPost';
import { BiSearch } from 'react-icons/bi';
import { display } from '@mui/system';


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
  const [selectedField, setSelectedField] = useState("");

  const [myaddress, setmyaddress] = useState(null);

  const fields = ["안드로이드", "운영체제", "ios", "알고리즘", "서버", "웹", "머신러닝", "데이터베이스", "기타"];

  const [postImages, setPostImages] = useState([]);

  const handleCreate = () => {
    if (title && content && count && selectedField) {
      // Add logic for creating a new post
      addPost(selectedField);
      setShowPopupCreat(false);
      setTitle("");
      setContent("");
      setCount("");
      setSelectedField("");
    } else {
      alert("빈칸을 채워 주세요.");
    }
  };

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

  function handlePostClick(post) {
    setSelectedPost(post);
    setShowPopupPost(true);
  }


  function handleWheel(event) {
    // Update the position based on the amount of scrolling
    setPosition(position + event.deltaY);
  }
  const accessToken = localStorage.getItem('accessToken');

  // const config = {
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${accessToken}`
  //   }
  // }

  // console.log(accessToken);

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://api.vworld.kr/req/data?service=data&request=GetFeature&data=LT_C_ADEMD_INFO&key=8E78F586-DBB3-36C9-9FF5-E7B652FBA77D&format=json&geometry=false&attrFilter=emd_kor_nm:like:${encodeURIComponent(dong)}`);
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

  const addPost = (selectedField) => {
    const newPost = {
      nickname,
      title,
      content,
      count,
      field: selectedField,
      currentCount,
    };

    fetch('http://52.79.53.62:8080/recruitments/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
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
    fetch('http://52.79.53.62:8080/recruitments/main', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const recruitmentData = data.data.map(item => {
          const { recruitmentId, title, profileImagePath, address, nickname, currentDateTime, content, count, field, currentCount } = item;

          setPostImages(prevImages => [...prevImages, `http://52.79.53.62:8080/${profileImagePath}`]);

          return { recruitmentId, title, profileImagePath, address, nickname, currentDateTime, content, count, field, currentCount };
        });

        setPostIds(recruitmentData);
        setmyaddress(recruitmentData[0].address);
        console.log(recruitmentData);

      })
      .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    if (postIds.length === 0) {
      return; // No post data available, exit the useEffect
    }

    // Create an array to store promises for fetching images
    const imagePromises = postIds.map((post) => {
      const imageUrl = `http://52.79.53.62:8080/${post.profileImagePath}`;
      const token = accessToken;

      return fetch(imageUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.blob();
        })
        .then((blob) => {
          // Create an object URL from the blob
          const objectURL = URL.createObjectURL(blob);
          return objectURL;
        })
        .catch((error) => {
          console.error('Error:', error);
          return null; // Handle errors by returning null
        });
    });

    // Wait for all image fetch promises to resolve
    Promise.all(imagePromises)
      .then((imageUrls) => {
        // Set the image URLs to the respective posts
        const updatedPostIds = postIds.map((post, index) => ({
          ...post,
          imageUrl: imageUrls[index], // Add the imageUrl property
        }));

        // Update the state with the updated post data
        setPostIds(updatedPostIds);
      })
      .catch((error) => {
        console.error('Error fetching images:', error);
      });
  }, [accessToken, postIds]);

  // ------------------------------------------------------------------
  useEffect(() => {
    if (searchResults.length === 0) {
      return; // No post data available, exit the useEffect
    }

    // Create an array to store promises for fetching images
    const imagePromises = searchResults.map((post) => {
      const imageUrl = `http://52.79.53.62:8080/${post.profileImagePath}`;
      const token = accessToken;

      return fetch(imageUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.blob();
        })
        .then((blob) => {
          // Create an object URL from the blob
          const objectURL = URL.createObjectURL(blob);
          return objectURL;
        })
        .catch((error) => {
          console.error('Error:', error);
          return null; // Handle errors by returning null
        });
    });

    // Wait for all image fetch promises to resolve
    Promise.all(imagePromises)
      .then((imageUrls) => {
        // Set the image URLs to the respective posts
        const updatedPostIds = searchResults.map((post, index) => ({
          ...post,
          imageUrl: imageUrls[index], // Add the imageUrl property
        }));

        // Update the state with the updated post data
        setSearchResults(updatedPostIds);
      })
      .catch((error) => {
        console.error('Error fetching images:', error);
      });
  }, [accessToken, searchResults]);
  // ------------------------------------------------------------------


  useEffect(() => {

    const addressKeyword = selectedValue === '' ? null : selectedValue;

    axios.get(`http://52.79.53.62:8080/recruitments/main?address=${addressKeyword}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    }
    )
      .then(response => {
        const data = response.data;
        const recruitmentData = data.data.map(item => {//recruitmentData 안에 게시물 정보 다 저장하기
          const { recruitmentId, title, nickname, profileImagePath, currentDateTime, content, count, field, currentCount } = item;
          return { recruitmentId, title, nickname, profileImagePath, currentDateTime, content, count, field, currentCount };
        });

        console.log(data.data)
        setPostIds(recruitmentData);

      })
      .catch(error => console.error(error));
  }, [selectedValue]);


  useEffect(() => {
    if (searchTerm) {
      axios.get(`http://52.79.53.62:8080/recruitments/search?keyword=${searchTerm}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        }
      })
        .then(response => {
          const data = response.data;
          console.log(data)
          const searchResultData = data.data.map(item => {
            const { recruitmentId, nickname, title, profileImagePath, currentDateTime, content, count, field, currentCount } = item;
            return { recruitmentId, nickname, title, profileImagePath, currentDateTime, content, count, field, currentCount };
          });

          setSearchResults(searchResultData);
        })
        .catch(error => console.error(error));
    }
  }, [searchTerm]);





  return (
    <Div >
      <Container>

        <Posting onClick={() => setShowPopupCreat(true)}>
          <AiOutlinePlusCircle />
        </Posting>

        <SerachAddres>
          <InputContainer>
            <Label htmlFor="city">스터디 게시판</Label>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Input
                style={{ width: "300px" }}
                type="text"
                id="address"
                name="address"
                placeholder={myaddress}
                value={selectedValue !== '' ? selectedValue : formValues.address}
                onChange={(e) => setFormValues(e.target.value)}
                required
              />
              {errors.address && <span>{errors.address}</span>}
              <button className='search-button' onClick={toggleModal}>주소검색</button>
            </div>
          </InputContainer>
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

        </SerachAddres>

        <SearchFeed>
          <input type='text' placeholder='스터디(제목/내용)으로 검색' onChange={(e) => setSearchTerm(e.target.value)} /><BiSearch />
        </SearchFeed>
      </Container>

      <Container1 style={{ overflowY: 'scroll', height: '75%' }} onWheel={handleWheel}>
        {showPopupCreat && (
          <PopupCreat>
            <div className='body'>
              <div className='form-set'>
                <input type="text" placeholder="제목을 입력하세요." onChange={(e) => setTitle(e.target.value)} />

                <textarea className='text' placeholder="내용을 입력하세요." onChange={(e) => setContent(e.target.value)} />

                <input type="text" placeholder="총 인원수를 설정하세요." onChange={(e) => setCount(e.target.value)} />
              </div>
              <div className='interest'>
                <strong>관심분야를 선택하세요: </strong>
                {fields.map((field) => (
                  <label key={field}>
                    <input className='radio'
                      type="radio"
                      name="field"
                      value={field}
                      checked={selectedField === field}
                      onChange={(e) => setSelectedField(e.target.value)}
                    />
                    {field}
                  </label>
                ))}
              </div>
              <div className='btn'>
                <button className='ok' onClick={handleCreate}>Create</button>
                <button className='no' onClick={() => setShowPopupCreat(false)}>Cancel</button>
              </div>
            </div>
          </PopupCreat>
        )}


        <Feed>
          <ul className="list-unstyled">
            {searchTerm ? // 검색어가 입력되어 있다면 검색 결과 목록을 보여줌
              searchResults.map((item) => {
                const isFull = item.currentCount >= item.count;
                return (
                  <Post key={item.recruitmentId} onClick={() => handlePostClick(item)}>
                    <li style={{ position: 'relative' }}>
                      <div className="qna-card-profile">
                        <img
                          className="profile-image"
                          src={item.imageUrl ? item.imageUrl : "fallback-profile-image.jpg"} // Provide a fallback profile image URL
                          alt="Profile"
                        />

                        <p className="nickname">{item.nickname}</p>
                      </div>
                      <h2>{item.title.replace(/\n/g, '\n')}</h2>
                      <pre>{item.content.replace(/\n/g, '\n')}</pre>
                      {item.currentCount < item.count ? (
                        <p style={{
                          border: '1px solid white',
                          borderRadius: '40px',
                          padding: '8px',
                          marginRight: '8px',
                          backgroundColor: '#2F4074',
                          color: 'white',
                          width: 'auto',
                          textAlign: 'center'
                        }}>모집중[{item.currentCount}/{item.count}]</p>
                      ) : (
                        <h3 style={{ position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}>모집완료!</h3>
                      )}
                      <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <div
                          className={getColorClass(item.field)}
                          style={{
                            border: '1px solid white',
                            borderRadius: '40px',
                            padding: '8px',
                            marginRight: '8px',
                            width: 'auto'

                          }}
                        >
                          {item.field}
                        </div>
                      </div>
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
                      <div className="qna-card-profile">
                        <img
                          className="profile-image"
                          src={item.imageUrl ? item.imageUrl : "fallback-profile-image.jpg"} // Provide a fallback profile image URL
                          alt="Profile"
                        />
                        <p className="nickname">{item.nickname}</p>
                      </div>
                      <h2>{item.title.replace(/\n/g, '\n')}</h2>
                      <pre>{item.content.replace(/\n/g, '\n')}</pre>
                      {item.currentCount < item.count ? (
                        <p style={{
                          border: '1px solid white',
                          borderRadius: '40px',
                          padding: '8px',
                          marginRight: '8px',
                          backgroundColor: '#2F4074',
                          color: 'white',
                          width: 'auto',
                          textAlign: 'center'
                        }}>모집중[{item.currentCount}/{item.count}]</p>
                      ) : (
                        <h3 style={{ position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}>모집완료!</h3>
                      )}
                      <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <div
                          className={getColorClass(item.field)}
                          style={{
                            border: '1px solid white',
                            borderRadius: '40px',
                            padding: '8px',
                            marginRight: '8px',
                            width: 'auto'

                          }}
                        >
                          #{item.field}
                        </div>
                      </div>
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

      </Container1>
    </Div>
  )
}

export default MiddlePanel

const Div = styled.div`
height:100%;
background-color: white;

`;

const Container = styled.div`
height: auto;
background-color: #2F4074;
padding-bottom:20px;

`;
const Container1 = styled.div`
height: auto;
background-color: #white;

`;

const Posting = styled.div`
  font-size: 40px;
  cursor: pointer;
  position: fixed;
  margin: 25px;
  top: 165px;
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
.body{
z-index: 9999;
flex-direction: column;
align-items: center;
justifyContent: center;
position: fixed;
width:30%;
height:auto;
top: 50%;
left: 41%;
transform: translate(0%, -50%);
background-color: #fff;
padding: 20px;
border-radius: 15px;
box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
}

.body::before {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5); /* 회색 배경색 및 투명도 설정 */
  z-index: 9998; /* 팝업 창 뒤에 오도록 z-index 조정 */
  display: none;
}

.body.active::before {
  display: block;
}

.interest {
  margin-top: 10px;
  display:flex;
  flex-direction: column;

}

.form-set {
  display:flex;
  flex-direction:column;
}

.text {
  height: 200px;
  margin-top: 10px;
  border:none;
  border-bottom: 1px solid black;
  resize: none;
}

input {
  border: none;
  margin-top: 10px;
  border-bottom: 1px solid black

}

button {
  width: 100%;
  border-radius: 20px;
}

.btn {
  display: flex;
}

.ok {
  border: none;

  background-color: #4CAF50;
}

.no {
  border: none;

  background-color: red;

}

.radio{
  margin: 0 auto;
}

`;

const Post = styled.div`
border: 1px solid #ddd;
padding: 20px;
width: 650px;
height: auto;
margin: 10px;
background-color: #F3F8FF;
border-radius: 30px;

.post-content {
  margin-top: 10px;
  font-size: 16px;
  white-space: pre-wrap;
}
  .qna-card-profile {
    display: flex;
    align-items: center;
    margin-right: 20px;
  }
  .profile-image {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 10px;
  }

  .nickname {
    font-weight: bold;
    
  }
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


const SearchFeed = styled.div`
display: flex;
flex-direction: row;
justify-content: center;
align-items: center;
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
  font-size: 30px;
  margin-bottom: 0.5rem;
  margin-left: 100px;
  color: white;
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
  background-color: #2F4074;

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

const SerachAddres = styled.div`
  padding-top: 20px;
  margin-left: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  `;

const ProfileImage = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: 5px;
`;