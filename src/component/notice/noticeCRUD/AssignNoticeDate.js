import React from "react";
import "./AssignNoticeDate.css";

function AssignNoticeDate({inputs, onChange, setAssignDate}){
    var now = new Date();
    var year = [];
    var month = [];
    for(var i = now.getFullYear(); i < now.getFullYear() + 5; i++){
        year.push(<option key={i} value={i}>{i}</option>);
    }
    for(var k = 1; k <= 12; k++){
        if(k < 10){
            month.push(<option key={k} value={"0" + k}>{"0" + k}</option>);
        }else{
            month.push(<option key={k} value={k}>{k}</option>);
        }
    }
    return(<div className="AssignNoticeDate">
       <div className="AssignNoticeDate__ContentsWrap">
           <div className="AssignNoticeDate__TopBottomStyle"></div>
           <div className="AssignNoticeDate__Contents">
                <div className="AssignNoticeDate__Header">
                    <span className="AssignNoticeDate__Title">예약 등록하기</span>
                    <span className="AssignNoticeDate__SubTitle">지정된 일자와 시간에 공지를 등록합니다</span>
                </div>
                <div className="AssignNoticeDate__Body">
                    <span className="AssignNoticeDate__Label">일자</span>
                    <div className="AssignNoticeDate__SelectDateWrap">
                        <select className="AssignNoticeDate__SelectYear" placeholder="년" onChange={onChange} value={inputs.year} name="year">
                            {year}
                        </select>
                        <select className="AssignNoticeDate__SelectYear" placeholder="월" onChange={onChange} value={inputs.month} name="month">
                            {month}
                        </select>
                        <input className="AssignNoticeDate__SelectYear" placeholder="일[ex:02]" onChange={onChange} value={inputs.day} name="day" maxLength="2"/>
                    </div>
                    <span className="AssignNoticeDate__SubLabel">예약할 날짜를 입력해 주세요</span>
                </div>
                <div className="AssignNoticeDate__Foot">
                    <button className="AssignNoticeDate__ButtonSetDate" onClick={()=>{setAssignDate(false)}}>예약 등록하기</button>
                </div>
           </div>
           <div className="AssignNoticeDate__TopBottomStyle"></div>
       </div>
    </div>)
}

export default AssignNoticeDate;