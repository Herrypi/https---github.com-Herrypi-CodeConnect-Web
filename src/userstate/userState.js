import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

// 예시로 isLoggedIn과 token을 저장할 수 있는 atom을 생성합니다.
export const isLoggedInState = atom({
  key: 'isLoggedIn',
  default: false,
  effects_UNSTABLE: [persistAtom],
});

export const tokenState = atom({
  key: 'token',
  default: '',
  effects_UNSTABLE: [persistAtom],
});

export const persistConfig = {
  key: 'recoil-persist',
  storage: localStorage,
  // 여기에 Recoil Persist가 지속할 atom들을 추가합니다.
  // 예시: isLoggedInState, tokenState
  states: [isLoggedInState, tokenState],
};
