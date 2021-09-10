import React from "react";
import "./reportContentHeader.css";

function ReportContentHeader({title, subTitle}){
    return(
        <div className="ReportContentHeader">
                <span className="Report__Title">{title}</span>
                <span className="Report__SubTitle">{subTitle}</span>
        </div>
    )
}

export default ReportContentHeader;