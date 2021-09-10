import React from "react";
import "./reportFoot.css";

function ReportFoot({testTime, setTestTime, onSaveButtonClick}){

    const onChange = (e) => {
        const {value} = e.target;
        setTestTime(value);
    }

    return(
        <div className="ReportFoot">
            <div>
                <span className="ReportFoot__InputTimeLabel">시험 시간 설정</span>
                <input className="ReportFoot__InputTime" placeholder="분[(ex)24]" value={testTime} onChange={onChange} maxLength="2" autoComplete="off"/>
            </div>
            <button className="ReportFoot__ButtonSave" onClick={onSaveButtonClick}>저장하기</button>
        </div>
    )
}

export default ReportFoot;