import React, {useEffect, useState} from 'react';

import Api from '../../api/sessionControllerApi';
import NoticeApi from '../../api/dataControllerApi';
import { Link } from 'react-router-dom';
import '../../css/login.css';
import logo from '../../img/logo.png';
import Swal from 'sweetalert2';
import LoginHeader from '../../views/common/loginHeader';

function Login(props) {
  const [notices, setNotices] = useState();
  const [inputs, setInputs] = useState({
    id:'',
    password:''
  })

  const {id, password} = inputs; 

  const onChange = (e) => {
    const {value, name} = e.target;

    setInputs({
      ...inputs,
      [name]:value
    });
  }

  const _getNotice = () => {
    NoticeApi.getData("/notices").then(res => {
      setNotices(res.data.data);
    });
  }

  useEffect(() => {
    _getNotice();
  }, [])

  const LoginEnter = () => {
    if(window.event.keyCode === 13){
      LoginClick();
    }
  }

  const LoginClick = () => {
    const user = {
      user_account:id,
      user_password:password
    }

    Api.postLogin(user)
      .then(res => {
        const result = res.data.result_code;
        const description = res.data.description;
        

        if(result === "SUCCESS"){
          const accessToken = res.data.data.access_token;
          const refreshToken = res.data.data.refresh_token;
          const userName = res.data.data.user_name;

          window.localStorage.removeItem("accessToken");
          window.localStorage.removeItem("refreshToken");

          window.localStorage.setItem("accessToken", accessToken);
          window.localStorage.setItem("refreshToken", refreshToken);
          window.localStorage.setItem("userName", userName);
          props.history.push("/teacherMain");

        } else if(result === "ERROR"){

            if(description === "아이디불일치"){
              Swal.fire({
                title:"회원정보불일치",
                text:"입력하신 아이디가 존재하지 않습니다",
                icon:"error"
              })
            } else if(description === "비밀번호불일치"){
              Swal.fire({
                title:"회원정보불일치",
                text:"입력하신 비밀번호가 존재하지 않습니다",
                icon:"error"
              })
            }
        }
      })
      .catch(err => {
        return err;
      })
  }

  return(
    <>
      <LoginHeader/>
      <div className="Wrapper">
        <div className="LoginWrap">
          <div className="LoginSectionLeft">
            <div className="Login">
              <div className="LoginTitle">강사 로그인</div>

              <div className="LoginContents">
                <form>
                  <div className="LoginInfo">
                    <input className="InputId" type="text" name="id" placeholder="사용자 아이디" onChange={onChange} onKeyUp={LoginEnter} autoComplete="off"/>

                    <input className="InputPw" type="password" name="password" placeholder="사용자 비밀번호" onChange={onChange} onKeyUp={LoginEnter} autoComplete="off"/>
                  </div>
                </form>

                <div className="LoginBtnWrap">
                  <div className="InfoBtn">
                    <button className="FindIdPw" type="button">
                      <Link to="/findIdPw">아이디/비밀번호 찾기</Link>
                    </button>
                    <button className="RegisterBtn" type="button">
                      <Link to="/register">회원가입</Link>
                    </button>
                  </div>

                  <button type="submit" className="LoginBtn" onClick={LoginClick}>로그인</button>
                </div>
              </div>
            </div>

            <div className="LoginNoticeWrap"> 
              { notices ? <LoginNotice notices={notices}/> : "Loading..."}
            </div>
          </div>

          <div className="LoginSectionRight">
            <img className="LoginImg" src={logo} alt="logo"></img>
          </div>
        </div>
      </div>
    </>
  )
}

function LoginNotice({notices}){
  return(
    <div className="LoginNotice">
      {notices.map(notice => {
        return(
          <div className="LoginNotice__ListView" key={notice.id}>
            <span className="LoginNotice__Title">{notice.title}</span>
            <span className="LoginNotice__Date">{notice.notice_date}</span>
          </div>
        );
      })}
    </div>
  );

}

export default Login;