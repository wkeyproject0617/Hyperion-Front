import React, { useEffect } from 'react';
import './Calendar.css';

function CalendarBody({ viewYear, viewMonth }) {
  const prevLast = new Date(viewYear, viewMonth, 0);
  const thisLast = new Date(viewYear, viewMonth + 1, 0);

  const PLDate = prevLast.getDate();
  const PLDay = prevLast.getDay();

  const TLDate = thisLast.getDate();
  const TLDay = thisLast.getDay();

  const prevDates = [];
  const thisDates = [...Array(TLDate + 1).keys()].slice(1);
  const nextDates = [];

  if (PLDay !== 6) {
    for (let i = 0; i < PLDay + 1; i++) {
      prevDates.unshift(PLDate - i);
    }
  }

  for (let i = 1; i < 7 - TLDay; i++) {
    nextDates.push(i);
  }

  const dates = prevDates.concat(thisDates, nextDates);
  const firstDateIndex = dates.indexOf(1);
  const lastDateIndex = dates.lastIndexOf(TLDate);

  dates.forEach((date, i) => {
    const condition = i >= firstDateIndex && i < lastDateIndex + 1 ? 'this' : 'other';

    const printDates = [];
    printDates[i] = date;

    const onClick = () => {
      var dd = printDates[i];
      var mm = viewMonth + 1;
      if (dd < 10) {
        dd = '0' + dd;
      }

      if (mm < 10) {
        mm = '0' + mm;
      }

      var st_date = String(viewYear) + '-' + mm + '-' + dd;
      console.log(st_date);
    };

    dates[i] = (
      <div onClick={() => onClick()} class="date-wrap">
        <span class={condition}>{date}</span>
      </div>
    );
  });

  useEffect(() => {
    const today = new Date();
    if (viewMonth + 1 === today.getMonth() + 1 && viewYear === today.getFullYear()) {
      for (let date of document.querySelectorAll('.this')) {
        if (+date.innerText === today.getDate()) {
          date.classList.add('today');
          break;
        }
      }
    }
    return () => {
      console.log(viewMonth + 1);
      console.log(today.getMonth() + 1);
      for (let date of document.querySelectorAll('.this')) {
        if (viewMonth !== today.getMonth() + 1) {
          date.classList.remove('today');
        }
      }
    };
  });

  return (
    <div className="Calendar__Wrapper">
      <div className="calendar">
        <div className="days">
          <div className="day"> 일 </div>
          <div className="day"> 월 </div>
          <div className="day"> 화 </div>
          <div className="day"> 수 </div>
          <div className="day"> 목 </div>
          <div className="day"> 금 </div>
          <div className="day"> 토 </div>
        </div>
        <div className="dates-wrap">{dates}</div>
      </div>
    </div>
  );
}

export default CalendarBody;
