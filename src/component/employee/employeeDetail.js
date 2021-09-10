import React, {useState, useEffect, useCallback} from "react";
import CheckToken from "../../api/checkToken";
import Api from "../../api/dataControllerApi";
import ConfirmModal from "../common/confirmModal";
import "./employeeDetail.css";
import GetEmployeeData from "./getEmployeeData";

function EmployeeDetail({userId}){
    const [token, setToken] = useState(window.localStorage.getItem("accessToken"));
    const refreshToken = window.localStorage.getItem("refreshToken");

    const [modal_title, setModalTitle] = useState("");
    const [modal_content, setModalContent] = useState("");
    const [show_modal, setShowModal] = useState(false);

    const [inputs, setInputs] = useState({
        division:"",
        subject_name:"",
        subject_level:"",
        selected_subject_id:""
    })
    
    const [divison_list, setDivisonList] = useState([]);
    const [subject_name_list, setSubjectNameList] = useState([]);
    const [subject_level_list, setSubjectLevelList] = useState([]);
    const [subject_list, setSubjectList] = useState([]);
    const [student_list, setStudentList] = useState([])

    const onChange = (e) => {
        const {name, value} = e.target;

        setInputs({
            ...inputs,
            [name]:value
        })
    }

    const getSubjectDivison = useCallback(() => {
        const header = {
            headers:{
                Authorization: `Bearer ${token}`
            }
        }
        Api.getData('/api/selectBox/subjectCategories', header).then(res => {
            if(res.data.description === "조회성공"){
                setDivisonList(res.data.data);
            }else{
                CheckToken(refreshToken, token, setToken, res);
            }
        })
    }, [token, refreshToken])

    const getSubjectName = useCallback(() => {
        const header = {
            headers:{
                Authorization: `Bearer ${token}`
            }
        }
        if(inputs.division){
            Api.getData(`/api/selectBox/subjectTitles?category=${inputs.division}`, header).then(res => {
                console.log(res);
                if(res.data.description === "조회성공"){
                    setSubjectNameList(res.data.data);
                }else{
                    CheckToken(refreshToken, token, setToken, res);
                }
            })   
        }
    }, [token, refreshToken, inputs.division])

    const getSubjectLevel = useCallback(()=> {
        const header = {
            headers:{
                Authorization: `Bearer ${token}`
            }
        }
        if(inputs.division && inputs.subject_name){
            const url = `/api/selectBox/subjectLevels?category=${inputs.division}&title=${inputs.subject_name}`;
            Api.getData(url, header).then(res => {
                console.log(res);
                if(res.data.description === "조회성공"){
                    setSubjectLevelList(res.data.data);
                }else{
                    CheckToken(refreshToken, token, setToken, res);
                }
            }).catch(err => {
                console.log(err);
            })
        }
    }, [token, refreshToken, inputs.division, inputs.subject_name])

    const getStudentList = useCallback(() => {
        const header = {
            headers:{
                Authorization: `Bearer ${token}`
            }
        }
        if(inputs.selected_subject_id){
            const url = `/adminApi/employees/student/${inputs.selected_subject_id}`;
            Api.getData(url, header).then(res => {
                console.log(res);
                if(res.data.description === "조회성공"){
                    setStudentList(res.data.data);
                }else{
                    CheckToken(refreshToken, token, setToken, res);
                }
            }).catch(err => {
                console.log(err);
            })
        }
    }, [token, refreshToken, inputs.selected_subject_id])


    useEffect(() => {
        getSubjectDivison();
        getSubjectName();
        getSubjectLevel();
        GetEmployeeData.getEmployeeDetail(token, setToken, refreshToken, "GetSubject", setSubjectList, userId);
        getStudentList();
    }, [getSubjectDivison, getSubjectName, getSubjectLevel, getStudentList, token, refreshToken, userId, show_modal])

    const onRegisterSubject = () => {
        const header = {
            headers:{
                Authorization: `Bearer ${token}`
            }
        }
        
        var subject_id = 0;
        for(var i = 0; i < subject_level_list.length; i++){
            if(subject_level_list[i].subject_level === inputs.subject_level){
                subject_id = subject_level_list[i].subject_id;
            }
        }

        const url = `/adminApi/employees/subject?subject_id=${subject_id}&user_id=${userId}`;
        Api.getData(url, header).then(res => {
            if(res.data.description === "지정성공"){
                setModalTitle("과목 배정")
                setModalContent("과목배정에 성공했습니다");
                setShowModal(true);
            }else if(res.data.description === "데이터중복"){
                setModalTitle("과목 배정")
                setModalContent("이미 선택된 강사에게 배정된 강의 입니다");
                setShowModal(true);
            }
        }).catch(err => {
            console.log(err);
        })
    }

    const subjectList = subject_list.map(data => {
       return <option key={data.subject_id} value={data.subject_id}>{data.subject_category + " / " + data.subject_level + " / " + data.subject_title}</option>
    })

    const divisionList = divison_list.map((data, index) => {
        return <option key={index} value={data}>{data}</option>
    })

    const subjectNameList = subject_name_list.map((data, index) => {
        return <option key={index} value={data}>{data}</option>
    })

    const subjectLevelList = subject_level_list.map(data => {
        return <option key={data.subject_id} value={data.subject_level}>{data.subject_level}</option>
    })

    const studentList = student_list.map((data, index) => {
        return <option key={index} >{data.student_name + "(" + data.student_account + ")"}</option>
    })

    const modalCallback = () => {
        setShowModal(false);
    }

    return(
        <div className="EmployeeDetail">
            { show_modal ? <ConfirmModal title={modal_title} content={modal_content} callback={modalCallback} /> : null }
            <div className="EmployeeDetail__SubjectDivisionWrap">
                <span className="EmployeeCRUD__Label">과목 구분</span>
                <select className="EmployeeCRUD__Input" name="division" value={inputs.division} onChange={onChange}>
                    <option value="" disabled defaultValue hidden>과목 구분</option>
                    {divisionList}
                </select>
            </div>
            <div className="EmployeeDetail__SubjectNameWrap">
                <span className="EmployeeCRUD__Label">과목명</span>
                <select className="EmployeeCRUD__Input" name="subject_name" value={inputs.subject_name} onChange={onChange}>
                    <option value="" disabled defaultValue hidden>과목명</option>
                    {subjectNameList}
                </select>
            </div>
            <div className="EmployeeDetail__SubjectLevelWrap">
                <span className="EmployeeCRUD__Label">과목 레벨</span>
                <select className="EmployeeCRUD__Input" name="subject_level" value={inputs.subject_level} onChange={onChange}>
                    <option value="" disabled defaultValue hidden>과목 레벨</option>
                    {subjectLevelList}
                </select>
            </div>
            <div className="EmployeeDetail__ButtonWrap">
                <button className="EmployeeDetail__ButtonRegisterSubject" onClick={onRegisterSubject}>과목 배정</button>
            </div>
             <div className="EmployeeDetail__InputSubjectListWrap">
                <span className="EmployeeCRUD__Label">과목 리스트</span>
                <select className="EmployeeCRUD__Input" placeholder="수강 학생" name="selected_subject_id" value={inputs.selected_subject_id} onChange={onChange}>
                    <option value="" disabled defaultValue hidden>과목 리스트</option>
                    {subjectList}
                </select>
            </div>
            <div className="EmployeeDetail__InputStudentWrap">
                <span className="EmployeeCRUD__Label">수강 학생</span>
                <select className="EmployeeCRUD__Input" placeholder="수강 학생">
                    {studentList}
                </select>
            </div>
        </div>
    )
}

export default EmployeeDetail;