import React from "react";
import "./reportHeader.css";

function ReportHeader({reportMode, setReportMode}){
    const headerButtonName = [
        {
            name: "단어 시험",
            tag: "Voca"
        },
        {
            name: "문장 구조 시험",
            tag: "Sentence"
        },
        {
            name: "문법 시험 (주관식)",
            tag: "Grammar1"
        },
        {
            name: "문법 시험 (객관식)",
            tag: "Grammar2"
        },
        {
            name: "커스텀 과제",
            tag: "CustomReport"
        },
        {
            name: "강의 자료 공유",
            tag: "LectureMaterial"
        },
        {
            name: "과제 생성 하기",
            tag: "RegisterReport"
        }
    ];

    var style = null;

    return(
        <div className="ReportHeader">
        {headerButtonName.map((data, index) =>{
            if(reportMode === data.tag){
                style = {
                    color: "white"
                }
            }else{
                style = {
                    color: "#8C9BB1"
                }
            }
            return(<button className="ReportHeaderButton" style={style} key={index} value={data.tag} onClick={()=>{setReportMode(data.tag)}}>{data.name}</button>)
        })}
    </div>
    )
}

export default ReportHeader;