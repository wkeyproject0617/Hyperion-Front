import React, { useCallback, useEffect, useState } from "react";
import "./employeeMain.css";
import PageButton from "../common/pagebutton";
import Api from "../../api/dataControllerApi";
import CheckToken from "../../api/checkToken";


function EmployeeMain({setMode, setUserId}){

    const [token, setToken] = useState(window.localStorage.getItem("accessToken"));
    const refreshToken = window.localStorage.getItem("refreshToken");
    const [employee_list, setEmployeeList] = useState([]);
    const [current_page, setCurrentPage] = useState(0);
    const [total_page, setTotalPage] = useState(0);
    const getEmployee = useCallback(() =>{

        const header = {
            headers:{
                Authorization: `Bearer ${token}`
            }
        }

        Api.getData(`/adminApi/employees?page=${current_page}`, header).then(res => {
            console.log(res);
            if(res.data.description === "조회성공"){
                setEmployeeList(res.data.data);
                setTotalPage(res.data.pagination.total_pages);
            }else{
                CheckToken(refreshToken, token, setToken, res);
            }
        }).catch(err => {

        });
    }, [token, refreshToken, current_page])

    useEffect(()=>{
        getEmployee();
    },[getEmployee, token])

    const employeeList = employee_list.map((data, index) =>{
        var workDay = "";
        workDay = data.monday ? workDay + " 월" : workDay;
        workDay = data.tuesday ? workDay + " 화" : workDay;
        workDay = data.wednesday ? workDay + " 수" : workDay;
        workDay = data.thursday ? workDay + " 목" : workDay;
        workDay = data.friday ? workDay + " 금" : workDay;
        workDay = data.saturday ? workDay + " 토" : workDay;
        workDay = data.sunday ? workDay + " 일" : workDay;
        
        return(
            <tr className="EmployeeMain__Tbody" key={index} onClick={()=>{setUserId(data.user_id); setMode("Detail")}}>
                <td className="EmployeeMain__TbodyContent">{data.user_name}</td>
                <td className="EmployeeMain__TbodyContent">{data.gender === "MAN" ? "남" : "여"}</td>
                <td className="EmployeeMain__TbodyContent">{data.user_account}</td>
                <td className="EmployeeMain__TbodyContent">{data.user_email}</td>
                <td className="EmployeeMain__TbodyContent">{data.task === "OPERATOR" ? "운영자" : "강사"}</td>
                <td className="EmployeeMain__TbodyContent">{workDay}</td>
                <td className="EmployeeMain__TbodyContent">{data.start_time + " ~ " + data.end_time}</td>
                <td className="EmployeeMain__TbodyContent">{data.created_at}</td>
            </tr>
        )
    })

    return(
        <div className="EmployeeMain">
            <div className="EmployeeMain__Content">
                <table className="EmployeeMain__Table">
                    <thead >
                        <tr className="EmployeeMain__Thead">
                            <td className="EmployeeMain__TheadLabel">직원명</td>
                            <td className="EmployeeMain__TheadLabel">성별</td>
                            <td className="EmployeeMain__TheadLabel">아이디</td>
                            <td className="EmployeeMain__TheadLabel">이메일</td>
                            <td className="EmployeeMain__TheadLabel">업무 내용</td>
                            <td className="EmployeeMain__TheadLabel">출근일</td>
                            <td className="EmployeeMain__TheadLabel">근무 시간</td>
                            <td className="EmployeeMain__TheadLabel">등록일</td>
                        </tr>
                    </thead>
                    <tbody>
                        {employeeList}
                    </tbody>
                </table>
            </div>
            <div className="EmployeeMain__Foot">
                <select className="EmployeeMain__SelectDivision">
                    <option>구분검색</option>
                </select>
                <PageButton currentPage={current_page} setCurrentPage={setCurrentPage} totalPage={total_page}/>
                <button className="EmployeeMain__ButtonRegister" onClick={()=>{setMode("Register")}}>직원 등록</button>
            </div>
        </div>
    )
}

export default EmployeeMain;