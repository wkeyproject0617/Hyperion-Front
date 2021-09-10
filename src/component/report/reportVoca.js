import React, { useCallback, useEffect, useRef, useState } from "react";
import Api from "../../api/dataControllerApi";
import UseModal from "../common/useModal";
import ReportContentHeader from "./reportContentHeader";
import CheckToken from "../../api/checkToken";
import "./reportVoca.css";
import ReportFoot from "./reportFoot";
import ReportContentButton from "./reportContentButton";
import ReportContentTemp from "./reportContentTemp";

function ReportVoca({reportReadyData}){
    const title = `${reportReadyData.division} - ${reportReadyData.level} - ${reportReadyData.stage}주차`;
    const subTitle = `'${reportReadyData.subject}'의 '단어 시험'을 준비합니다`;
    const [token, setToken] = useState(window.localStorage.getItem("accessToken"));
    const refreshToken = window.localStorage.getItem("refreshToken");
    var testWeek = reportReadyData.stage.length === 2 ? reportReadyData.stage : "0" + reportReadyData.stage;
    testWeek = "TIME" + testWeek;
    const [test_time, setTestTime] = useState(""); 
    const [modal_text, setModalText] = useState("");
    const [show_modal, setShowModal] = useState(false);
    const [voca_list_from_server, setVocaListFromServer] = useState([]);
    const [voca_list, setVocaList] = useState([
        {
            id:1,
            eng:"",
            kor:"",
            selected:false
        }
    ]);

    const nextId = useRef(1);

    const getVocaListFromServer = useCallback((header, token) => {
        Api.getData(`/api/vocaTests?subjectId=${reportReadyData.id}&testWeek=${testWeek}`, header).then(res => {
            if(res.data.description === "조회성공"){
                if(res.data.data.assignment.length !== 0){
                    const data = res.data.data.assignment.map((data => {
                        nextId.current += 1;
                        return {id:nextId.current, eng:data.voca, kor:data.meaning, selected:false, server_id:data.id}
                    }))
                    setVocaList(data);
                    setVocaListFromServer(data);
                    setTestTime(res.data.data.timer);
                }
            }else{
                CheckToken(refreshToken, token, setToken, res);
            }
        }).catch(err => {
            console.log(err);
        })
    }, [refreshToken, reportReadyData.id, testWeek])

    useEffect(() => {
        const header = {
            headers:{
                Authorization: `Bearer ${token}`
            }
        }
        getVocaListFromServer(header, token);
    }, [getVocaListFromServer, token, show_modal])

    const onAddButtonClick = () => {
        nextId.current += 1;
        setVocaList([
            ...voca_list,
            {
                id:nextId.current,
                eng:"",
                kor:"",
                selected:false
            }
        ])
    }

    const onDeleteButtonClick = () => {
        var temp = voca_list.filter(voca => !voca.selected);
        var selected_list = voca_list.filter(voca => voca.selected);

        setVocaList([
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

        Api.postData("/api/vocaTests/del", datas, header).then(res => {
            if(res.data.description === "삭제성공"){
                setModalText(`총 ${selected_id.length}개의 데이터가 삭제되었습니다`);
                setShowModal(true);
            }else{
                CheckToken(refreshToken, token, setToken, res);
            }
        }).catch(err => {
            console.log(err);
        })
    }

    const onSaveButtonClick = () => {
        var voca_data = [];
        var modified_data = [];
        for(var i = 0; i < voca_list.length; i++){
            if(!voca_list[i].server_id){
                voca_data.push({meaning:voca_list[i].kor, voca:voca_list[i].eng});
            }
        }
        
        for(var k = 0; k < voca_list_from_server.length; k++){
            if((voca_list[k].kor !== voca_list_from_server[k].kor) || (voca_list[k].eng !== voca_list_from_server[k].eng)){
                modified_data.push({id:voca_list[k].server_id, meaning:voca_list[k].kor, voca:voca_list[k].eng});
            }
        }

        const datas = {
            subject_id:reportReadyData.id,
            test_week:testWeek,
            voca_list:voca_data,
            update_voca_list:modified_data,
            timer:test_time
        }

        const header = {
            headers:{
                Authorization: `Bearer ${token}`
            }
        }

        Api.postData("/api/vocaTests", datas, header).then(res => {
            if(res.data.description === "저장성공"){
                setModalText("저장되었습니다");
                setShowModal(true);
            }else{
                CheckToken(refreshToken, token, setToken, res);
            }
        }).catch(err =>{
            console.log(err);
        });
    }

    return(
        <div className="ReportBody">
            {show_modal ? <UseModal title={modal_text} setShowModal={setShowModal}/> : null}
            <ReportContentHeader title={title} subTitle={subTitle}/>
            <div className="ReportVoca__ContentWrap">
                <div className="ReportVoca__Content">
                    <ReportVocaContent vocaList={voca_list} setVocaList={setVocaList} mode={"even"}/>
                    {voca_list.length === 1 ? <ReportContentTemp/> : null }
                    {voca_list.length > 1 ? <ReportVocaContent vocaList={voca_list} setVocaList={setVocaList} mode={"odd"}/> : null}
                </div>
                <ReportContentButton onDeleteButtonClick={onDeleteButtonClick} onAddButtonClick={onAddButtonClick}/>
            </div>
            <ReportFoot testTime={test_time} setTestTime={setTestTime} onSaveButtonClick={onSaveButtonClick}/>
        </div>
    )
}

function ReportVocaContent({vocaList, setVocaList, mode}){
    const onChange = (id, e) =>{
        var {name, value} = e.target;
        if(name === "selected"){
            value = e.target.checked;
        }
        setVocaList(vocaList.map(voca => 
            voca.id === id ? {
            ...voca,
            [name]:value
        } : voca
        ))
    }

    const vocaTableBody = vocaList.map((voca, index)=> {
        if(mode === "odd"){
            if(index % 2 !== 0){
                return(
                    <tr id="vocaTable" key={voca.id}>
                        <td id="vocaTable" className="ReportVoca__TbodyNo">{index + 1}</td>
                        <td id="vocaTable"><input className="ReportVoca__InputVoca" placeholder="단어를 입력해 주세요" value={voca.eng} name="eng" onChange={onChange.bind(this, voca.id)} autoComplete="off"></input></td>
                        <td id="vocaTable"><input className="ReportVoca__InputVoca" placeholder="뜻을 입력해 주세요"  value={voca.kor} name="kor" onChange={onChange.bind(this, voca.id)} autoComplete="off"></input></td>
                        <td className="ReportVoca__Check"><input type="checkbox" name="selected" onChange={onChange.bind(this, voca.id)} defaultChecked={voca.selected}/></td>
                        
                    </tr>
                );
            }
        }else{
            if(index % 2 === 0){
                return(
                    <tr id="vocaTable" key={voca.id}>
                        <td id="vocaTable" className="ReportVoca__TbodyNo">{index + 1}</td>
                        <td id="vocaTable"><input className="ReportVoca__InputVoca" placeholder="단어를 입력해 주세요" value={voca.eng} name="eng" onChange={onChange.bind(this, voca.id)} autoComplete="off"></input></td>
                        <td id="vocaTable"><input className="ReportVoca__InputVoca" placeholder="뜻을 입력해 주세요"  value={voca.kor} name="kor" onChange={onChange.bind(this, voca.id)} autoComplete="off"></input></td>
                        <td className="ReportVoca__Check"><input  type="checkbox" name="selected" onChange={onChange.bind(this, voca.id)} defaultChecked={voca.selected}/></td>
                    </tr>
                );
            }
        }
        return null;
    })

    return(
        <table className="ReportVoca__Table">
            <thead>
                <tr id="vocaTable" className="ReportVcoa__Thead">
                    <td  id="vocaTable" className="ReportVoca__TheadNo">No.</td>
                    <td  id="vocaTable" className="ReportVoca__TheadEng">단어</td>
                    <td  id="vocaTable" className="ReportVoca__TheadKor">뜻</td>
                    <td className="ReportVoca__TheadCheckBox"><input type="checkbox"/></td>
                </tr>
            </thead>
            <tbody>
                {vocaTableBody}
            </tbody>
        </table>
    )
}


export default ReportVoca;