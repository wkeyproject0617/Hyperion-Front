import React from 'react';
import './Calendar.css';

function Title({ viewYear, viewMonth, changeMonth, changeYear }) {
  if (viewMonth > 11) {
    changeMonth(viewMonth - 12);
    changeYear(viewYear + 1);
  } else if (viewMonth < 0) {
    changeMonth(viewMonth + 12);
    changeYear(viewYear - 1);
  }

  return (
    <>
      <div className="Calendar__Wrapper">
        <div className="title">
          <button className="nav-btn" onClick={() => changeMonth(viewMonth - 1)}>
            {' '}
            &lt;{' '}
          </button>
          <div className="nav">
            &nbsp;{viewYear}년 {viewMonth + 1 < 10 && 0}
            {viewMonth + 1}월&nbsp;
          </div>
          <button className="nav-btn" onClick={() => changeMonth(viewMonth + 1)}>
            {' '}
            &gt;{' '}
          </button>
        </div>
      </div>
    </>
  );
}

export default Title;
