export const actionTypes = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  REGISTER: 'REGISTER',
  SET_NICKNAME: 'SET_NICKNAME'
  // ...
}

export const login = (user) => {
  return {
    type: actionTypes.LOGIN,
    payload: user
  }
}

export const logout = () => {
  return {
    type: actionTypes.LOGOUT
  }
}

export const register = (user) => {
  return {
    type: actionTypes.REGISTER,
    payload: user
  }
}

// userActions.js

export const setNickname = (nickname) => {
  return {
    type: actionTypes.SET_NICKNAME,
    payload: nickname,
  };
};

  // ...
