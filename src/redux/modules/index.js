import { combineReducers } from 'redux';
import week from './week';
import clickedTeacherInfo from './schedule/clickedTeacherInfo';
import councelList from './councelList';
import attdRecModalInfo from './attdRecModalInfo';
import attdDetailModalInfo from './attdDetailModalInfo';
import selectedSubjectId from './attendance/selectedSubjectId';
import contentModalInfo from './schedule/mul/contentModalInfo';
import addModalInfo from './schedule/mul/addModalInfo';
import editModalInfo from './schedule/mul/editModalInfo';
import confirmModalInfo from './schedule/confirmModalInfo';
import deleteModalInfo from './schedule/mul/deleteModalInfo';
import mode from './schedule/mode';
import navList from './schedule/navList';
import bodyList from './schedule/bodyList';
import subNavList from './schedule/subNavList';
import councelDetailModalInfo from './councel/councelDetailModalInfo';
import token from './schedule/token';
import refreshToken from './schedule/refreshToken';
import filterModalInfo from './schedule/filterModalInfo';

const rootReducer = combineReducers({
  week,
  clickedTeacherInfo,
  councelList,
  attdRecModalInfo,
  attdDetailModalInfo,
  selectedSubjectId,
  contentModalInfo,
  addModalInfo,
  editModalInfo,
  confirmModalInfo,
  deleteModalInfo,
  mode,
  token,
  refreshToken,
  navList,
  subNavList,
  bodyList,
  councelDetailModalInfo,
  filterModalInfo,
});

export default rootReducer;
