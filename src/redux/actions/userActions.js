export const actionTypes = {
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
    REGISTER: 'REGISTER',
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
  // ...
  