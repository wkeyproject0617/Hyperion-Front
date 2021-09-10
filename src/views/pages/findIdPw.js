import React, {useState} from 'react';
import { Link } from 'react-router-dom';

import '../../css/findIdPw.css';

import Api from '../../api/userControllerApi';
import Modal from '../../component/common/modal';

function FindIdPw(){
  const [idInputs, setidInputs] = useState({
    username:'',
    useremail:'',
    userbirth:''
  });

  const {
    username,
    useremail,
    userbirth
  } = idInputs;

  const [pwInputs, setpwInputs] = useState({
    userid:'',
    userpwname:'',
    userpwemail:''
  });

  const {
    userid,
    userpwname,
    userpwemail
  } = pwInputs;

  const onIdChange = (e) => {
    let {value, name} = e.target;

    setidInputs({
      ...idInputs,
      [name]:value
    });
  }

  const onPwChange = (e) => {
    let {value, name} = e.target;

    setpwInputs({
      ...pwInputs,
      [name]:value
    });
  }

  const [ModalID, setModalID] = useState();
  const [ModalPW, setModalPW] = useState();

  const findIdSubmit = (e) => {
    e.preventDefault();
    
    const findId = {
      user_name:username,
      user_email:useremail,
      user_birthday:userbirth
    }
    
    Api.postUserSearch(findId)
      .then((res) => {
        if(res.data.result_code === "SUCCESS"){
          setModalID(<FindID info={res.data.data.user_account}/>)
        } else if(res.data.result_code === "ERROR"){
          setModalID(<FindID/>)
        }
      })
      .catch((err) => {
        console.log(err);
      })
  }

  const findPwSubmit = (e) => {
    e.preventDefault();
    
    const findPw = {
      user_account:userid,
      user_name:userpwname,
      user_email:userpwemail
    }

    Api.postUserPasswordSearch(findPw)
      .then((res) => {
        if(res.data.result_code === "SUCCESS"){
          setModalPW(<FindPw result={"SUCCESS"}/>)
        } else if(res.data.result_code === "ERROR"){
          setModalPW(<FindPw result={"ERROR"}/>)
        }
      })
      .catch((err) => {
        console.log(err);
      })
  }

  return(
    <div className="findIdPwWrap">
      <div className="findIdPwContents">
        <div className="findIdWrap">
          <div className="findId">
            <div className="findIdTitle">아이디 찾기</div>
            <div className="findIdSubTitle">분실한 사용자님의 아이디를 바로 찾아드립니다.</div>
            
            <form autoComplete="off" onSubmit={findIdSubmit}>
              <input type="text" name="username" value={username} onChange={onIdChange}  placeholder="사용자 이름"/>
              <span className="findIdPwSpan">사용자님의 이름을 기입해 주세요.</span>
              <input type="text" name="useremail" value={useremail} onChange={onIdChange} placeholder="등록된 사용자 이메일"/>
              <span className="findIdPwSpan">회원가입때 등록하신 사용자님의 이메일를 기입해 주세요.</span>
              <input type="text" name="userbirth" value={userbirth} onChange={onIdChange} placeholder="사용자 생년월일 (예:1990-12-10)"/>
              <span className="findIdPwSpan">사용자님의 생년월일을 입력해 주세요.</span>

              <button className="findIdBtn">아이디 찾기</button>
              
              {ModalID}
              
            </form>
          </div>
        </div>

        <div className="findPwWrap">
          <div className="findPw">
            <div className="findPwTitle">비밀번호 찾기</div>
            <div className="findPwSubTitle">비밀번호를 등록된 이메일로 발송해드립니다.</div>
            
            <form autoComplete="off" onSubmit={findPwSubmit}>
              <input type="text" placeholder="사용자 아이디" name="userid" value={userid} onChange={onPwChange}/>
              <span className="findIdPwSpan">사용자님의 아이디를 입력해 주세요.</span>
              <input type="text" placeholder="사용자 이름" name="userpwname" value={userpwname} onChange={onPwChange}/>
              <span className="findIdPwSpan">사용자님의 이름을 기입해 주세요.</span>
              <input type="text" placeholder="등록된 사용자 이메일" name="userpwemail" value={userpwemail} onChange={onPwChange}/>
              <span className="findIdPwSpan">회원가입때 등록하신 사용자님의 이메일를 기입해 주세요.</span>

              <button className="findPwBtn">비밀번호 찾기</button>

              {ModalPW}

            </form>
          </div>
        </div>
  
      </div>
    </div>
  )
}

