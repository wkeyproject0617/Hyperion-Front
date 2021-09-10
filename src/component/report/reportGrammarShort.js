import React, { useCallback, useEffect, useRef, useState } from "react";
import CheckToken from "../../api/checkToken";
import Api from "../../api/dataControllerApi";
import UseModal from "../common/useModal";
import ReportContentButton from "./reportContentButton";
import ReportContentHeader from "./reportContentHeader";
import ReportFoot from "./reportFoot";
import "./reportGrammarShort.css";

function ReportGrammarShort({reportReadyData}){
    var testWeek = reportReadyData.stage.length === 2 ? reportReadyData.stage : "0" + reportReadyData.stage;
    testWeek = "TIME" + testWeek;
    const title = `${reportReadyData.division} - ${reportReadyData.level} - ${reportReadyData.stage}주차`;
    const subTitle = `'${reportReadyData.subject}'의 '문법 시험(주관식)'을 준비합니다`;
    const [token, setToken] = useState(window.localStorage.getItem("accessToken"));
    const refreshToken = window.localStorage.getItem("refreshToken");
    const [test_time, setTestTime] = useState("");
    const [modal_text, setModalText] = useState("");
    const [show_modal, setShowModal] = useState(false);
    const [grammar_list_from_server, setGrammarListFromServer] = useState([]);
    const [grammar_short_list, setGrammarShortList] = useState([{
        id:1,
        question:"",
        answer:"",
        selected:false
    }])

    const nextId = useRef(1);

    const getGrammarListFromServer = useCallback(() => {
        const header = {
            headers:{
                Authorization: `Bearer ${token}`
            }
        }
        Api.getData(`/api/grammarShortAnswerTests?subjectId=${reportReadyData.id}&testWeek=${testWeek}`, header).then(res => {
            if(res.data.description === "조회성공"){
                if(res.data.data.assignment.length !== 0){
                    const data = res.data.data.assignment.map((data => {
                        nextId.current += 1;
                        return {id:nextId.current, question:data.question, answer:data.answer, selected:false, server_id:data.id}
                    }))
                    setGrammarShortList(data);
                    setGrammarListFromServer(data);
                    setTestTime(res.data.data.timer);
                }
            }else{
                CheckToken(refreshToken, token, setToken, res);
            }
        }).catch(err => {
            console.log(err);
        })
    }, [token, refreshToken, reportReadyData.id, testWeek])

    useEffect(() => {
        getGrammarListFromServer();
    }, [getGrammarListFromServer, show_modal])


    const onSaveButtonClick = () => {
        var will_add_data = [];
        var modified_data = [];

        for(var i = 0; i < grammar_short_list.length; i++){
            if(!grammar_short_list[i].server_id){
                will_add_data.push({answer:grammar_short_list[i].answer, question:grammar_short_list[i].question});
            }
        }

        if(grammar_short_list.length){
            for(var k = 0; k < grammar_list_from_server.length; k++){
                if((grammar_short_list[k].answer !== grammar_list_from_server[k].answer) || (grammar_short_list[k].question !== grammar_list_from_server[k].question)){
                    modified_data.push({id:grammar_short_list[k].server_id, answer:grammar_short_list[k].answer, question:grammar_short_list[k].question});
                }
            }
        }

        const datas = {
            grammar_short_list:will_add_data,
            subject_id:reportReadyData.id,
            test_week:testWeek,
            timer:test_time,
            update_grammar_short_list:modified_data
        }

        const header = {
            headers:{
                Authorization: `Bearer ${token}`
            }
        }
        Api.postData("/api/grammarShortAnswerTests", datas, header).then(res => {
            if(res.data.description === "유효성검사에러"){
                setModalText("타이머를 지정해 주세요");
                setShowModal(true);
            }
            else if(res.data.description === "저장성공"){
                setModalText("저장되었습니다");
                setShowModal(true);
            }else{
                CheckToken(refreshToken, token, setToken, res);
            }
        }).catch(res => {
            console.log(res);
        })
    }

    const onAddButtonClick = () => {
        nextId.current += 1;
        setGrammarShortList([
            ...grammar_short_list,
            {
                id:nextId.current,
                question:"",
                answer:"",
                selected:false
            }
        ])
    }

    const onDeleteButtonClick = () => {
        var temp = grammar_short_list.filter(grammarShort => !grammarShort.selected);
        var selected_list = grammar_short_list.filter(grammarShort => grammarShort.selected);

        setGrammarShortList([
            ...temp
        ])

        const header = {
            headers:{
                Authorization: `Bearer ${token}`
            }
        }

        const selected_id = selected_list.map(selected => {
            return selected.server_id;
        });

        const datas = selected_id;

        Api.postData("/api/grammarShortAnswerTests/del", datas, header).then(res => {
            if(res.data.description === "삭제성공"){
                setModalText(`총 ${selected_id.length}개의 데이터가 삭제되었습니다`);
                setShowModal(true);
                setGrammarListFromServer([]);
            }else{
                CheckToken(refreshToken, token, setToken, res);
            }
        }).catch(err => {
            console.log(err);
        })
    }

    return(
        <div className="ReportBody">
            {show_modal ? <UseModal title={modal_text} setShowModal={setShowModal}/> : null}
            <ReportContentHeader title={title} subTitle={subTitle}/>
            <div className="ReportGrammarShort__ContentWrap">
                <div className="ReportGrammarShort__Content">
                    <ReportGrammarShortTable grammarShortList={grammar_short_list} setGrammarShortList={setGrammarShortList}/>
                </div>
                <ReportContentButton onDeleteButtonClick={onDeleteButtonClick} onAddButtonClick={onAddButtonClick}/>
            </div>
            <ReportFoot testTime={test_time} setTestTime={setTestTime} onSaveButtonClick={onSaveButtonClick}/>
        </div>
    )
}


