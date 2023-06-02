import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { login, logout, setNickname } from '../../redux/actions/userActions';
// import { setNickname } from '../../redux/reducers';

const { localStorage } = window;


function LoginPage() {
  const dispatch = useDispatch();
  const BASE_URL = 'http://112.154.249.74:8080/members/login';
  const [formValues, setFormValues] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const goToSignup = () => {
    navigate('/register');
  };

  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(BASE_URL, formValues)
      .then((response) => {
        const responseData = response.data;
        const { token, exprTime, nickname, fieldList, address } = responseData.data;

        if (response.status === 200) {
          // Save the token in localStorage
          localStorage.setItem('token', token);
          localStorage.setItem('expiryDate', exprTime);

          // Set Authorization header for all axios requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          // Dispatch login action to update user state
          dispatch(setNickname(nickname));
          dispatch(login(responseData));

          // Navigate to the home page
          navigate('/', { state: { address } });
        }
      })
      .catch((errors) => {
        setErrors(errors.response.data);
      });
  };

  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem('token');
    // Dispatch the logout action to clear the user state
    dispatch(logout());
    // Navigate to the login page
    navigate('/login');
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <FormBackgroundImage />

      
      <Div>

        <InputContainer>
        <Logo>Login</Logo>
          <Div1>
          <Label htmlFor="email">이메일 입력</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formValues.email}
            onChange={handleChange}
            required
          />
          {errors.email && <span>{errors.email}</span>}
          </Div1>
          <Div1>
          <Label htmlFor="password">비밀번호</Label>
          <Input
            type="password"
            id="password"
            name="password"
            value={formValues.password}
            onChange={handleChange}
            required
          />
          {errors.password && <span>{errors.password}</span>}
          </Div1>
        </InputContainer>
        <ButtonContainer>
        <Anchor onClick={goToSignup}>Join the membership</Anchor>

        <Button type="submit">로그인</Button>
      </ButtonContainer>
      </Div>

    </FormContainer>
  );
}

export default LoginPage;


const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 100px;
`;

const Header = styled.div`
  display: center;
  position: fixed;
  top: 0;
  width: 100vw;
  height: 70px;
  padding: auto;
  background-color: white;
`;

const Div = styled.div`
  margin-bottom: 100px;
  margin-top: 150px;
`;

const Logo = styled.div`
  font-weight: bolder;
  margin-top: 30px;
  margin-left: 100px;
  display: flex;
  color: #2F4074;
  font-size: 30px;
  position: absolute;
  left: 20%;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
`;

const Label = styled.label`
  display: flex;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: #2F4074;
  font-weight: bolder;
  width: 150px;
`;

const Input = styled.input`
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid gray;
  border-radius: 0.3rem;
  width: 100%;
  margin-top: 0.5rem;
  border-color: #fb055;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: none;
  border-radius: 25px;
  background-color: #2F4074;
  color: white;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: background-color 0.3s ease;



  &:hover {
    background-color: #b8c6e2;
  }
`;

const FormBackgroundImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 110%;
  background-image: url('Images/logos/loginbackimg.png');
  background-size: cover;
  background-position: center;
  opacity: 0.5;
  z-index: -1;
`;

const Div1 = styled.div`
  margin-bottom: 1rem;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 400px;
 
`;

const Anchor = styled.a`
  /* Button styles */
  padding: 0.5rem 1rem;
  font-size: 1rem;
  color: #2F4074;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: background-color 0.3s ease;
  text-decoration: none;

  &:hover {
    color: #b8c6e2;
  }
`;