function FindID({info}){
  
  const closeModal = () => {
    window.location.reload();
  }
  
  if(info){
    const HeaderStyle = {
      fontSize:"32px",
      marginTop:"2%",
      marginBottom:"5%"
    }
    
    const BodyStyle = {
      borderBottom:"2px solid #C5CCD7",
      paddingBottom:"8%"
    }
    
    const FooterStyle = {
      position:"relative",
      marginTop:"4%"
    }
  
    const FooterBtnStyle = {
      background:"#9162FF 0% 0% no-repeat",
      font:"normal normal normal 18px/22px Noto Sans KR",
      height:"8vh",
      width:"100%",
      border:"none"
    }

    const FooterLinkStyle = {
      display:"inline-block",
      width:"100%",
      color:"#FFFFFF",
      textDecoration:"none"
    }
  
    const Header = <div style={HeaderStyle}>아이디 찾기</div>
    
    const spanInfoStyle = {color:"#9162FF"}
    const spanInfo = <span style={spanInfoStyle}>{info}</span>;
    const Body = <div style={BodyStyle}>본인인증이 완료되었습니다. 사용자 아이디는 {spanInfo}입니다.</div>;
  
    const Footer = 
      <div style={FooterStyle}>
        <button type="button" style={FooterBtnStyle}><Link to="/" style={FooterLinkStyle}>로그인 하기</Link></button>
      </div>;
  
    return(
      <Modal
        Header={Header}
        Body={Body}
        Footer={Footer}
        onClose={closeModal}
      />
    )
  } else if(!info){
    const HeaderStyle = {
      fontSize:"32px",
      marginTop:"2%",
      marginBottom:"5%"
    }
    
    const BodyStyle = {
      borderBottom:"2px solid #C5CCD7",
      paddingBottom:"8%"
    }
    
    const FooterStyle = {
      position:"relative",
      marginTop:"4%"
    }
  
    const FooterBtnStyle = {
      background:"#9162FF 0% 0% no-repeat",
      font:"normal normal normal 18px/22px Noto Sans KR",
      height:"8vh",
      width:"100%",
      border:"none"
    }
    const FooterLinkStyle = {
      display:"inline-block",
      width:"100%",
      color:"#FFFFFF",
      textDecoration:"none"
    }
  
    const Header = <div style={HeaderStyle}>등록되지 않은 사용자</div>
    
    const Body = <div style={BodyStyle}>입력한 정보에 맞는 사용자를 찾을 수 없습니다.<br/>확인 후 다시 입력해 주세요.</div>;
  
    const Footer = 
      <div style={FooterStyle}>
        <button type="button" style={FooterBtnStyle}><Link to="/" style={FooterLinkStyle}>로그인 하기</Link></button>
      </div>;
  
    return(
      <Modal
        Header={Header}
        Body={Body}
        Footer={Footer}
        onClose={closeModal}
      />
    )
  }
  
}

function FindPw({result}){
  const closeModal = () => {
    window.location.reload();
  }

  const HeaderStyle = {
      fontSize:"32px",
      marginTop:"2%",
      marginBottom:"5%"
    }
    
    const BodyStyle = {
      borderBottom:"2px solid #C5CCD7",
      paddingBottom:"8%"
    }
    
    const FooterStyle = {
      position:"relative",
      marginTop:"4%"
    }
  
    const FooterBtnStyle = {
      background:"#9162FF 0% 0% no-repeat",
      font:"normal normal normal 18px/22px Noto Sans KR",
      height:"8vh",
      width:"100%",
      border:"none"
    }

    const FooterLinkStyle = {
      display:"inline-block",
      width:"100%",
      color:"#FFFFFF",
      textDecoration:"none"
    }

  if(result === "SUCCESS"){
    const Header = <div style={HeaderStyle}>비밀번호 찾기</div>
    
    const Body = <div style={BodyStyle}>회원가입시 등록된 이메일로 임시 비밀번호를 발급해 드렸습니다. <br/>확인 후 비밀번호를 변경해 주세요.</div>;
  
    const Footer = 
      <div style={FooterStyle}>
        <button type="button" style={FooterBtnStyle}><Link to="/" style={FooterLinkStyle}>로그인 하기</Link></button>
      </div>;
    return(
      <Modal
        Header={Header}
        Body={Body}
        Footer={Footer}
        onClose={closeModal}
      />
    )
  } else if(result === "ERROR"){
    const Header = <div style={HeaderStyle}>등록되지 않은 사용자</div>
    
    const Body = <div style={BodyStyle}>입력한 정보에 맞는 사용자를 찾을 수 없습니다.<br/>확인 후 다시 입력해 주세요.</div>;
    
    const Footer = 
      <div style={FooterStyle}>
        <button type="button" style={FooterBtnStyle}><Link to="/" style={FooterLinkStyle}>로그인 하기</Link></button>
      </div>;
      
    return(
      <Modal
        Header={Header}
        Body={Body}
        Footer={Footer}
        onClose={closeModal}
      />
    )
  }

}

export default FindIdPw;