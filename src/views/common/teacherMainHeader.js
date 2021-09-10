import React from 'react';
import '../../css/teacherMainHeader.css';

function TeacherMainHeader({mode, setMode}){

    const navButtonData = [
        {
            value:"Schedule",
            name:"일정 관리",
        },
        {
            value:"Notice",
            name:"공지 관리",
        },
        {
            value:"Subject",
            name:"과목 관리",
        },
        {
            value:"Course",
            name:"수강 관리",
        },
        {
            value:"Report",
            name:"과제 관리",
        },
        {
            value:"Student",
            name:"학생 관리",
        },
        {
            value:"Employee",
            name:"직원 관리",
        }
    ]

    const onNavButtonClick = (e) =>{
        setMode(e.target.value);
    }

    return (
        <div className="TeacherMainHeader">
            <div id="TeacherMainHeaderTitle">
                <p id="HeaderTitle">{window.localStorage.getItem("userName") + " 강사님"}</p>
            </div>
            <div id="NavButtons">
                {navButtonData.map((data, index) => {
                    let _style = null;
                    if(mode === data.value){
                        _style = {
                            backgroundColor:"#1B3965",
                            color:"white"
                        }
                    }
                    return(<button key={index} className="TeacherMainHeader__NavButton" style={_style} value={data.value} onClick={onNavButtonClick}>{data.name}</button>);
                })}
            </div>
        </div>
    );
}

export default TeacherMainHeader;