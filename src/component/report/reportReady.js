import { useCallback, useEffect, useState } from "react";
import CheckToken from "../../api/checkToken";
import Api from "../../api/dataControllerApi";
import UseModal from "../common/useModal";
import ReportManageTitle from "./reportManageTitle";

function PrepareReport({setReportMode, reportReadyData, setReportReadyData}){
    const [token, setToken] = useState(window.localStorage.getItem("accessToken"));
    const refreshToken = window.localStorage.getItem("refreshToken");
    const {division, subject, level, id} = reportReadyData;
    const [show_modal, setShowModal] = useState(false);
    const [division_list, setDivisionList] = useState([]);
    const [subject_list, setSubjectList] = useState([]);
    const [level_list, setLevelList] = useState([]);
    const [stage_list, setStageList] = useState([]);

    const getDivisionList = useCallback((header, token) => {
        Api.getData("/api/selectBox/subjectCategories", header).then(res =>{
            if(res.data.description === "조회성공"){
                setDivisionList(res.data.data);
            }else{
                CheckToken(refreshToken, token, setToken, res);
            }
        }).catch(err => {
            console.log(err);
        });
    }, [refreshToken]);

    const getSubjectList = useCallback((header, token) => {
        const url = "/api/selectBox/subjectTitles?category=" + division;
        Api.getData(url, header).then(res => {
            if(res.data.description === "조회성공"){
                setSubjectList(res.data.data);
            }else{
                CheckToken(refreshToken, token, setToken, res);
            }
        })
    }, [refreshToken, division]);

    const getLevelList = useCallback((header, token) => {
        const url = `/api/selectBox/subjectLevels?category=${division}&title=${subject}`
        Api.getData(url, header).then(res => {
            if(res.data.description === "조회성공"){
                setLevelList(res.data.data);
            }else{
                CheckToken(refreshToken, token, setToken, res);
            }
        })
    }, [refreshToken, division, subject]);

    const getStageList = useCallback((header, token) =>{
        const url = `/api/selectBox/subjectTotalWeeks/${id}`;
        Api.getData(url, header).then(res => {
            if(res.data.description === "조회성공"){
                setStageList(res.data.data);
            }else{
                CheckToken(refreshToken, token, setToken, res);
            }
        })
    }, [refreshToken, id]);

    useEffect(() => {
        const header = {
            headers:{
                Authorization: `Bearer ${token}`
            }
        }
        getDivisionList(header, token);
        if(division){
            getSubjectList(header, token);
        }
        if(division && subject){
            getLevelList(header, token);
        }
        if(id){
            getStageList(header, token);
        }
    }, [getDivisionList, getSubjectList, getLevelList, getStageList, token, division, subject, id])

    const onChange = (e) => {
        const {name, value} = e.target;
        setReportReadyData({
            ...reportReadyData,
            [name]:value
        })
    }

    const setId = useCallback(() => {
        if(level){
            var subject_id = null;
            for(var i = 0; i < level_list.length; i++){
                if(level_list[i].subject_level === level){
                    subject_id = level_list[i].subject_id;
                }
            }
            setReportReadyData(inputs => ({
                ...inputs,
                "id":subject_id
            }))
        }
    }, [level, level_list, setReportReadyData]);

    useEffect(()=>{
        setId();
    }, [setId, level])

    const divisionList = division_list.map((division, index) => {
        return <option key={index} value={division}>{division}</option>
    })

    const subjectList = subject_list.map((subject, index) => {
        return <option key={index} value={subject}>{subject}</option>
    })

    const levelList = level_list.map((level, index) =>{
        return <option key={index} value={level.subject_level}>{level.subject_level}</option>
    })

    const stageList = stage_list.map((stage, index) => {
        return <option key={index} value={stage}>{stage}</option>
    })


    const reportReadyComplete = () => {
        if(division && subject && level && id){
            setReportMode("Voca")
        }else{
            setShowModal(true);
        }
    }
    
    const title = "과제 준비";
    const subTitle = "강사가 직접 설계하는 나만의 과제를 준비합니다";
    return(
        <div className="ReportReady">
            {show_modal ? <UseModal title={"데이터를 정확히 입력해 주세요"} setShowModal={setShowModal}/> : null}
            <div className="PrepareReport">
                <ReportManageTitle title={title} subTitle={subTitle} />
                <div className="PrepareReport__InputWrap">
                    <div className="PrepareReport__DivisionWrap">
                        <span className="ReportManage__InputLabel">과목 구분</span>
                        <select className="ReportManage__Input" defaultValue="과목 구분" name={"division"} onChange={onChange}>
                           <option disabled value={"과목 구분"}>과목 구분</option>
                           {divisionList}
                        </select>
                        <span className="ReportManage__InputSubLabel">과목 구분을 선택해 주세요</span>
                    </div>
                    <div className="PrepareReport__SubjectWrap">
                        <span className="ReportManage__InputLabel">과목명</span>
                        <input className="ReportManage__Input" autoComplete="off" name={"subject"} value={subject} placeholder="과목명" onChange={onChange} list="subjectList" disabled={division ? false : true}/>
                        <datalist id="subjectList">
                            {subjectList}
                        </datalist>
                        <span className="ReportManage__InputSubLabel">과목 구분을 먼저 선택해 주세요</span>
                    </div>
                    <div className="PrepareReport__LevelWrap">
                        <span className="ReportManage__InputLabel">과목 레벨</span>
                        <input className="ReportManage__Input" autoComplete="off" placeholder="과목 레벨" name="level" value={level} list="levelList" onChange={onChange}/>
                            <datalist id="levelList">
                                {levelList}
                            </datalist>
                        <span className="ReportManage__InputSubLabel">과목 레벨을 선택해 주세요</span>
                    </div>
                    <div className="PrepareReport__RoundWrap">
                        <span className="ReportManage__InputLabel">과목 회차</span>
                        <select className="ReportManage__Input" defaultValue="과목 회차" name="stage" onChange={onChange}>
                            <option disabled>과목 회차</option>
                            {stageList}
                        </select>
                        <span className="ReportManage__InputSubLabel">과목 회차를 선택해 주세요</span>
                    </div>
                    <div className="PrepareReport__ButtonWrap">
                        <button className="PrepareReport__Button" onClick={reportReadyComplete}>준비하기</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PrepareReport;