function ReportGrammarShortTable({grammarShortList, setGrammarShortList}){

    const onChange = (id, e) => {
        var {name, value} = e.target;
        if(name === "selected"){
            value = e.target.checked;
        }
        setGrammarShortList(grammarShortList.map(grammarShort => {
            return grammarShort.id === id ? {...grammarShort, [name]:value} : grammarShort;
        }))
    }

    const grammarShortTableBody = grammarShortList.map((grammarShort, index) => {
        return(
            <tr key={grammarShort.id}>
                <td id="ReportGrammarShort__TableStyle" className="ReportGrammarShort__No">{index + 1}</td>
                <td id="ReportGrammarShort__TableStyle"><textarea className="ReportGrammarShort__Input" placeholder="문장을 입력해 주세요" name="question" onChange={onChange.bind(this, grammarShort.id)} value={grammarShort.question}/></td>
                <td id="ReportGrammarShort__TableStyle"><textarea className="ReportGrammarShort__Input" placeholder="정답을 입력해 주세요" name="answer" onChange={onChange.bind(this, grammarShort.id)} value={grammarShort.answer}/></td>
                <td className="ReportGrammarShort__SelectLabel"><input type="checkbox" name="selected" onChange={onChange.bind(this, grammarShort.id)} defaultChecked={grammarShort.selected}/></td>
            </tr>
        )
    })

    return(
        <table className="ReportGrammarShort__Table">
            <thead>
                <tr className="ReportGrammarShort__Thead">
                    <td className="ReportGrammarShort__NoLabel">No.</td>
                    <td className="ReportGrammarShort__InputLabel" >문제</td>
                    <td className="ReportGrammarShort__InputLabel">정답</td>
                    <td className="ReportGrammarShort__SelectLabel"><input type="checkbox"/></td>
                </tr>
            </thead>
            <tbody>
                {grammarShortTableBody}
            </tbody>
        </table>
    )
}

export default ReportGrammarShort;