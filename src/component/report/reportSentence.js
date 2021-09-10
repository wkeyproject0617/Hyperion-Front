import React, { useCallback, useEffect, useRef, useState } from "react";
import ReportContentButton from "./reportContentButton";
import ReportContentHeader from "./reportContentHeader";
import ReportContentTemp from "./reportContentTemp";
import ReportFoot from "./reportFoot";
import UseModal from "../common/useModal";
import "./reportSentence.css";
import Api from "../../api/dataControllerApi";
import CheckToken from "../../api/checkToken";

function ReportSentence({reportReadyData}){
    var testWeek = reportReadyData.stage.length === 2 ? reportReadyData.stage : "0" + reportReadyData.stage;
    testWeek = "TIME" + testWeek;
    const title = `${reportReadyData.division} - ${reportReadyData.level} - ${reportReadyData.stage}주차`;
    const subTitle = `'${reportReadyData.subject}'의 '문장 구조 시험'을 준비합니다`;
    const [token, setToken] = useState(window.localStorage.getItem("accessToken"));
    const refreshToken = window.localStorage.getItem("refreshToken");
    const [modal_text, setModalText] = useState("");
    const [show_modal, setShowModal] = useState(false);

    const [test_time, setTestTime] = useState("");

    const [sentence_list, setSentenceList] = useState([
        {
            id:1,
            form:"FORM1",
            question:"",
            subject:[""],
            verb:[""],
            object:[""],
            objectiveComplement:[""],
            complement:[""],
            indirectObject:[""],
            directObject:[""],
            nounClause:[""],
            relative:[""],
            adverbClause:[""],
            coordinator:[""],
            modifier:[""],
            selected:false
        }
    ]);

    const nextId = useRef(1);

    const getSentence = useCallback(()=> {

        const header = {
            headers:{
                Authorization: `Bearer ${token}`
            }
        }

        Api.getData(`/api/sentenceTests?subjectId=${reportReadyData.id}&testWeek=${testWeek}`, header).then(res => {
            console.log(res);
            if(res.data.description === "조회성공" && res.data.data.assignment.length){
                var data = res.data.data.assignment.map(data => {
                    nextId.current += 1;
                    var subject = [data.subject1 ? data.subject1 : "", data.subject2, data.subject3];
                    subject = subject.filter(data => data !== null);
                    var verb = [data.verb1 ?data.verb1 : "", data.verb2, data.verb3];
                    verb = verb.filter(data => data !== null);
                    var object = [data.object1 ? data.object1 : "", data.object2, data.object3];
                    object = object.filter(data => data !== null);
                    var objectiveComplement = [data.objective_complement1 ? data.objective_complement1 : "", data.objective_complement2, data.objective_complement3];
                    objectiveComplement = objectiveComplement.filter(data => data !== null);
                    var complement = [data.complement1 ? data.complement1 : "", data.complement2, data.complement3];
                    complement = complement.filter(data => data !== null);
                    var indirectObject = [data.indirect_object1 ? data.indirect_object1 : "", data.indirect_object2, data.indirect_object3];
                    indirectObject = indirectObject.filter(data => data !== null);
                    var directObject = [data.direct_object1 ? data.indirect_object1 : "" , data.direct_object2, data.direct_object3];
                    directObject = directObject.filter(data => data !== null);
                    var nounClause = [data.noun_clause1 ? data.noun_clause1 : "", data.noun_clause2, data.noun_clause3];
                    nounClause = nounClause.filter(data => data !== null);
                    var relative = [data.relative1 ? data.relative1 : "" , data.relative2, data.relative3];
                    relative = relative.filter(data => data !== null);
                    var adverbClause = [data.adverb_clause1 ? data.adverb_clause1 : "" , data.adverb_clause2, data.adverb_clause3];
                    adverbClause = adverbClause.filter(data => data !== null);
                    var coordinator = [data.coordinator1 ? data.coordinator1 : "", data.coordinator2, data.coordinator3];
                    coordinator = coordinator.filter(data => data !== null);
                    var modifier = [data.modifier1 ? data.modifier1 : "", data.modifier2, data.modifier3, data.modifier4, data.modifier5, data.modifier6, data.modifier7];
                    modifier = modifier.filter(data => data !== null);
                    
                    return ({
                        id:nextId.current,
                        question:data.question,
                        form:data.form,
                        subject:subject,
                        verb:verb,
                        object:object,
                        objectiveComplement:objectiveComplement,
                        complement:complement,
                        indirectObject:indirectObject,
                        directObject:directObject,
                        nounClause:nounClause,
                        relative:relative,
                        adverbClause:adverbClause,
                        coordinator:coordinator,
                        modifier:modifier,
                        selected:false,
                        server_id:data.id
                    })
                })
                setSentenceList(data);
                setTestTime(res.data.data.timer);
            }
        }).catch(err => {
            console.log(err);
        })
    }, [token, reportReadyData.id, testWeek])

    useEffect(() => {
        getSentence();
    }, [getSentence, show_modal])

    
    const onAddButtonClick = () => {
        nextId.current += 1;

        setSentenceList([
            ...sentence_list,
            {
                id:nextId.current,
                form:"FORM1",
                question:"",
                subject:[""],
                verb:[""],
                object:[""],
                objectiveComplement:[""],
                complement:[""],
                indirectObject:[""],
                directObject:[""],
                nounClause:[""],
                relative:[""],
                adverbClause:[""],
                coordinator:[""],
                modifier:[""],
                selected:false
            }
        ])

    }

    const onDeleteButtonClick = () => {
        nextId.current += 1;
        var temp = sentence_list.filter(data => !data.selected);
        var selected_list = sentence_list.filter(data => data.selected);
        setSentenceList(temp);

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
        Api.postData("/api/sentenceTests/del", datas, header).then(res => {
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
        const header = {
            headers:{
                Authorization: `Bearer ${token}`
            }
        }

        var will_add_data = [];
        var modified_data = [];
        for(var i = 0; i < sentence_list.length; i++){
            var sentence = sentence_list[i];
            if(!sentence.server_id){
                will_add_data.push(
                    {
                        form:sentence.form,
                        question:sentence.question,
                        subject1:sentence.subject[0].length ? sentence.subject[0] : null,
                        subject2:sentence.subject.length > 1 ? sentence.subject[1] : null,
                        subject3:sentence.subject.length > 2 ? sentence.subject[2] : null,
                        verb1:sentence.verb[0].length ? sentence.verb[0] : null,
                        verb2:sentence.verb.length > 1 ? sentence.verb[1] : null,
                        verb3:sentence.verb.length > 2 ? sentence.verb[2] : null,
                        object1:sentence.object[0].length ? sentence.object[0] : null,
                        object2:sentence.object.length > 1 ? sentence.object[1] : null,
                        object3:sentence.object.length > 2 ? sentence.object[2] : null,
                        objective_complement1:sentence.objectiveComplement[0].length ? sentence.objectiveComplement[0] : null,
                        objective_complement2:sentence.objectiveComplement.length > 1 ? sentence.objectiveComplement[1] : null,
                        objective_Complement3:sentence.objectiveComplement.length > 2 ? sentence.objectiveComplement[2] : null,
                        complement1:sentence.complement[0].length ? sentence.complement[0] : null,
                        complement2:sentence.complement.length > 1 ? sentence.complement[1] : null,
                        complement3:sentence.complement.length > 2 ? sentence.complement[2] : null,
                        indirect_object1:sentence.indirectObject[0].length ? sentence.indirectObject[0] : null,
                        indirect_object2:sentence.indirectObject.length > 1 ? sentence.indirectObject[1] : null,
                        indirect_object3:sentence.indirectObject.length > 2 ? sentence.indirectObject[2] : null,
                        direct_object1:sentence.directObject[0].length ? sentence.directObject[0] : null,
                        direct_object2:sentence.directObject.length > 1 ? sentence.directObject[1] : null,
                        direct_object3:sentence.directObject.length > 2 ? sentence.directObject[2] : null,
                        noun_clause1:sentence.nounClause[0].length ? sentence.nounClause[0] : null,
                        noun_clause2:sentence.nounClause.length > 1 ? sentence.nounClause[1] : null,
                        noun_clause3:sentence.nounClause.length > 2 ? sentence.nounClause[2] : null,
                        relative1:sentence.relative[0].length ? sentence.relative[0] : null,
                        relative2:sentence.relative.length > 1 ? sentence.relative[1] : null,
                        relative3:sentence.relative.length > 2 ? sentence.relative[2] : null,
                        adverb_clause1:sentence.adverbClause[0].length ? sentence.adverbClause[0] : null,
                        adverb_clause2:sentence.adverbClause.length > 1 ? sentence.adverbClause[1] : null,
                        adverb_clause3:sentence.adverbClause.length > 2 ? sentence.adverbClause[2] : null,
                        coordinator1:sentence.coordinator[0].length ? sentence.coordinator[0] : null,
                        coordinator2:sentence.coordinator.length > 1 ? sentence.coordinator[1]: null,
                        coordinator3:sentence.coordinator.length > 2 ? sentence.coordinator[2]: null,
                        modifier1:sentence.modifier[0].length ? sentence.modifier[0] : null,
                        modifier2:sentence.modifier.length > 1 ? sentence.modifier[1] : null,
                        modifier3:sentence.modifier.length > 2 ? sentence.modifier[2] : null,
                        modifier4:sentence.modifier.length > 3 ? sentence.modifier[3] : null,
                        modifier5:sentence.modifier.length > 4 ? sentence.modifier[4] : null,
                        modifier6:sentence.modifier.length > 5 ? sentence.modifier[5] : null,
                        modifier7:sentence.modifier.length > 6 ? sentence.modifier[6] : null,
                    }
                
                )
            }else{
                modified_data.push(
                    {
                        id:sentence.server_id,
                        form:sentence.form,
                        question:sentence.question,
                        subject1:sentence.subject[0].length ? sentence.subject[0] : null,
                        subject2:sentence.subject.length > 1 ? sentence.subject[1] : null,
                        subject3:sentence.subject.length > 2 ? sentence.subject[2] : null,
                        verb1:sentence.verb[0].length ? sentence.verb[0] : null,
                        verb2:sentence.verb.length > 1 ? sentence.verb[1] : null,
                        verb3:sentence.verb.length > 2 ? sentence.verb[2] : null,
                        object1:sentence.object[0].length ? sentence.object[0] : null,
                        object2:sentence.object.length > 1 ? sentence.object[1] : null,
                        object3:sentence.object.length > 2 ? sentence.object[2] : null,
                        objective_complement1:sentence.objectiveComplement[0].length ? sentence.objectiveComplement[0] : null,
                        objective_complement2:sentence.objectiveComplement.length > 1 ? sentence.objectiveComplement[1] : null,
                        objective_Complement3:sentence.objectiveComplement.length > 2 ? sentence.objectiveComplement[2] : null,
                        complement1:sentence.complement[0].length ? sentence.complement[0] : null,
                        complement2:sentence.complement.length > 1 ? sentence.complement[1] : null,
                        complement3:sentence.complement.length > 2 ? sentence.complement[2] : null,
                        indirect_object1:sentence.indirectObject[0].length ? sentence.indirectObject[0] : null,
                        indirect_object2:sentence.indirectObject.length > 1 ? sentence.indirectObject[1] : null,
                        indirect_object3:sentence.indirectObject.length > 2 ? sentence.indirectObject[2] : null,
                        direct_object1:sentence.directObject[0].length ? sentence.directObject[0] : null,
                        direct_object2:sentence.directObject.length > 1 ? sentence.directObject[1] : null,
                        direct_object3:sentence.directObject.length > 2 ? sentence.directObject[2] : null,
                        noun_clause1:sentence.nounClause[0].length ? sentence.nounClause[0] : null,
                        noun_clause2:sentence.nounClause.length > 1 ? sentence.nounClause[1] : null,
                        noun_clause3:sentence.nounClause.length > 2 ? sentence.nounClause[2] : null,
                        relative1:sentence.relative[0].length ? sentence.relative[0] : null,
                        relative2:sentence.relative.length > 1 ? sentence.relative[1] : null,
                        relative3:sentence.relative.length > 2 ? sentence.relative[2] : null,
                        adverb_clause1:sentence.adverbClause[0].length ? sentence.adverbClause[0] : null,
                        adverb_clause2:sentence.adverbClause.length > 1 ? sentence.adverbClause[1] : null,
                        adverb_clause3:sentence.adverbClause.length > 2 ? sentence.adverbClause[2] : null,
                        coordinator1:sentence.coordinator[0].length ? sentence.coordinator[0] : null,
                        coordinator2:sentence.coordinator.length > 1 ? sentence.coordinator[1]: null,
                        coordinator3:sentence.coordinator.length > 2 ? sentence.coordinator[2]: null,
                        modifier1:sentence.modifier[0].length ? sentence.modifier[0] : null,
                        modifier2:sentence.modifier.length > 1 ? sentence.modifier[1] : null,
                        modifier3:sentence.modifier.length > 2 ? sentence.modifier[2] : null,
                        modifier4:sentence.modifier.length > 3 ? sentence.modifier[3] : null,
                        modifier5:sentence.modifier.length > 4 ? sentence.modifier[4] : null,
                        modifier6:sentence.modifier.length > 5 ? sentence.modifier[5] : null,
                        modifier7:sentence.modifier.length > 6 ? sentence.modifier[6] : null,
                    }
                )
            }
        }

        console.log(will_add_data);
        console.log(modified_data);

        const datas = {
           sentence_test_list:will_add_data,
           subject_id:reportReadyData.id,
           test_week:testWeek,
           timer:test_time,
           update_sentence_test_list:modified_data
        }
        console.log(datas);
        Api.postData("/api/sentenceTests", datas, header).then(res => {
            console.log(res);
            if(res.data.description === "저장성공"){
                setModalText("저장되었습니다");
                setShowModal(true);
            }else if(res.data.description === "유효성검사에러"){
                setModalText("타이머를 지정해 주세요");
                setShowModal(true);
            }
            else{
                CheckToken(refreshToken, token, setToken, res);
            }
        });
    }

    console.log(sentence_list);

    return(
        <div className="ReportBody">
            { show_modal ? <UseModal title={modal_text} setShowModal={setShowModal}/> : null}
            <ReportContentHeader title={title} subTitle={subTitle}/>
            <div className="ReportSentence__ContentWrap">
                <div className="ReportSentence__Content">
                    {sentence_list.map((sentence, index) => {
                        return <ReportSentenceContent key={sentence.id} sentence={sentence} sentenceList={sentence_list} setSentenceList={setSentenceList} index={index}/>;
                    })}
                    {sentence_list.length === 1 ? <ReportContentTemp/> : null}
                </div>
                <ReportContentButton onAddButtonClick={onAddButtonClick} onDeleteButtonClick={onDeleteButtonClick}/>
            </div>
            <ReportFoot onSaveButtonClick={onSaveButtonClick} testTime={test_time} setTestTime={setTestTime}/>
        </div>
    )
}

function ReportSentenceContent({sentence, sentenceList, setSentenceList, index}){
    
    const id = sentence.id;

    const onChange = (e) => {
        var {name, value} = e.target;
        if(name === "selected"){
            value = e.target.checked;
        }
        setSentenceList(sentenceList.map(sentence => {
            return sentence.id === id ? {...sentence, [name]:value} : sentence
        }))
    }

    return (
        <div className="ReportSentence__Table">
            <div className="ReportSentence__Thead">
                <span className="ReportSentence__NoLabel">No.</span>
                <span className="ReportSentence__InputLabel">문제</span>
                <span className="ReportSentence__SelectLabel">문장형식</span>
            </div>
            <div className="ReportSentence__Tbody">
                <span className="ReportSentence__No">{index + 1}</span>
                <div style={{width:"100%"}}>
                    <div className="ReportSentence__InputWrap">
                        <input className="ReportSentence__Input" name="question" value={sentence.question} onChange={onChange} autoComplete="off"/>
                        <select className="ReportSentence__Select" name="form" value={sentence.form} onChange={onChange}>
                            <option value="FORM1">1형식</option>
                            <option value="FORM2">2형식</option>
                            <option value="FORM3">3형식</option>
                            <option value="FORM4">4형식</option>
                            <option value="FORM5">5형식</option>
                        </select>
                    </div>
                    {sentence.subject.map((subject, index)=> {
                        return (
                            <ReportSentenceAnswer key={index} 
                                id={sentence.id} 
                                tag="주어" 
                                name="subject" 
                                dataIndex={index} 
                                value={subject} 
                                p_speech={sentence.subject} 
                                sentenceList={sentenceList} 
                                setSentenceList={setSentenceList}
                            />
                        )
                    })}
                    {sentence.verb.map((verb, index)=> {
                        return (
                            <ReportSentenceAnswer 
                                key={index} 
                                id={sentence.id} 
                                tag="동사" 
                                name="verb" 
                                dataIndex={index} 
                                value={verb} 
                                p_speech={sentence.verb} 
                                sentenceList={sentenceList} 
                                setSentenceList={setSentenceList}
                            />
                        )
                    })}
                    {sentence.object.map((object, index)=> {
                        return (
                            <ReportSentenceAnswer 
                                key={index} 
                                id={sentence.id} 
                                tag="목적어" 
                                name="object" 
                                dataIndex={index} 
                                value={object} 
                                p_speech={sentence.object} 
                                sentenceList={sentenceList} 
                                setSentenceList={setSentenceList}
                            />
                        )
                    })}
                    {sentence.indirectObject.map((indirectObject, index)=> {
                        return (
                            <ReportSentenceAnswer 
                                key={index} 
                                id={sentence.id}
                                tag="간접 목적어"
                                name="indirectObject" 
                                dataIndex={index} 
                                value={indirectObject}
                                p_speech={sentence.indirectObject} 
                                sentenceList={sentenceList} 
                                setSentenceList={setSentenceList}
                            
                            />
                        )
                    })}
                    {sentence.directObject.map((directObject, index)=> {
                        return (
                            <ReportSentenceAnswer 
                                key={index} 
                                id={sentence.id}
                                tag="직접 목적어"
                                name="directObject" 
                                dataIndex={index} 
                                value={directObject}
                                p_speech={sentence.directObject} 
                                sentenceList={sentenceList} 
                                setSentenceList={setSentenceList}
                            
                            />
                        )
                    })}
                    {sentence.complement.map((complement, index)=> {
                        return (
                            <ReportSentenceAnswer 
                                key={index} 
                                id={sentence.id}
                                tag="보어"
                                name="complement" 
                                dataIndex={index} 
                                value={complement} 
                                p_speech={sentence.complement} 
                                sentenceList={sentenceList} 
                                setSentenceList={setSentenceList}
                            
                            />
                        )
                    })}
                    {sentence.objectiveComplement.map((objectiveComplement, index)=> {
                        return (
                            <ReportSentenceAnswer 
                                key={index} 
                                id={sentence.id} 
                                tag="목적격 보어" 
                                name="objectiveComplement"
                                dataIndex={index} 
                                value={objectiveComplement} 
                                p_speech={sentence.objectiveComplement} 
                                sentenceList={sentenceList} 
                                setSentenceList={setSentenceList}
                            />
                        )
                    })}
                    {sentence.relative.map((relative, index)=> {
                        return (
                            <ReportSentenceAnswer 
                                key={index} 
                                id={sentence.id}
                                tag="관계사"
                                name="relative" 
                                dataIndex={index} 
                                value={relative}
                                p_speech={sentence.relative} 
                                sentenceList={sentenceList} 
                                setSentenceList={setSentenceList}
                            
                            />
                        )
                    })}
                    {sentence.nounClause.map((nounClause, index)=> {
                        return (
                            <ReportSentenceAnswer 
                                key={index} 
                                id={sentence.id}
                                tag="명사절 접속사"
                                name="nounClause" 
                                dataIndex={index} 
                                value={nounClause}
                                p_speech={sentence.nounClause} 
                                sentenceList={sentenceList} 
                                setSentenceList={setSentenceList}
                            
                            />
                        )
                    })}
                    {sentence.adverbClause.map((adverbClause, index)=> {
                        return (
                            <ReportSentenceAnswer 
                                key={index} 
                                id={sentence.id}
                                tag="부사절 접속사"
                                name="adverbClause" 
                                dataIndex={index} 
                                value={adverbClause}
                                p_speech={sentence.adverbClause} 
                                sentenceList={sentenceList} 
                                setSentenceList={setSentenceList}
                            
                            />
                        )
                    })}
                    {sentence.coordinator.map((coordinator, index)=> {
                        return (
                            <ReportSentenceAnswer 
                                key={index} 
                                id={sentence.id}
                                tag="등위 접속사"
                                name="coordinator" 
                                dataIndex={index} 
                                value={coordinator}
                                p_speech={sentence.coordinator} 
                                sentenceList={sentenceList} 
                                setSentenceList={setSentenceList}
                            
                            />
                        )
                    })}
                    {sentence.modifier.map((modifier, index)=> {
                        return (
                            <ReportSentenceAnswer 
                                key={index} 
                                id={sentence.id}
                                tag="수식어구"
                                name="modifier"
                                dataIndex={index} 
                                value={modifier}
                                p_speech={sentence.modifier} 
                                sentenceList={sentenceList} 
                                setSentenceList={setSentenceList}
                            
                            />
                        )
                    })}
                </div>
                <div className="ReportSentence__CheckWrap">
                    <input type="checkbox" name="selected" onChange={onChange} defaultChecked={sentence.checked}/>
                </div>
            </div>
        </div>
    )
}

function ReportSentenceAnswer({tag, id, value, name, p_speech, setSentenceList, sentenceList, dataIndex}){
    const [modal_text, setModalText] = useState("");
    const [show_modal, setShowModal] = useState(false);

    const onChange = (e) => {
        var newSentence = null;
        newSentence = p_speech.map((data, index)=> {
            return index === dataIndex ? e.target.value : data;
        })
    

        setSentenceList(
            sentenceList.map(sentence => {
                return sentence.id === id ? {...sentence, [name]:newSentence} : sentence;
            })
        )
    }

    const columnAdd = () => {
        var newSentence = [];
        if(p_speech.length < 3){
            newSentence = p_speech.map(data => {
                return data;
            })
            newSentence.push("");
            setSentenceList(sentenceList.map(sentence => {
                return sentence.id === id ? {...sentence, [name]:newSentence} : sentence;
            }))
        }else if(p_speech.length < 7 && name==="modifier"){
            newSentence = p_speech.map(data => {
                return data;
            })
            newSentence.push("");
            setSentenceList(sentenceList.map(sentence => {
                return sentence.id === id ? {...sentence, [name]:newSentence} : sentence;
            }))
        }else if(p_speech.length >= 7 && name==="modifier"){
            setModalText(tag + "는 총7개 까지 추가 하실 수 있습니다");
            setShowModal(true);
        }else{
            setModalText(tag + "는 총3개 까지 추가 하실 수 있습니다");
            setShowModal(true);
        }
    }

    const columnDelete = () => {
        var newSentence = [];
        if(p_speech.length > 1){
            newSentence = p_speech.filter((data, index)=> index !== dataIndex);
            console.log(newSentence);
            setSentenceList(sentenceList.map(sentence => {
                return sentence.id === id ? {...sentence, [name]:newSentence} : sentence;
            }))
        }else{
            setModalText(tag + "는 더이상 삭제할 수 없습니다. 만약 입력할 데이터가 없으시면 공란으로 남겨 주십시오");
            setShowModal(true);
        }
    }

    return(
        <div className="ReportSentence__InputWrap">
            { show_modal ? <UseModal title={modal_text} setShowModal={setShowModal}/> : null}
            <span className="ReportSentence__AnswerLabel">{tag}</span>
            <input className="ReportSentence__Input" value={value} name={name} onChange={onChange} autoComplete="off"/>
            <button className="ReportSentence__DeleteRow" onClick={columnDelete}>－</button>
            <button className="ReportSentence__AddRow" onClick={columnAdd}>＋</button>
        </div>
    )
}

export default ReportSentence;