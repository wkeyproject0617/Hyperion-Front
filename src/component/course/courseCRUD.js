import React, { useCallback, useEffect, useState } from "react";
import CheckToken from "../../api/checkToken";
import Api from "../../api/dataControllerApi";
import "./courseCRUD.css";
import UseModal from "../common/useModal";
import DataCheckModal from "./dataCheckModal";


function CourseCRUD({setCourseMode}){
    const [token, setToken] = useState(window.localStorage.getItem("accessToken"));
    const refreshToken = window.localStorage.getItem("refreshToken");
    const date = [
        {date_name: "monday", date_kor: "월"},
        {date_name: "tuesday", date_kor: "화"},
        {date_name: "wednesday", date_kor: "수"},
        {date_name: "thursday", date_kor: "목"},
        {date_name: "friday", date_kor: "금"},
        {date_name: "saturday", date_kor: "토"},
        {date_name: "sunday", date_kor: "일"}
    ]
    const [student_list, setStudentList] = useState([]);
    const [teacher_list, setTeacherList] = useState([]);
    const [division_list, setDivisionList] = useState([]);
    const [subject_list, setSubjectList] = useState([]);
    const [level_list, setLevelList] = useState([]);
    const [show_modal, setShowModal] = useState(false);
    const [show_check_modal, setShowCheckModal] = useState(false);
    const [modal_text, setModalText] = useState("");
    const [data, setData] = useState();
    const [inputs, setInputs] = useState({
        teacher:"",
        student:"",
        division:"문법",
        subject:"",
        level:"",
        sunday:false,
        monday:false,
        tuesday:false,
        thursday:false,
        wednesday:false,
        firday:false,
        saturday:false,
        start_hour:"",
        start_min:"",
        end_hour:"",
        end_min:""
    });

    const onChange = (e) =>{
        const {name, value} = e.target;
        setInputs({
            ...inputs,
            [name]:value
        })
    }    

    const onCheck = e => {
        const {name} = e.target;
        setInputs({
            ...inputs,
            [name]:e.target.checked
        })
    }
    

    const getStudentList =  useCallback((header) => {
        Api.getData("/adminApi/studentSearch?name=", header).then(res => {
            if(res.data.description === "조회성공"){
                setStudentList(res.data.data)
            }else{
                CheckToken(refreshToken, token, setToken, res);
            }
        })
    },[refreshToken, token]);

    const getTeacherList =  useCallback((header) => {
        Api.getData("/adminApi/signUp/userSelectBox", header).then(res => {
            if(res.data.description === "조회성공"){
                setTeacherList(res.data.data);
            }else{
                CheckToken(refreshToken, token, setToken, res);
            }
        })
    },[refreshToken, token]);

    const getDivisionList =  useCallback((header) => {
        Api.getData("/api/selectBox/subjectCategories ", header).then(res => {
            if(res.data.description === "조회성공"){
               setDivisionList(res.data.data);
            }else{
                CheckToken(refreshToken, token, setToken, res);
            }
        })
    },[refreshToken, token]);

    const getLevelList = useCallback((header) => {
        const url = `/api/selectBox/subjectLevels?category=${inputs.division}&title=${inputs.subject}`;
        Api.getData(url, header).then(res => {
            if(res.data.description === "조회성공"){
                setLevelList(res.data.data);
            }else{
                CheckToken(refreshToken, token, setToken, res);
            }
        })
    },[refreshToken, token, inputs.subject, inputs.division])

    const getSubjectList =  useCallback((header) => {
        const url = `/api/selectBox/subjectTitles?category=${inputs.division.toString()}`;
        Api.getData(url, header).then(res => {
            if(res.data.description === "조회성공"){
                setSubjectList(res.data.data);
            }else{
                CheckToken(refreshToken, token, setToken, res);
            }
        })
    },[refreshToken, token, inputs.division]);


    useEffect(() => {
        const header = {
            headers:{
                Authorization: `Bearer ${token}`
            }
        }
        getStudentList(header);
        getTeacherList(header);
        getDivisionList(header);
        if(inputs.division){
            getSubjectList(header);
        }
        if(inputs.subject){
            getLevelList(header);
        }
    }, [getStudentList, getTeacherList, getDivisionList, getSubjectList, getLevelList, token, inputs.division, inputs.subject])

    var dateOption = date.map((date, index) =>{
        return(
            <div className="CourseCRUD__SelectCourseDate" key={index}>
                <label className="CourseCRUD__DateLabel" htmlFor="CourseCRUD__CheckDate">{date.date_kor}</label>
                <input type="checkbox" className="CourseCRUD__CheckDate" name={date.date_name} onClick={onCheck}/>
            </div>
        )
    })
    var studentList = student_list.map(student => {
        return(
            <option key={student.student_id} value={student.student_name+"-"+student.student_account}></option>
        )
    })
    var teacherList = teacher_list.map(teacher => {
        return(
            <option key={teacher.user_id} value={teacher.user_name + "-" + teacher.user_account}></option>
        )
    })
    var divisionList = division_list.map((division, index )=> {
        return(
            <option key={index} value={division}>{division}</option>
        )
    })
    var subjectList = subject_list.map((subject, index)=> {
        return(
            <option key={index} value={subject}></option>
        )
    })
    var levelList = level_list.map((level, index)=> {
        return(
            <option key={index} value={level.subject_level}></option>
        )
    })

    const postCourse = () => {
        const {student, teacher, subject, level, start_hour, end_hour, start_min, end_min} = inputs;
        var student_id = 0;
        var teacher_id = 0;
        var subject_id = 0;
        const student_account = student.split("-")[1];
        const teacher_account = teacher.split("-")[1];
        var _start_hour = start_hour.length !== 1 ? start_hour : "0" + start_hour;
        var _start_min = start_min.length !== 1 ? start_min : "0" + start_min;
        var _end_hour = end_hour.length !== 1 ? end_hour : "0" + end_hour;
        var _end_min = end_min.length !== 1 ? end_min : "0" + end_min;
        for(var i = 0; i < student_list.length; i++){
            if(student_list[i].student_account === student_account){
                student_id = student_list[i].student_id;
            }
        }
        for(var k = 0; k < teacher_list.length; k++){
            if(teacher_list[k].user_account === teacher_account){
                teacher_id = teacher_list[k].user_id;
            }
        }
        for(var j = 0; j < level_list.length; j++){
            if(level_list[j].subject_level === level){
                subject_id = level_list[j].subject_id;
            }
        }
        const data = {
            "end_time": _end_hour + ":" + _end_min,
            "friday": inputs.firday,
            "monday": inputs.monday,
            "saturday": inputs.saturday,
            "start_time": _start_hour + ":" + _start_min,
            "student_id": student_id,
            "subject_id": subject_id,
            "sunday": inputs.sunday,
            "thursday": inputs.thursday,
            "tuesday": inputs.tuesday,
            "user_id": teacher_id,
            "wednesday": inputs.wednesday
        }
        const header = {
            headers:{
                Authorization: `Bearer ${token}`
            }
        }
        if(student && teacher && subject && level && start_hour && end_hour && start_min && end_min){
            checkData(data, header, uploadData);
        }else{
            setModalText("데이터를 정확히 입력해 주세요");
            setShowModal(true);
        }
    }

    const uploadData = (data, header) => {
        Api.postData("/adminApi/lectures", data, header).then(res =>{
            console.log(res);
            if(res.data.description === "생성성공"){
                setModalText("등록 성공");
                setShowModal(true);
            }else{
                CheckToken(refreshToken, token, setToken, res);
            }
        })
    }
    
    const checkData = (data, header, callback) => {
        Api.postData("/adminApi/signUpChk", data, header).then(res =>{
            console.log(res);
            if(res.data.description === "중복"){
                setShowCheckModal(true);
                setData(data);
            }else if(res.data.description === "중복없음"){
                callback(data, header);
            }
            else{
                CheckToken(refreshToken, token, setToken, res);
            }
        })
    }

    return(
        <div className="CourseCRUD">
            { show_modal ? <UseModal title={modal_text} setShowModal={setShowModal}/> : null}
            { show_check_modal ? <DataCheckModal title={modal_text} setShowModal={setShowCheckModal} callback={uploadData} data={data} token={token}/> : null}
            <div className="CourseCRUD__Contents">
                <div className="CourseCRUD__TitleWrap">
                    <span className="CourseCRUD__Title">수강신청 카드</span>
                    <span className="CourseCRUD__SubTitle">수강을 새로 신청합니다</span>
                </div>
                <div className="CourseCRUD__InputWrap">
                    <div className="CourseCRUD__InputTeacherDivisionWrap">
                        <div className="CourseCRUD__InputTeacherWrap">
                            <span className="CourseCRUD__InputLabel">강사명</span>
                            <input className="CourseCRUD__Input" autoComplete="off" placeholder="강사명" name="teacher" onChange={onChange} value={inputs.teacher} list="teacherList"/>
                            <datalist id="teacherList">
                                {teacherList}
                            </datalist>
                            <span className="CourseCRUD__InputSubLabel">{inputs.teacher ? "" : "검색할 강사 이름을 입력해 주세요"}</span>
                        </div>
                        <div className="CourseCRUD__InputDivisionWrap">
                            <span className="CourseCRUD__InputLabel">과목 구분</span>
                            <select className="CourseCRUD__Input" placeholder="과목 구분" name="division" onChange={onChange} value={inputs.division}>
                                {divisionList}
                            </select>
                            <span className="CourseCRUD__InputSubLabel">{inputs.subject ? "" : "구분을 선택해 주세요"}</span>
                        </div>
                    </div>
                    <div className="CourseCRUD__InputSubjectWrap">
                        <span className="CourseCRUD__InputLabel">과목명</span>
                        { inputs.division ? <input className="CourseCRUD__Input" autoComplete="off" placeholder="과목명" name="subject" onChange={onChange} value={inputs.subject} list="subjectList"/> : "과목 구분을 먼저 선택해 주세요"}
                        <datalist id="subjectList">
                            {subjectList}
                        </datalist>
                        <span className="CourseCRUD__InputSubLabel">{inputs.subject ? "" : "검색할 과목명을 입력해 주세요"}</span>
                    </div>
                    <div className="CourseCRUD__InputLevelWrap">
                        <span className="CourseCRUD__InputLabel">과목 레벨</span>
                        <input className="CourseCRUD__Input" autoComplete="off" placeholder="레벨" name="level" onChange={onChange} value={inputs.level} list="levelList"/>
                        <datalist id="levelList">
                            {levelList}
                        </datalist>
                        <span className="CourseCRUD__InputSubLabel">{inputs.level ? "" : "과목레벨을 입력해 주세요"}</span>
                    </div>
                    <div className="CourseCRUD__InputStudentWrap">
                        <span className="CourseCRUD__InputLabel">학생명</span>
                        <input className="CourseCRUD__Input" autoComplete="off" placeholder="학생명" name="student" onChange={onChange} value={inputs.student} list="studentList"/>
                        <datalist id="studentList">
                            {studentList}
                        </datalist>
                        <span className="CourseCRUD__InputSubLabel">{inputs.student ? "" : "검색할 학생명을 입력해 주세요"}</span>
                    </div>
                    <div className="CourseCRUD__InputDateWrap">
                        <span className="CourseCRUD__InputLabel">수업 요일</span>
                        <div className="CourseCRUD__SelectCourseDateWrap">
                            {dateOption}
                        </div>
                        <span className="CourseCRUD__InputSubLabel">수업 요일을 선택해 주세요</span>
                    </div>
                    <div>
                        <span className="CourseCRUD__InputLabel">수업 시간</span>
                        <div className="CourseCRUD__InputTimeWrap">
                            <div className="CourseCRUD__InputStartTimeWrap">
                                <input className="CourseCRUD__InputTime" placeholder="시작 시" name="start_hour" onChange={onChange} value={inputs.start_hour} maxLength="2"/>
                                <span> : </span>
                                <input className="CourseCRUD__InputTime" placeholder="시작 분"  name="start_min" onChange={onChange} value={inputs.start_min} maxLength="2"/>
                                <span className="CourseCRUD__InputSubLabel">{inputs.start_hour && inputs.start_min ? "" : "시작 시간을 입력해 주세요"}</span>
                            </div>
                            <span className="CourseCRUD__TimeSeparator">~</span>
                            <div className="CourseCRUD__InputEndTimeWrap">
                                <input className="CourseCRUD__InputTime" placeholder="종료 시"  name="end_hour" onChange={onChange} value={inputs.end_hour} maxLength="2"/>
                                <span> : </span>
                                <input className="CourseCRUD__InputTime" placeholder="종료 분"  name="end_min" onChange={onChange} value={inputs.end_min} maxLength="2"/>
                                <span className="CourseCRUD__InputSubLabel">{inputs.end_hour && inputs.end_min ? "" : "종료 시간을 입력해 주세요"}</span>
                            </div>
                        </div>
                    </div>
                    <div className="CourseCRUD__ButtonWrap">
                        <button className="CourseCRUD__ButtonGoToList" onClick={()=>{setCourseMode("Course")}}>목록으로</button>
                        <button className="CourseCRUD__ButtonUpload" onClick={postCourse}>등록하기</button>
                    </div>
                </div>
            </div>
        </div>
    )
}



export default CourseCRUD;