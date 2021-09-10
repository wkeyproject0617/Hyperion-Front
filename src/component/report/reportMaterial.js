import React, { useRef, useState } from "react";
import ReportContentHeader from "./reportContentHeader";
import "./reportMaterial.css";

function ReportMaterial({reportReadyData}){
    const title = `${reportReadyData.division} - ${reportReadyData.level} - ${reportReadyData.stage}주차`;
    const subTitle = `'${reportReadyData.subject}'의 '강의 자료 공유'를 준비합니다`;
    const [file_list, setFileList] = useState([]);
    
    const nextId = useRef(1);

    const onAddButtonClick = (e) => {
        const {value} = e.target;
        const fileName = (value.split("\\"));
        setFileList([
            ...file_list,
            {
                id:nextId.current,
                fileName:fileName[fileName.length - 1],
                filePath:value,
                selected:false
            }
        ])
        nextId.current += 1;
    }

    const onDeleteButtonClick = () => {
        var temp = file_list.filter(file => !file.selected);
        setFileList([
            ...temp
        ])
    }

    const materialContent = file_list.map(file => {
        return <ReportMaterialContent key={file.id} id={file.id} fileName={file.fileName} fileList={file_list} setFileList={setFileList} selected={file.selected}/>
    }) 

    return(
        <div className="ReportBody">
            <ReportContentHeader title={title} subTitle={subTitle}/>
            <div className="ReportMaterial__ContentWrap">
                {file_list.length === 0 ? <ReportMaterialTemp /> : materialContent}
                <div className="ReportMaterial__ContentButton">
                    <button className="ReportMaterial__ButtonDelete" onClick={onDeleteButtonClick}>삭제하기</button>
                    <label className="ReportMaterial__ButtonAdd" htmlFor="ReportMaterial__File" >추가하기</label>
                    <input type="file" id="ReportMaterial__File" onInput={onAddButtonClick} ></input>
                </div>
            </div>
            <div className="ReportMaterial__Foot">
                <div>
                    <span className="ReportMaterial__InputTimeLabel">시험 시간 설정</span>
                    <input className="ReportMaterial__InputTime" placeholder="00:00"/>
                </div>
                <button className="ReportMaterial__ButtonAdd" >저장하기</button>
            </div>
        </div>
    )
}

function ReportMaterialTemp(){
    return(
        <div className="ReportMaterial__Temp">
            <span className="ReportMaterial__TempSpan">강의 자료를 추가해 주세요</span>
        </div>
    )
}

function ReportMaterialContent({id, fileName, fileList, setFileList, selected}){

    const onChange = (e) =>{
        setFileList(fileList.map(file => 
            file.id === id ? {
            ...file,
            "selected":e.target.checked
        } : file
        ))
    }

    return(
        <table className="ReportMaterial__Table">
            <tbody>
                <tr id="ReportMaterial__TableStyle">
                    <td id="ReportMaterial__TableStyle" className="ReportMaterial__FileName">{fileName}</td>
                    <td id="ReportMaterial__TableStyle" ><input type="checkbox" className="ReportMaterial__Input" onChange={onChange} defaultValue={selected}/></td>
                </tr>
            </tbody>
        </table>
    )
}


export default ReportMaterial;