// 예시: userReducer.js
export const USER_LOGIN_REQUEST = 'USER_LOGIN_REQUEST';
export const USER_LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS';
export const USER_LOGIN_FAIL = 'USER_LOGIN_FAIL';

// 예시: userReducer.js
export const userLoginRequest = () => ({
    type: USER_LOGIN_REQUEST,
  });
  
  export const userLoginSuccess = (userInfo) => ({
    type: USER_LOGIN_SUCCESS,
    payload: userInfo,
  });
  
  export const userLoginFail = (error) => ({
    type: USER_LOGIN_FAIL,
    payload: error,
  });
  
// 예시: userReducer.js
const initialState = {
    userInfo: null,
    loading: false,
    error: null,
  };

  // 예시: userReducer.js
export default function userReducer(state = initialState, action) {
    switch (action.type) {
      case USER_LOGIN_REQUEST:
        return {
          ...state,
          loading: true,
          error: null,
        };
      case USER_LOGIN_SUCCESS:
        return {
          ...state,
          loading: false,
          userInfo: action.payload,
        };
      case USER_LOGIN_FAIL:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
      default:
        return state;
    }
  }
  

// import { combineReducers } from 'redux';

// const rootReducer = combineReducers({
//     user: (state = null, action) => {
//       switch (action.type) {
//         case 'SET_USER':
//           return action.payload;
//         default:
//           return state;
//       }
//     },
//   });

// export default rootReducer;