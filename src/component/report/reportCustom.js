import React, { useRef, useState } from "react";
import ReportContentHeader from "./reportContentHeader";
import "./reportCustom.css";

function ReportCustom({reportReadyData}){
    // var testWeek = reportReadyData.stage.length === 2 ? reportReadyData.stage : "0" + reportReadyData.stage;
    // testWeek = "TIME" + testWeek;
    const title = `${reportReadyData.division} - ${reportReadyData.level} - ${reportReadyData.stage}주차`;
    const subTitle = `'${reportReadyData.subject}'의 커스텀 과제를 생성합니다`;
    const nextOMRId = useRef(1);
    const nextProblemId = useRef(1);
    const [custom_problem_list, setCustomProblemList] = useState([]);

    console.log(custom_problem_list);

    return(
        <div className="ReportBody">
            <ReportContentHeader title={title} subTitle={subTitle}/>
            <div className="ReportCustom__Header">
                <ReportCustomProblemHeader customProblemList={custom_problem_list} setCustomProblemList={setCustomProblemList} nextProblemId={nextProblemId}/>
                <ReportCustomOMRHeader />
            </div>
            {custom_problem_list.map(customProblem => {
                return(
                    <div className="ReportCustom__Content">
                        <ReportCustomProblemContent customProblem={customProblem}/>
                        <ReportCustomOMRContent customProblem={customProblem} customProblemList={custom_problem_list} setCustomProblemList={setCustomProblemList} nextOMRId={nextOMRId}/>
                    </div>
                )
            })}
            {!custom_problem_list.length ? <ReportCustomTemp />: null}
            
        </div>
    )
}

function ReportCustomTemp(){
    return(
        <div className="ReportCustom__Content">
            <div className="ReportCustomProblemContent">
                <div className="ReportCustom__Temp">과제 파일을 추가해 주세요</div>
            </div>
            <div className="ReportCustomOMRContent">
                <div className="ReportCustom__Temp">OMR을 추가해 주세요</div>
            </div>
        </div>
    )
}

function ReportCustomProblemContent({customProblem}){
    return(
        <div className="ReportCustomProblemContent">
            <img src={customProblem.problem} alt={customProblem.problem} width="100%"/>
            <div className="ReportCustomProblemContent__ButtonWrap">
                <button className="ReportCustomProblemContent__ButtonDelete">삭제하기</button>
                <div className="ReportCustomProblemContent__ContorlButtonWrap">
                    <button className="ReportCustomProblemContent__ControlButton">확대</button>
                    <button className="ReportCustomProblemContent__ControlButton">축소</button>
                    <button className="ReportCustomProblemContent__ControlButton" style={{marginLeft:"16px"}}>이전</button>
                    <button className="ReportCustomProblemContent__ControlButton">다음</button>
                </div>
            </div>
        </div>
    )
}

function ReportCustomOMRContent({customProblem, customProblemList, setCustomProblemList, nextOMRId}){
    const problem_id = customProblem.id;
    const onAddClick = (e) => {
        var newOMR = customProblem.omr;
        var mode = e.target.value;
        nextOMRId.current += 1;
        newOMR.push({
            id:nextOMRId.current,
            answer:"",
            mode:mode
        });
        console.log(newOMR);
        setCustomProblemList(customProblemList.map(customProblem => {
            return (customProblem.id === problem_id ? { ...customProblem, omr:newOMR} : customProblem)
        }))
    }
    
    const onChoiceClick = (answer, id, e) => {
        var newOMR = customProblem.omr.map(omr => {
            return (omr.id === id) ? { ...omr, answer:answer} : omr
        });
        setCustomProblemList(customProblemList.map(customProblem => {
            return (customProblem.id === problem_id ? { ...customProblem, omr:newOMR} : customProblem)
        }))
    }
    const inputStyle = {
        backgroundColor:"#9162FF",
        color:"white"
    }

    const omrContent = customProblem.omr.map((omr, index)=>{
        return (
            omr.mode === "choice" ? (<div key={omr.id} className="ReportCustom__InputChoiceWrap">
                <input type="checkbox"/>
                <span className="ReportCustom__ChoiceLabel">{index + 1}</span>
                <span className="ReportCustom__Choice" style={omr.answer === "1" ? inputStyle : null} onClick={onChoiceClick.bind(this, "1", omr.id)}>1</span>
                <span className="ReportCustom__Choice" style={omr.answer === "2" ? inputStyle : null} onClick={onChoiceClick.bind(this, "2", omr.id)}>2</span>
                <span className="ReportCustom__Choice" style={omr.answer === "3" ? inputStyle : null} onClick={onChoiceClick.bind(this, "3", omr.id)}>3</span>
                <span className="ReportCustom__Choice" style={omr.answer === "4" ? inputStyle : null} onClick={onChoiceClick.bind(this, "4", omr.id)}>4</span>
                <span className="ReportCustom__Choice" style={omr.answer === "5" ? inputStyle : null} onClick={onChoiceClick.bind(this, "5", omr.id)}>5</span>
            </div>) : (
                <div key={omr.id} className="ReportCustomOMRContent__InputShortWrap" style={{width:"100%"}}>
                    <input type="checkbox"/>
                    <span className="ReportCustomOMRContent__InputShortLabel">{index + 1}</span>
                    <input className="ReportCustomOMRContent__InputShort" style={{width:"90%", color: "#1B3965"}} />
            </div>)
        )
    })

    return(
        <div className="ReportCustomOMRContent">
            <div className="ReportCustomOMRContent__AnswerWrap">
               {omrContent}
            </div>
            <div className="ReportCustomOMRContent__ButtonWrap">
                <div className="ReportCustomOMRContent__AddButtonWrap">
                    <button className="ReportCustomOMRContent__AddButton" value="choice" onClick={onAddClick}>객관식 추가하기</button>
                    <button className="ReportCustomOMRContent__AddButton" value="short" onClick={onAddClick}>주관식 추가하기</button>
                </div>
                <div className="ReportCustomOMRContent__DeleteButtonWrap">
                    <button className="ReportCustomOMRContent__DeleteButton">삭제하기</button>
                </div>
            </div>
        </div>
    )
}

