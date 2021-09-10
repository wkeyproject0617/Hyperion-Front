import React, { useState } from 'react';
import Title from './Title';
import './Calendar.css';
import CalendarBody from './CalendarBody';

function Calendar() {
  let date = new Date();
  const [viewYear, setViewYear] = useState(date.getFullYear());
  const [viewMonth, setViewMonth] = useState(date.getMonth());

  return (
    <div className="Calendar__Container">
      <Title viewYear={viewYear} viewMonth={viewMonth} changeMonth={setViewMonth} changeYear={setViewYear} />

      <CalendarBody viewYear={viewYear} viewMonth={viewMonth} />
    </div>
  );
}

export default Calendar;
