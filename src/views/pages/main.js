import React from 'react';
import { Link } from 'react-router-dom';
import '../../css/main.css';
import logo from '../../img/logo.png'

function Main(){
  return (
    <div className="Main">
      <div className="wrap_img">
        <img src={logo} width="350px" alt="hyperion.logo"></img>
        {/* 히페리온 로고 삽입 */}
      </div>
      <div>
        <div className="wrap_button">
        {/* 버튼 생성 */}
          <div className="button_contents">
          {/* 버튼 내용 생성 */}
            <h1 className="button_label">학생 로그인</h1>
            <Link to="/login/student" className="move_page_button">학생페이지</Link>
          </div>
          <div className="button_contents">
            <h1 className="button_label">강사 로그인</h1>
            <Link to="/login/teacher" className="move_page_button">강사페이지</Link>  
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;