function ReportCustomProblemHeader({customProblemList, setCustomProblemList, nextProblemId}){

    const [title, setTitle] = useState("");
    const [file, setfile] = useState("");
    const onChange = (e) => {
        setTitle(e.target.value);
    }
    const onInput = (e) => {
        setfile(e.target.files[0]);
    }

    const onAddClick = (e) => {
        nextProblemId.current += 1;
        setCustomProblemList([
           ...customProblemList,
           {
                id:nextProblemId.current,
                problem_title:e.target.value,
                problem:file,
                omr:[]
           }
       ])
    }

    return(
        <div className="ReportCustom__ProblemHeader">
            <div className="ReportCustom__AddHeader">
                <span className="ReportCustom__AddTitle">개인 과제 첨부하기</span>
                <span className="ReportCustom__AddSubTitle">기존 강사가 갖고있는 과제물을 첨부하여 과제를 생성합니다.</span>
            </div>
            <div className="ReportCustom__AddProblemWrap">
                <div className="ReportCustom__AddProblemTitleWrap">
                    <span className="ReportCustom__InputLabel">과제 제목</span>
                    <input className="ReportCustom__Input" autoComplete="off" placeholder="과제 제목" value={title} onChange={onChange}/>
                    <span className="ReportCustom__InputSubLabel">과제 제목을 입력해 주세요</span>
                </div>
                <div className="ReportCustom__AddProblemFileWrap">
                    <span className="ReportCustom__InputLabel">과제 첨부하기</span>
                    <div style={{display:"flex", justifyContent:"space-between", flexWrap:"wrap"}}>
                        <div className="ReportCustom__InputFileWrap">
                            <span className="ReportCustom__FileLabel" >{file.name}</span>
                            <label className="ReportCustom__File"><input type="file" style={{display:"none"}} onInput={onInput}/>파일 첨부</label>
                        </div>
                        <button className="ReportCustom__AddReportButton" onClick={onAddClick}>과제 첨부하기</button>
                    </div>
                    <span className="ReportCustom__InputSubLabel">학생들에게 부여할 과제 파일을 첨부해 주세요</span>
                </div>
            </div>
        </div>
    )
}

function ReportCustomOMRHeader(){
    return(
        <div className="ReportCustom__OMRHeader">
            <div className="ReportCustom__AddHeader">
                <span className="ReportCustom__AddTitle">OMR 카드 첨부하기</span>
                <span className="ReportCustom__AddSubTitle">첨부한 문제에 관한 OMR카드를 첨부합니다</span>
            </div>
            <div className="ReportCustom__AddOMRWrap">
                <div className="ReportCustom__AddChoiceWrap">
                    <span className="ReportCustom__InputLabel">객관식 문제 답안 추가하기</span>
                    <div className="ReportCustom__InputChoiceWrap">
                        <span className="ReportCustom__ChoiceEx">EX)</span>
                        <span className="ReportCustom__ChoiceLabel">No.</span>
                        <span className="ReportCustom__Choice">1</span>
                        <span className="ReportCustom__Choice">2</span>
                        <span className="ReportCustom__Choice">3</span>
                        <span className="ReportCustom__Choice">4</span>
                        <span className="ReportCustom__Choice">5</span>
                    </div>
                    <span className="ReportCustom__InputSubLabel">객관식 문제에 대한 답안을 추가합니다</span>
                </div>
                <div className="ReportCustom__AddShortWrap">
                    <span className="ReportCustom__InputLabel">주관식 문제 답안 추가하기</span>
                    <div style={{display:"flex", justifyContent:"space-between", flexWrap:"wrap"}}>
                        <div className="ReportCustom__InputShortWrap">
                            <span className="ReportCustom__ChoiceEx">EX)</span>
                            <span className="ReportCustom__ChoiceLabel">No.</span>
                            <span className="ReportCustom__InputShort">답을 적어주세요</span>
                        </div>
                        {/* <button className="ReportCustom__AddReportButton">OMR 첨부하기</button> */}
                    </div>
                    <span className="ReportCustom__InputSubLabel">주관식 문제에 대한 답안을 추가합니다</span>
                </div>
            </div>
        </div>
    )
}


export default ReportCustom;