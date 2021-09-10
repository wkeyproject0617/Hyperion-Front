import React, { useState } from "react";
import EmployeeCRUDFoot from "./employeeCRUDFoot";
import EmployeeDetail from "./employeeDetail";
import EmployeeHeader from "./employeeHeader";
import EmployeeRegister from "./employeeReigster";

function EmployeeCRUD({mode, setMode, userId}){

    const title = "직원 등록";
    const subTitle = "직원의 인적사항과 과목정보를 등록합니다";

    const [inputs, setInputs] = useState({
        employee_name:"",
        employee_grade:"GRADE1",
        task:"TEACHER",
        start_hour:"",
        start_min:"",
        end_hour:"",
        end_min:"",
        monday:false,
        tuesday:false,
        wednesday:false,
        thursday:false,
        friday:false,
        saturday:false,
        sunday:false
    })

    return(
        <div className="EmployeeCRUD">
            <EmployeeHeader title={title} subTitle={subTitle}/>
            <div className="EmployeeCRUD__ContentWrap">
                <EmployeeRegister mode={mode} setMode={setMode} userId={userId} inputs={inputs} setInputs={setInputs}/>
                {mode === "Detail" ? <EmployeeDetail userId={userId} /> : null}
                <EmployeeCRUDFoot mode={mode} setMode={setMode} userId={userId} inputs={inputs} setInputs={setInputs}/>
            </div>
        </div>
    )
}

export default EmployeeCRUD;