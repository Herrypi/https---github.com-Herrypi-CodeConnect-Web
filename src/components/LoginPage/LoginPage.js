import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { login, logout } from '../../redux/actions/userActions';

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

  const goToSingup = () => {
    navigate("/register")
  }

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
        const { token, exprTime, member } = responseData.data;

        if (response.status === 200) {
          // save the token in localStorage
          localStorage.setItem('token', token);
          console.log(token);
          // set Authorization header for all axios requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // dispatch login action to update user state
          
          


          dispatch(login(responseData));

          // navigate to home page
          navigate("/");
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
      <Header>
        <Logo>로그인</Logo>
      </Header>
      <InputContainer>
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
      </InputContainer>
      <InputContainer>
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
      </InputContainer>
      <button type="submit">로그인</button>
      <button onClick={goToSingup}>회원가입</button>
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
  background-color: #CFDCFF;
`;

const Logo = styled.div`
  font-weight: bolder;
  margin-top: 10px;
  display: flex;
  color: #515151;
  font-size: 30px;
  position: absolute;
  left: 20%;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  width: 100%;
  max-width: 400px;
`;

const Label = styled.label`
  display: flex;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: gray;
  font-weight: bolder;
`;

const Input = styled.input`
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid gray;
  border-radius: 0.3rem;
  width: 100%;
  margin-top: 0.5rem;
  border-color: #fb055`;
