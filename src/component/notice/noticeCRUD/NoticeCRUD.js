import React, { useState } from "react";
import Swal from "sweetalert2";
import "./noticeCRUD.css";
import api from "../../../api/dataControllerApi";
import CheckToken from "../../../api/checkToken";
import AssignNoticeDate from "./AssignNoticeDate";

function NoticeCRUD({mode, setMode, notice}){
    const [token, setToken] = useState(window.localStorage.getItem("accessToken"));
    const refreshToken = window.localStorage.getItem("refreshToken");
    var [year, month, day] = notice.notice_date.split("-");
    day = day ? day : '';
    month = month ? month : '01';
    year = year ? year : '2021';
    const [assignDate, setAssignDate] = useState(false);
    const [showAssignButton, setShowAssignButton] = useState(false);
    const [inputs, setInputs] = useState({
        pin:notice.pin,
        title:notice.title,
        contents:notice.contents,
        year:year,
        month:month,
        day:day,
        division:notice.notice_division,
        file:'여기를 클릭하시면 파일을 선택하실 수 있습니다',
    });

    const onChange = (e) => {
        const {value, name} = e.target;
        if(name === "pin"){
            setInputs({...inputs, [name]:e.target.checked});
        }else{
            setInputs({...inputs, [name]:value});
        }
    }

    
    return(
        <div className="NoticeCRUD">
            {assignDate ? <AssignNoticeDate inputs={inputs} onChange={onChange} setAssignDate={setAssignDate}/> : null}
            <div className="NoticeCRUD__Header">
                <span className="NoticeCRUD__InputTitleLabel">공지 제목</span>
                <input className="NoticeCRUD__InputTitle" name={"title"} onChange={onChange} value={inputs.title} placeholder="제목을 입력하세요"></input>
                <div className="NoticeCRUD__SelectDivisionWrap">
                    <select className="NoticeCRUD__SelectDivision" name={"division"} value={inputs.division} onChange={onChange}>
                        <option>전체 공지</option>
                        <option>학생 공지</option>
                        <option>강사 공지</option>
                        <option>긴급 공지</option>
                        <option>기타 공지</option>
                        <option>학부모 공지</option>
                    </select>
                </div>
            </div>
            <div className="NoticeCRUD__ContentsWrap">
                <textarea className="NoticeCRUD__Contents" name={"contents"} onChange={onChange} value={inputs.contents} placeholder="내용을 입력하세요"></textarea>
            </div>
            <div className="NoticeCRUD__FileWrap">
                <span className="NoticeCRUD__FileSpan">첨부 파일</span>
                <label className="NoticeCRUD__FileLabel" htmlFor="NoticeCRUD__File" >{inputs.file}</label>
                <input type="file" id="NoticeCRUD__File" name={"file"} onInput={onChange}></input>
            </div>
            <div className="NoticeCRUD__Foot">
                <div className="NoticeCRUD__ButtonSelectDateWrap">
                    { showAssignButton ? <button className="NoticeCRUD__ButtonSelectDate" onClick={()=>{setAssignDate(true)}}>예약 등록하기</button> : null}
                </div>
                <div className="NoticeCRUD__NoticeButton">
                    {mode !== "AddNotice"? <ButtonDeleteNotice id={notice.id} setMode={setMode} token={token} setToken={setToken} refreshToken={refreshToken}/> : <button className="NoticeCRUD__ButtonBack" onClick={()=>{setMode("Notice")}}>삭제 하기</button> }
                    <ButtonUploadNotice setMode={setMode} mode={mode} noticeId={notice.id} inputs={inputs} token={token} setToken={setToken} refreshToken={refreshToken} setShowAssignButton={setShowAssignButton}/>
                </div>
            </div>
        </div>
    );
}

function ButtonUploadNotice({setMode, mode, noticeId, inputs, token, setToken, refreshToken, setShowAssignButton}){
    const uploadButtonName = mode === "AddNotice" ? "공지 등록" : "공지 수정";
    const {pin, title, contents, year, month, day, division} = inputs;
    const _day = day.length === 1 ? "0" + day: day; 
    const date = day ? year + "-" + month + "-" + _day : null;
    const _id = noticeId ? noticeId : null; 
    const _pin = pin ? pin : false; 
    const data = {
        pin:_pin,
        id:_id,
        title:title,
        contents:contents,
        notice_division:division,
        notice_date:date
    }

    const header = {
        headers:{
            Authorization: `Bearer ${token}`
        }
    }

    const uploadNotice = () => {
        if(title && contents && division){
            if(mode === "AddNotice"){
                AddNotice();
            }else{
                UpdateNotice(noticeId);
            }
        }else{
            Swal.fire("제목 또는 내용을 정확히 입력해 주세요", "", "info");
        }
        
    }

    const AddNotice = () => {
        api.postData("/adminApi/notices", data, header).then(res=> {
            console.log(res);
            if(res.data.description === "생성성공"){
                Swal.fire(res.data.description, "", res.data.result_code.toLowerCase()).then(res =>{
                    if(res.isConfirmed){
                        setMode("Notice");
                    }
                });
            }else{
                CheckToken(refreshToken, token, setToken, res);
            }
        }).catch(err => {
            console.log(err);
        });
    }

    const UpdateNotice = () => {
        api.patchData("/adminApi/notices", data, header).then(res=> {
            console.log(res);
            Swal.fire(res.data.description, "", res.data.result_code.toLowerCase()).then(res =>{
                if(res.isConfirmed){
                    setMode("Notice");
                }else{
                    CheckToken(refreshToken, token, setToken, res);
                }
            });
        }).catch(err => {
            console.log(err);
        });
    }
    return(
        <div>
            <button className="NoticeCRUD__ButtonUploadNotice" onClick={uploadNotice}>{uploadButtonName}</button>
            <button className="NoticeCRUD__ButtonAssignDate" onClick={()=>{setShowAssignButton(true)}}>ㅁ</button>
        </div>);
}

function ButtonDeleteNotice({id, setMode, token, setToken, refreshToken}){
    const header = {
        headers:{
            Authorization: `Bearer ${token}`
        }
    }
    const deleteNotice = () => {
        api.deleteData("/adminApi/notices/"+id, header).then(res=>{
            console.log(res);
            Swal.fire(res.data.description, "", res.data.result_code.toLowerCase()).then(res =>{
                if(res.isConfirmed){
                    setMode("Notice");
                }else{
                    CheckToken(refreshToken, token, setToken, res);
                }
            });
        });
    }
    return(<button className="NoticeCRUD__ButtonDeleteNotice" onClick={deleteNotice}>삭제 하기</button>);
}

export default NoticeCRUD;