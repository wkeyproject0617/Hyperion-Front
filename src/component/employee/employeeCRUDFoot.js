
import React, {useEffect, useState } from "react";
import CheckToken from "../../api/checkToken";
import Api from "../../api/dataControllerApi";
import ConfirmModal from "../common/confirmModal";
import "./employeeCRUDFoot.css";
import GetEmployeeData from "./getEmployeeData";

function EmployeeCRUDFoot({mode, setMode, userId, inputs, setInputs}){
    const [token, setToken] = useState(window.localStorage.getItem("accessToken"));
    const refreshToken = window.localStorage.getItem("refreshToken");
    const [employee_list, setEmployeeList] = useState([]);
    const [modal_title, setModalTitle] = useState("");
    const [modal_content, setModalContent] = useState("");
    const [show_modal, setShowModal] = useState(false);

    
    const _callBack = () => {
        setMode("Main")
        setShowModal(false);
    }

    useEffect(()=>{
        GetEmployeeData.getEmployeeList(token, setToken, refreshToken, setEmployeeList)
    }, [token, refreshToken])

    const DeleteEmployee = () => {
        const header = {
            headers:{
                Authorization: `Bearer ${token}`
            }
        }

        Api.deleteData(`/adminApi/employees/${userId}`, header).then(res => {
            console.log(res);
            if(res.data.description === "삭제성공"){
                setModalTitle("삭제")
                setModalContent("삭제에 성공했습니다");
                setShowModal(true);
            }
        }).catch(err => {
            console.log(err);
        })
    }

    const PostEmployee = () => {
        var employee_id = null;
        var employee_name = inputs.employee_name.split("-");
        for(var i = 0; i < employee_list.length; i++){
            if(employee_list[i].user_name === employee_name[0]){
                employee_id = employee_list[i].user_id;
            }
        }
        
        var start_hour = inputs.start_hour.length !== 1 ? inputs.start_hour : "0" + inputs.start_hour;
        var start_min = inputs.start_min.length !== 1 ? inputs.start_min : "0" + inputs.start_min;
        var end_hour = inputs.end_hour.length !== 1 ? inputs.end_hour : "0" + inputs.end_hour;
        var end_min = inputs.end_min.length !== 1 ? inputs.end_min : "0" + inputs.end_min;
        
        const header = {
            headers:{
                Authorization: `Bearer ${token}`
            }
        }

        employee_id = employee_id ? employee_id : userId;
        const data = {
            start_time:start_hour + ":" + start_min,
            end_time:end_hour + ":" + end_min,
            monday:inputs.monday,
            tuesday:inputs.tuesday,
            wednesday:inputs.wednesday,
            thursday:inputs.thursday,
            friday:inputs.friday,
            saturday:inputs.saturday,
            sunday:inputs.sunday,
            task:inputs.task,
            user_grade:inputs.employee_grade,
            user_id:employee_id
        }

        if(mode === "Register"){
           RegisterEmployee(data, header);
        }else{
            UpdateEmployee(data, header);
        }

    }

    const RegisterEmployee = (data, header) => {
        Api.postData("/adminApi/employees", data, header).then(res => {
            console.log(res);
            if(res.data.description === "등록성공"){
                setModalTitle("등록")
                setModalContent("등록에 성공했습니다")
                setShowModal(true);
            }
            else{
                CheckToken(refreshToken, token, setToken, res);
            }
        }).catch(err => {
            console.log(err);
        })
    }

    const UpdateEmployee = (data, header) => {
        Api.patchData("/adminApi/employees", data, header).then(res => {
            console.log(res);
            if(res.data.description === "수정성공"){
                setModalTitle("수정")
                setModalContent("수정에 성공했습니다")
                setShowModal(true);
            }else{
                CheckToken(refreshToken, token, setToken, res);
            }
        }).catch(err => {
            console.log(err);
        })
    }

    
    return(
        <div className="EmployeeCRUD__Foot">
            {show_modal ? <ConfirmModal title={modal_title} content={modal_content} callback={_callBack}/> : null}
            <button className="EmployeeCRUD__ButtonGoList" onClick={()=>{setMode("Main")}}>목록</button>
            { mode !== "Register" ? <button className="EmployeeCRUD__ButtonDelete" onClick={DeleteEmployee}>삭제</button> : null }
            <button className="EmployeeCRUD__ButtonUpdate" onClick={PostEmployee}>{ mode === "Register" ? "등록" : "수정"}</button>
        </div>
    )
}

export default EmployeeCRUDFoot;