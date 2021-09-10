import React from "react";
import "./reportContentButton.css";

function ReportContentButton({onDeleteButtonClick, onAddButtonClick}){
    return(
        <div className="ReportContentButton">
            <button className="ReportContentButton__Delete" onClick={onDeleteButtonClick}>삭제하기</button>
            <button className="ReportContentButton__Add" onClick={onAddButtonClick}>추가하기</button>
        </div>
    )
}

export default ReportContentButton;