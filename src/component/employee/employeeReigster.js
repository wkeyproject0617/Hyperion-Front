import React, {useEffect, useState } from "react";
import "./employeeRegister.css";
import GetEmployeeData from "./getEmployeeData";

function EmployeeRegister({mode, setMode, inputs, setInputs, userId}){
    const [token, setToken] = useState(window.localStorage.getItem("accessToken"));
    const refreshToken = window.localStorage.getItem("refreshToken");
    const [employee_list, setEmployeeList] = useState([]);

    useEffect(()=>{
        if(mode === "Register"){
            GetEmployeeData.getEmployeeList(token, setToken, refreshToken, setEmployeeList);
        }else{
            GetEmployeeData.getEmployeeDetail(token, setToken, refreshToken, mode, setInputs, userId);
        }
    }, [token, mode, refreshToken, setInputs, userId])

    const onChange = (e) => {
        const {name, value} = e.target;
        setInputs({
            ...inputs,
            [name]:value
        })
    }

    const onDateClick = (e) => {
        const {name, checked} = e.target;
        setInputs({
            ...inputs,
            [name]:checked
        })
    }

    const date = [
        {date_name: "monday", date_kor: "월"},
        {date_name: "tuesday", date_kor: "화"},
        {date_name: "wednesday", date_kor: "수"},
        {date_name: "thursday", date_kor: "목"},
        {date_name: "friday", date_kor: "금"},
        {date_name: "saturday", date_kor: "토"},
        {date_name: "sunday", date_kor: "일"}
    ]
   
    const dateOption = date.map((date, index) =>{
        var value = false;
        value = date.date_name === "monday" ? inputs.monday : value;
        value = date.date_name === "tuesday" ? inputs.tuesday : value;
        value = date.date_name === "wednesday" ? inputs.wednesday : value;
        value = date.date_name === "thursday" ? inputs.thursday : value;
        value = date.date_name === "friday" ? inputs.friday : value;
        value = date.date_name === "saturday" ? inputs.saturday : value;
        value = date.date_name === "sunday" ? inputs.sunday : value;
        return(
            <div className="EmployeeRegister__SelectCourseDate" key={index}>
                <label className="EmployeeRegister__DateLabel" htmlFor="EmployeeRegister__CheckDate">{date.date_kor}</label>
                <input type="checkbox" className="EmployeeRegister__CheckDate" name={date.date_name} onChange={onDateClick} checked={value}/>
            </div>
        )
    })

    const employeeList = employee_list.map(data => {
        return <option key={data.user_id} value={data.user_name + "-" + data.user_account}/>
    })

    return (
        <div className="EmployeeRegister">
            <div style={{display:"flex", justifyContent:"space-between"}}>
                <div className="EmployeeRegister__InputNameWrap">
                    <span className="EmployeeCRUD__Label" >직원명</span>
                    <input className="EmployeeCRUD__Input" placeholder="직원명" name="employee_name" value={inputs.employee_name} onChange={onChange} autoComplete="off" list="employeeList" disabled={mode === "Detail" ? true : false}/>
                    <datalist id="employeeList">
                        {employeeList}
                    </datalist>
                </div>
            </div>
            <div style={{display:"flex", justifyContent:"space-between"}}>
                <div className="EmployeeRegister__InputTaskWrap">
                    <span className="EmployeeCRUD__Label">업무 설정</span>
                    <select className="EmployeeCRUD__Input" placeholder="업무 설정" name="task" value={inputs.task} onChange={onChange}>
                        <option value="TEACHER">강사</option>
                        <option value="OPERATOR">운영자</option>
                    </select>
                </div>
                <div className="EmployeeRegister__InputAutoWrap">
                    <span className="EmployeeCRUD__Label">권한 설정</span>
                    <select className="EmployeeCRUD__Input" placeholder="권한 설정" name="employee_grade" value={inputs.employee_grade} onChange={onChange}>
                        <option value="GRADE1">일반강사</option>
                        <option value="GRADE2">운영자</option>
                    </select>
                </div>
            </div>
            <div className="EmployeeRegister__InputWorkDayWrap">
                <span className="EmployeeCRUD__Label">출근 요일</span>
                <div style={{display:"flex", justifyContent:"space-between"}}>
                    {dateOption}
                </div>
            </div>
            <div className="EmployeeRegister__InputTimeWrap">
                <span className="EmployeeCRUD__Label">근무 시간</span>
                <div className="EmployeeRegister__TimeWrap">
                    <input className="EmployeeRegister__InputTime" maxLength="2" placeholder="00" name="start_hour" value={inputs.start_hour} onChange={onChange} autoComplete="off"/>
                    <span className="EmployeeRegister__TimeLabel" >시</span>
                    <input className="EmployeeRegister__InputTime" maxLength="2" placeholder="00" name="start_min" value={inputs.start_min} onChange={onChange} autoComplete="off"/>
                    <span className="EmployeeRegister__TimeLabel">분</span>
                    <span className="EmployeeRegister__TimeLabel">~</span>
                    <input className="EmployeeRegister__InputTime" maxLength="2" placeholder="00" name="end_hour" value={inputs.end_hour} onChange={onChange} autoComplete="off"/>
                    <span className="EmployeeRegister__TimeLabel">시</span>
                    <input className="EmployeeRegister__InputTime" maxLength="2" placeholder="00" name="end_min" value={inputs.end_min} onChange={onChange} autoComplete="off"/>
                    <span className="EmployeeRegister__TimeLabel">분</span>
                </div>
            </div>
        </div>
    )
}



export default EmployeeRegister;