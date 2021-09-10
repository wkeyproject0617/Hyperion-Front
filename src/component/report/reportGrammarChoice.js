import React, { useCallback, useEffect, useRef, useState } from "react";
import "./reportGrammarChoice.css";

import ReportContentButton from "./reportContentButton";
import ReportContentHeader from "./reportContentHeader";
import ReportFoot from "./reportFoot";
import ReportContentTemp from "./reportContentTemp";
import Api from "../../api/dataControllerApi";
import CheckToken from "../../api/checkToken";
import UseModal from "../common/useModal";

function ReportGrammarChoice({reportReadyData}){
    var testWeek = reportReadyData.stage.length === 2 ? reportReadyData.stage : "0" + reportReadyData.stage;
    testWeek = "TIME" + testWeek;

    const title = `${reportReadyData.division} - ${reportReadyData.level} - ${reportReadyData.stage}주차`;
    const subTitle = `'${reportReadyData.subject}'의 '문법 시험(객관식)'을 준비합니다`;
    const [token, setToken] = useState(window.localStorage.getItem("accessToken"));
    const refreshToken = window.localStorage.getItem("refreshToken");
    const [test_time, setTestTime] = useState("");
    const [modal_text, setModalText] = useState("");
    const [show_modal, setShowModal] = useState(false);
    const [grammar_problem_list, setGrammarProblemList] = useState([
        {
            id:1,
            question:"",
            example1:"",
            example2:"",
            example3:"",
            example4:"",
            example5:"",
            answer:"",
            selected:false
        }
    ])

    const nextId = useRef(1);

    const getGrammarListFromServer = useCallback(() => {
        const header = {
            headers:{
                Authorization: `Bearer ${token}`
            }
        }
        Api.getData(`/api/grammarMultipleChoiceTests?subjectId=${reportReadyData.id}&testWeek=${testWeek}`, header).then(res => {
            if(res.data.description === "조회성공"){
                if(res.data.data.assignment.length !== 0){
                    const data = res.data.data.assignment.map((data => {
                        nextId.current += 1;
                        return ({
                            id:nextId.current, 
                            question:data.question, 
                            answer:data.answer.toString(), 
                            example1:data.example1,
                            example2:data.example2,
                            example3:data.example3,
                            example4:data.example4,
                            example5:data.example5,
                            selected:false, 
                            server_id:data.id
                        })
                    }))
                    setGrammarProblemList(data);
                    setTestTime(res.data.data.timer);
                }
            }else{
                CheckToken(refreshToken, token, setToken, res);
            }
        }).catch(err => {
            console.log(err);
        })
    }, [token, refreshToken, reportReadyData.id, testWeek])

    useEffect(()=>{
        getGrammarListFromServer();
    },[getGrammarListFromServer, show_modal])


    const onAddButtonClick = () => {
        nextId.current += 1;
        setGrammarProblemList([
            ...grammar_problem_list,
            {
                id:nextId.current,
                question:"",
                example1:"",
                example2:"",
                example3:"",
                example4:"",
                example5:"",
                answer:"",
                selected:false
            }
        ])
    }

    const onDeleteButtonClick = () => {
        var temp = grammar_problem_list.filter(grammarProblem => !grammarProblem.selected);
        var selected_list = grammar_problem_list.filter(grammarShort => grammarShort.selected);

        setGrammarProblemList([
            ...temp
        ])

        const header = {
            headers:{
                Authorization: `Bearer ${token}`
            }
        }

        var selected_id = []
        for(var i = 0; i < selected_list.length; i++){
            if(selected_list[i].server_id){
              selected_id.push(selected_list[i].server_id);
            }
        }

        const datas = selected_id;

        Api.postData("/api/grammarMultipleChoiceTests/del", datas, header).then(res => {
            if(res.data.description === "삭제성공"){
                setModalText(`총 ${selected_list.length}개의 데이터가 삭제되었습니다`);
                setShowModal(true);
            }else{
                CheckToken(refreshToken, token, setToken, res);
            }
        }).catch(err => {
            console.log(err);
        })
    }

    const onSaveButtonClick = () => {
        var will_add_data = [];
        var modified_data = [];
        
        for(var i = 0; i < grammar_problem_list.length; i++){
            if(!grammar_problem_list[i].server_id){
                will_add_data.push({
                    question:grammar_problem_list[i].question,
                    answer:grammar_problem_list[i].answer,
                    example1:grammar_problem_list[i].example1,
                    example2:grammar_problem_list[i].example2,
                    example3:grammar_problem_list[i].example3,
                    example4:grammar_problem_list[i].example4,
                    example5:grammar_problem_list[i].example5,
                })
            }
        }

        for(var k = 0; k < grammar_problem_list.length; k++){
            if(grammar_problem_list[k].server_id){
                modified_data.push({
                    id:grammar_problem_list[k].server_id,
                    question:grammar_problem_list[k].question,
                    answer:grammar_problem_list[k].answer,
                    example1:grammar_problem_list[k].example1,
                    example2:grammar_problem_list[k].example2,
                    example3:grammar_problem_list[k].example3,
                    example4:grammar_problem_list[k].example4,
                    example5:grammar_problem_list[k].example5,
                })
            }
        }

        const datas = {
            grammar_multiple_list:will_add_data,
            subject_id:reportReadyData.id,
            test_week:testWeek,
            timer:test_time,
            update_grammar_multiple_list:modified_data
        }

        const header = {
            headers:{
                Authorization: `Bearer ${token}`
            }
        }

        Api.postData("/api/grammarMultipleChoiceTests", datas, header).then(res => {

            if(res.data.description === "저장성공"){
                setModalText("저장성공");
                setShowModal(true);
            }else{
                CheckToken(refreshToken, token, setToken, res);
            }
        }).catch(res => {
            console.log(res);
        })
    }

    return (
        <div className="ReportBody">
            {show_modal ? <UseModal title={modal_text} setShowModal={setShowModal}/> : null}
            <ReportContentHeader title={title} subTitle={subTitle}/>
            <div className="ReportGrammarChoice__ContentWrap">
                <div className="ReportGrammarChoice__Content">
                    {grammar_problem_list.map((grammarProblem, index) => {
                        return <ReportGrammarChoiceTable key={grammarProblem.id} grammarProblemList={grammar_problem_list} grammarProblem={grammarProblem} setGrammarProblemList={setGrammarProblemList} index={index}/>
                    })}
                    {grammar_problem_list.length === 1 ? <ReportContentTemp /> : null}
                </div>
                <ReportContentButton onDeleteButtonClick={onDeleteButtonClick} onAddButtonClick={onAddButtonClick}/>
            </div>
            <ReportFoot onSaveButtonClick={onSaveButtonClick} testTime={test_time} setTestTime={setTestTime}/>
        </div>
    )

}

