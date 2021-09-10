import React from 'react';

import '../../css/loginHeader.css';

import logo from '../../img/logo.png';

function LoginHeader(props){
  const logoClick = () => {
    window.location.href='http://localhost:3000/';
  }

  return(
    <div className="LoginHeaderWrap">
      <img className="LoginHeaderLogo" src={logo} onClick={logoClick} alt="logo"/>

      <div className="LoginHeaderBtnWrap">
        <button className="LoginHeaderBtn" id="LoginHeaderStudentBtn">학생 로그인</button>
        <button className="LoginHeaderBtn" id="LoginHeaderTeacherBtn">강사 로그인</button>
      </div>
    </div>
  )
}

export default LoginHeader;