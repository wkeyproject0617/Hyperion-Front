import React from "react";
import "./employeeHeader.css";

function EmployeeHeader({title, subTitle}){
    return(
        <div className="EmployeeHeader">
            <span className="EmployeeHeader__Title">{title}</span>
            <span className="EmployeeHeader__SubTitle">{subTitle}</span>
        </div>
    )
}

export default EmployeeHeader;