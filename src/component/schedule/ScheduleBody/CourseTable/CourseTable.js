import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './CourseTable.css';
import TableCell from './TableCell/TableCell.js';

import { useSelector } from 'react-redux';

// variables
import { courseColors } from './vars/courseColors';
import { timeTableObject } from './vars/timeTableObject';
import { cellHeightObject } from './vars/cellHeightObject';
import { KOR_DAYS } from '../../../common/vars/vars';

const CourseTable = ({ timeInterval, bodyList, onChangeBodyList }) => {
  const week = useSelector((state) => state.week);
  const date = useMemo(() => new Date(), []);

  const [dates, setDates] = useState([]);

  const cellHeight = cellHeightObject[timeInterval];

  const timeTable = timeTableObject[timeInterval];

  const getFirstAndLastDate = useCallback(() => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDay();

    const firstDate = new Date(year, month, date.getDate() - day + 7 * week); //  이번 주 일요일 date
    const lastDate = new Date(year, month, date.getDate() + (6 - day) + 7 * week); // 이번 주 토요일 date

    return { firstDate: firstDate, lastDate: lastDate };
  }, [date, week]);

  useEffect(() => {
    const { firstDate, lastDate } = getFirstAndLastDate();
    setDates(makeCalendar(firstDate, lastDate));
  }, [getFirstAndLastDate]);

  const makeCalendar = (firstDate, lastDate) => {
    let tempDate = new Date(firstDate);
    const newDates = [['일'], ['월'], ['화'], ['수'], ['목'], ['금'], ['토']];
    const tempTime = timeTableObject['10'].slice(1); // '09' '0910' '0920' ...
    let index = 0;
    while (tempDate.getDate() !== lastDate.getDate()) {
      newDates[index].push(tempDate);
      newDates[index] = newDates[index].concat(tempTime); // ['일', 'Thu May 20 2021 00:00:00 GMT+0900 (대한민국 표준시)', '09', '0910', '0920', ...]
      tempDate = new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate() + 1);
      index++;
    }
    // 마지막 토요일에 해당하는 Date
    newDates[index].push(tempDate);
    newDates[index] = newDates[index].concat(tempTime);

    // shallow copy를 새로운 배열 객체로 반환(원본 array는 바뀌지 않음)
    return newDates.slice();
  };

  const getCurDateSchedule = (curDay, startTime, curDate) => {
    let curDateSchedule = null;

    // day('일') or date('Thu May 20 2021 00:00:00 GMT+0900 (대한민국 표준시)')의 경우
    // null
    if (isNaN(startTime) || !bodyList) return curDateSchedule;
    const Hour = parseInt(startTime.slice(0, 2)); // '09'

    const Minute = startTime.length === 2 ? 0 : parseInt(startTime.slice(2)); // '50'
    for (let i = 0; i < bodyList.length; i++) {
      const startClassDate = new Date(bodyList[i].startClassDate + ' ' + bodyList[i].startTime);
      const endClassDate = new Date(bodyList[i].endClassDate + ' ' + bodyList[i].endTime);

      const _curDate = new Date(curDate);
      _curDate.setHours(Hour, Minute);

      if (startClassDate > _curDate || endClassDate < _curDate) {
        continue;
      }

      const startTime = bodyList[i].startTime.split(':');
      const endTime = bodyList[i].endTime.split(':');

      //13
      const startHour = parseInt(startTime[0]);
      //10
      const startMinute = parseInt(startTime[1]);
      //15
      const endHour = parseInt(endTime[0]);
      //30
      const endMinute = parseInt(endTime[1]);

      if (Hour === startHour && Minute === startMinute && bodyList[i].days.includes(curDay)) {
        curDateSchedule = {
          ...bodyList[i],

          startHour,
          startMinute,
          endHour,
          endMinute,
          color: bodyList[i].regular ? courseColors[i] : '#FFD572',
        };
        break;
      }
    }
    return curDateSchedule;
  };

  return (
    <div id="weekly-view">
      {/* 테이블 가장 왼쪽 시간 표기 부분 */}
      <div className="hour-col">
        {timeTable.map((time, index) => {
          const hour = time === ' ' ? '' : time.slice(0, 2);
          const minute = time === ' ' || timeInterval === '60' ? '' : time.length === 4 ? time.slice(2) : '00';
          const timeArr = [hour, <br></br>, minute];
          return (
            <div key={index} className="hour-cell" style={{ fontSize: '10px', borderBottom: 'none' }}>
              {timeArr}
            </div>
          );
        })}
      </div>

      {dates.map((a, index) => (
        // a:  ['일', 'Thu May 20 2021 00:00:00 GMT+0900 (대한민국 표준시)', '09', '0910', '0920', ...]
        <div key={index} className="weekly-col">
          <div
            className={a[0] === '일' ? 'weekly-cell sunday' : a[0] === '토' ? 'weekly-cell saturday' : 'weekly-cell'}
            style={{
              fontFamily: 'Noto Sans KR',
              fontSize: '10px',
              fontWeight: 'normal',
              backgroundColor: a[1].getDate() === date.getDate() ? '#f2f5f7' : null,
            }}
          >
            {a[0] + '/' + a[1].getDate()}
          </div>
          {a.slice(2).map((time, j) => {
            return (
              <TableCell
                key={j}
                day={a[0]}
                date={a[1].getDate()}
                curDay={KOR_DAYS[date.getDay()]}
                curDate={date.getDate()}
                curHour={date.getHours()}
                curMinute={Math.floor(date.getMinutes() / parseInt(timeInterval)) * parseInt(timeInterval)}
                // time으로 변수 name 변경
                startHour={time}
                // a[1]도 넣어서 createdTime과 비교?
                schedule={getCurDateSchedule(a[0], time, a[1])}
                cellHeight={cellHeight}
                timeInterval={timeInterval}
                bodyList={bodyList}
                onChangeBodyList={onChangeBodyList}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default CourseTable;