function ReportGrammarChoiceTable({grammarProblemList, grammarProblem, setGrammarProblemList, index}){

    const id = grammarProblem.id;
    const onChange = (e) => {
        var {name, value} = e.target;
        if(name === "selected"){
            value = e.target.checked;
        }
        setGrammarProblemList(grammarProblemList.map(grammarProblem => 
            grammarProblem.id === id? {
            ...grammarProblem,
            [name]:value
        } : grammarProblem
        ))
    }

    const setAnswer = (num) => {
        setGrammarProblemList(grammarProblemList.map(grammarProblem => 
            grammarProblem.id === id? {
            ...grammarProblem,
            "answer":num
        } : grammarProblem
        ))
    }

    const inputStyle = {
        backgroundColor:"#9162FF",
        color:"white"
    }

    return(
        <div className="ReportGrammarChoice__Table">
            <div className="ReportGrammarChoice__Thead">
                <span className="ReportGrammarChoice__NoLabel">No.</span>
                <span className="ReportGrammarChoice__InputLabel">문제</span>
            </div>
            <div className="ReportGrammarChoice__Tbody">
                <span className="ReportGrammarChoice__No">{index + 1}</span>
                <div>
                    <input className="ReportGrammarChoice__Input" name="question" value={grammarProblem.question} onChange={onChange} placeholder="문제를 입력해 주세요"/>
                    <span className="ReportGrammarChoice__AnswerLabel">정답</span>
                    <input className="ReportGrammarChoice__Input" style={grammarProblem.answer === "1" ? inputStyle : null} name="example1" value={grammarProblem.example1} onChange={onChange} placeholder="1" onClick={setAnswer.bind(this, "1")}/>
                    <input className="ReportGrammarChoice__Input" style={grammarProblem.answer === "2" ? inputStyle : null} name="example2" value={grammarProblem.example2} onChange={onChange} placeholder="2" onClick={setAnswer.bind(this, "2")}/>
                    <input className="ReportGrammarChoice__Input" style={grammarProblem.answer === "3" ? inputStyle : null} name="example3" value={grammarProblem.example3} onChange={onChange} placeholder="3" onClick={setAnswer.bind(this, "3")}/>
                    <input className="ReportGrammarChoice__Input" style={grammarProblem.answer === "4" ? inputStyle : null} name="example4" value={grammarProblem.example4} onChange={onChange} placeholder="4" onClick={setAnswer.bind(this, "4")}/>
                    <input className="ReportGrammarChoice__Input" style={grammarProblem.answer === "5" ? inputStyle : null} name="example5" value={grammarProblem.example5} onChange={onChange} placeholder="5" onClick={setAnswer.bind(this, "5")}/>
                </div>
                <div className="ReportGrammarChoice__CheckWrap">
                    <input type="checkbox" name="selected" defaultChecked={grammarProblem.selected} onChange={onChange}/>
                </div>
            </div>
        </div>
    )
}




export default ReportGrammarChoice;