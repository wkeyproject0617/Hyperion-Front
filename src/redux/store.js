import { createStore } from 'redux';
import rootReducer from './modules';
import { composeWithDevTools } from 'redux-devtools-extension';
export const store = createStore(rootReducer, composeWithDevTools()); // 스토어를 만듭니다.
