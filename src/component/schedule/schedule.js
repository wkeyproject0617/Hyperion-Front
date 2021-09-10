import React, { useCallback, useEffect, useState } from 'react';
import './schedule.css';
import Api from '../../api/dataControllerApi';
import CheckToken from '../../api/checkToken';
import ScheduleNav from './ScheduleNav/scheduleNav';
import ScheduleSubNav from './ScheduleSubNav/scheduleSubNav';
import ScheduleBody from './ScheduleBody/scheduleBody';
import { useDispatch, useSelector } from 'react-redux';
import { changeNavList } from '../../redux/modules/schedule/navList';
import { changeToken } from '../../redux/modules/schedule/token';
function Schedule() {
  // const [token, setToken] = useState(window.localStorage.getItem('accessToken'));
  // const refreshToken = window.localStorage.getItem('refreshToken');

  return (
    <div className="Schedule">
      <div className="Schedule__ContentWrap">
        {/* 여기서 컴포넌트들을 조합 한다 */}
        <ScheduleNav />
        <ScheduleSubNav />
        <ScheduleBody />
      </div>
    </div>
  );
}

export default Schedule;
