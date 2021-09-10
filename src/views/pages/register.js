import React, {useState, useRef} from 'react';

import Api from '../../api/userControllerApi';

import { Link } from 'react-router-dom';
import logo from '../../img/logo.png'
import '../../css/register.css';
import styled from 'styled-components';
import Swal from 'sweetalert2';

const Label = styled.span`
  color : ${props => props.check ? 'green' : 'red'};
`;

function Register(props){
  const [inputs, setInputs] = useState({
    id:'',
    password:'',
    passwordCheck:'',
    name:'',
    birthYear:'',
    birthMonth:1,
    birthDay:'',
    gender:'MAN',
    email:'',
    phoneNumber:'',
    phoneNumberAuth:''
  });

  const {
    id,
    password,
    passwordCheck,
    name,
    birthYear,
    birthMonth,
    birthDay,
    gender,
    email,
    phoneNumber,
    phoneNumberAuth
  } = inputs;

  const [LabelChk, setLabelChk] = useState({
    account:false,
    pw:false,
    pwChk:false,
    birthYearCount:false,
    birthDayCount:false,
    emailChkCount:false,
    phoneNumCount:false
  });

  const {
    account,
    pw,
    pwChk,
    birthYearCount,
    birthDayCount,
    emailChkCount,
    phoneNumCount
  } = LabelChk;

  const accountLabel = useRef('');
  const accountChk = (id) => {
    if(!id) {
      accountLabel.current = "아이디를 입력하여 주세요.";
          setLabelChk({
            ...LabelChk,
            account:false
          })
    } else {
      Api.getAccountChk(id)
        .then((res) => {
          if(id.includes(' ')){
            accountLabel.current = "아이디에 공백이 포함되면 안됩니다";
            setLabelChk({
              ...LabelChk,
              account:false
            })
          } else if(id.length < 6){
            accountLabel.current = "아이디는 6자리 이상이어야 합니다";
            setLabelChk({
              ...LabelChk,
              account:false
            })
          } else if(id.length >= 6 && res.data.result_code === "SUCCESS"){
            accountLabel.current = "사용가능한 아이디 입니다";
            setLabelChk({
              ...LabelChk,
              account:true
            })
          } else if(id.length >= 6 && res.data.result_code === "ERROR"){
            accountLabel.current = "이미 존재하는 아이디 입니다.";
            setLabelChk({
              ...LabelChk,
              account:false
            })
          }
        })
        .catch((error) => {
          return error;
        })
    }

  }

  const pwLabel = useRef('');
  const pwCheck = (pw) => {
    if(pw.length < 8){
      pwLabel.current = "비밀번호는 8자리 이상이어야 합니다";
        setLabelChk({
          ...LabelChk,
          pw:false
        })
    } else if(pw.includes(' ')){
      pwLabel.current = "비밀번호에 공백이 포함되면 안됩니다";
        setLabelChk({
          ...LabelChk,
          pw:false
        })
    } else {
      pwLabel.current = "사용가능한 비밀번호입니다.";
        setLabelChk({
          ...LabelChk,
          pw:true
        })
    }
  }

  const pwChkLabel = useRef('');
  const pwReChk = (pwReChk) => {
    if(pwReChk === inputs.password){
      pwChkLabel.current = "비밀번호가 일치합니다";
        setLabelChk({
          ...LabelChk,
          pwChk:true
        })
    } else {
      pwChkLabel.current = "비밀번호가 일치하지 않습니다";
        setLabelChk({
          ...LabelChk,
          pwChk:false
        })
    }
  }

  const birthYearLabel = useRef('');
  const birthYearChk = (chk) => {
    if(chk.length === 4 && !isNaN(chk)){
      birthYearLabel.current = "확인됨";
        setLabelChk({
          ...LabelChk,
          birthYearCount:true
        })
    } else {
      birthYearLabel.current = "년도는 4자리 숫자 입니다";
        setLabelChk({
          ...LabelChk,
          birthYearCount:false
        })
    }
  }
  
  const birthDayLabel = useRef('');
  const birthDayChk = (chk) => {
    if(chk.length === 2 && !isNaN(chk)){
      birthDayLabel.current = "확인됨";
        setLabelChk({
          ...LabelChk,
          birthDayCount:true
        })
    } else{
      birthDayLabel.current = "일(日)은 2자리 숫자 입니다";
        setLabelChk({
          ...LabelChk,
        birthDayCount:false
        })
    }
  }

  const emailChkLabel = useRef('');
  const emailChk = (chk) => {
    if(!chk){
      emailChkLabel.current = "이메일을 입력하여 주세요.";
              setLabelChk({
                ...LabelChk,
                emailChkCount:false
              })
    } else {
      Api.getEmailChk(chk)
        .then((res) => {
          const data = res.data.result_code;
          if(chk.includes("@") && chk.includes(".")){
            if(data === "SUCCESS"){
              emailChkLabel.current = "사용가능한 이메일 입니다.";
              setLabelChk({
                ...LabelChk,
                emailChkCount:true
              })
            } else if("ERROR"){
              emailChkLabel.current = "이미 등록된 이메일 입니다.";
              setLabelChk({
                ...LabelChk,
                emailChkCount:false
              })
            }
          } else{
            emailChkLabel.current = "이메일 형식이 아닙니다.";
            setLabelChk({
              ...LabelChk,
              emailChkCount:false
            })
          }
        })
    }
  }

  const phoneNumChkLabel = useRef('');
  const phoneNumChk = (chk) => {
    if(chk.length === 13 && chk.includes("-")){
      phoneNumChkLabel.current = "사용가능한 전화번호 입니다.";
      setLabelChk({
        ...LabelChk,
        phoneNumCount:true
      })
    } else {
      phoneNumChkLabel.current = "전화번호 형식이 잘못됐습니다.";
      setLabelChk({
        ...LabelChk,
        phoneNumCount:false
      })
    }
  }

  const onChange = (e) => {
    const {value, name} = e.target;

    setInputs({
      ...inputs,
      [name]:value
    });

    if(name === "id") {
      accountChk(value);
    }
    
    if(name === "password"){
      pwCheck(value);
    }

    if(name === "passwordCheck"){
      pwReChk(value);
    }

    if(name === "birthYear"){
      birthYearChk(value);
    }

    if(name === "birthDay"){
      birthDayChk(value);
    }

    if(name === "email"){
      emailChk(value);
    }

    if(name === "phoneNumber"){
      phoneNumChk(value);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = {
      user_account:inputs.id,
      user_birthday:`${inputs.birthYear}-${inputs.birthMonth}-${inputs.birthDay}`,
      gender:inputs.gender,
      user_email:inputs.email,
      user_name:inputs.name,
      user_password:inputs.password,
      user_phone_number:inputs.phoneNumber
    }
    console.log(user);
    Api.postUsers(user)
      .then((res) => {
        Swal.fire({
          title:"성공",
          text:"회원가입에 성공했습니다.",
          icon:"success"
        }).then(()=>{
          props.history.push("/");
        })
      })
      .catch((error) => {
        return error;
      })
  }

  const handleClick = (e) => {
    const keyCount = [];
    for (const key in LabelChk) {
      keyCount.push(LabelChk[key]);
    }

    if(keyCount.includes(false)){
      e.preventDefault();
      Swal.fire({
        title:"오류",
        text:"잘못된 내용이 있습니다. 모든 내용을 확인해주세요.",
        icon:"error"
      })
    } 
  }

  return(
    <div className="LoginStudent">
      <div className="WrapImg">
        <img src={logo} width="200px" alt="hyperion.logo"></img>
        {/* 히페리온 로고 삽입 */}
      </div>
      <div className="WrapForm">
        <form className="Register" onSubmit={handleSubmit} autoComplete="off">
          <div className="FormContents">
            <p>
            {/* 아이디 입력란 */}
              <span className="IDPWLabel">아이디&비밀번호</span>
              <br></br>
              <input className="InputID" type="text" name="id" placeholder="아이디를 입력해주세요." value={id} onChange={onChange}/>
              <br></br>
              <Label check={account} className="IdState">{accountLabel.current}</Label>
              <br></br>

              {/* 비밀번호 입력란 */}
              <input className="InputPW" type="password" name="password" placeholder="비밀번호를 입력해주세요." value={password} onChange={onChange}/>
              <br></br>
              <Label check={pw} className="PwState">{pwLabel.current}</Label>
              <br></br>

              {/* 비밀번호 확인 입력란 */}
              <input className="InputPWRe" type="password" name="passwordCheck" placeholder="비밀번호를 다시 입력해주세요." value={passwordCheck} onChange={onChange}/>
              <br></br>
              <Label check={pwChk} className="PwReState">{pwChkLabel.current}</Label>
            </p>

            <p>
              {/* 이름 입력란 */}
              <span className="NameLabel">이름</span>
              <br></br>
              <input className="InputName" type="text" name="name" placeholder="이름을 입력해주세요." value={name} onChange={onChange}></input>
            </p>
            <p>
              {/* 생일 입력란 */}
              <span className="BirthLabel">생일 입력 예)2020 02 02</span>
              <br></br>
              <input className="InputBirthYear" type="text" name='birthYear' placeholder="year(4자리)" value={birthYear} onChange={onChange}></input>
                <select className="InputBirthMonth" name="birthMonth" value={birthMonth} onChange={onChange}>
                  <option value="01">1</option>
                  <option value="02">2</option>
                  <option value="03">3</option>
                  <option value="04">4</option>
                  <option value="05">5</option>
                  <option value="06">6</option>
                  <option value="07">7</option>
                  <option value="08">8</option>
                  <option value="09">9</option>
                  <option value="10">10</option>
                  <option value="11">11</option>
                  <option value="12">12</option>
                </select>
                <input className="InputBirthDay" type="text" name='birthDay' placeholder="day(2자리)" value={birthDay} onChange={onChange}></input>
                <br></br>
                <Label check={birthYearCount} className="BirthYearState">{birthYearLabel.current}</Label>
                <Label check={birthDayCount} className="BirthDayState">{birthDayLabel.current}</Label>
              </p>

              <p>
                {/* 성별 입력 */}
                <span className="GenderLabel">성별</span>
                <br></br>
                <select className="InputGender" name="gender" value={gender} onChange={onChange}>
                  <option value="MAN">남자</option>
                  <option value="WOMAN">여자</option>
                </select>
              </p>

              <p>
                {/* 이메일 입력 */}
                <span className="EmailLabel">이메일(Email)</span>
                <br></br>
                <input className="InputEmail" type="text" name="email" placeholder="이메일을 입력해주세요." value={email} onChange={onChange}></input>
                <br></br>
                <Label check={emailChkCount} className="EmailState">{emailChkLabel.current}</Label>
              </p>

              <p>
                {/* sms 인증란 */}
                <span className="PhoneAuthLabel">SMS 인증</span>
                <br></br>
                <input className="InputPhoneNumber" type="text" name="phoneNumber" placeholder="전화번호를 입력해주세요." value={phoneNumber} onChange={onChange}></input>
                <button className="ButtonMakeAuthNumber">인증번호 받기</button>
                <br></br>
                <Label check={phoneNumCount} className="TeleState">{phoneNumChkLabel.current}</Label>
                <br></br>
                <input className="InputAuthNumber" type="text" name="phoneNumberAuth" placeholder="인증번호" value={phoneNumberAuth} onChange={onChange}></input>
              </p>
          </div>

          {/* 회원가입 버튼 */}
          <button type="button" className="RegisterCancleBtn">
            <Link to="/">취소하기</Link>
          </button>
          <button type="submit" className="RegisterButton" onClick={handleClick}>회원가입</button>
        </form>
      </div>
    </div>
  )
}

export default Register;