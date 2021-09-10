import React, { useState } from "react";
import "./report.css";
import ReportCreate from "./reportCreate";
import ReportCustom from "./reportCustom";
import ReportGrammarChoice from "./reportGrammarChoice";
import ReportGrammarShort from "./reportGrammarShort";
import ReportHeader from "./reportHeader";
import ReportManage from "./reportManage";
import ReportMaterial from "./reportMaterial";
import ReportSentence from "./reportSentence";
import ReportVoca from "./reportVoca";


function Report(){
    const [report_mode, setReportMode] = useState("");
    const [report_ready_data, setReportReadyData] = useState({
        division:"",
        subject:"",
        level:"",
        id:"",
        stage:""
    })

    return(
        <div className="Report">
            {report_mode ? <ReportHeader reportMode={report_mode} setReportMode={setReportMode}/> : null}
            {!report_mode ? <ReportManage setReportMode={setReportMode} reportReadyData={report_ready_data} setReportReadyData={setReportReadyData}/> : null}
            {report_mode === "Voca" ? <ReportVoca reportReadyData={report_ready_data}/>: null}
            {report_mode === "Sentence" ? <ReportSentence reportReadyData={report_ready_data}/> : null}
            {report_mode === "Grammar1" ? <ReportGrammarShort reportReadyData={report_ready_data}/> : null}
            {report_mode === "Grammar2" ? <ReportGrammarChoice reportReadyData={report_ready_data}/> : null}
            {report_mode === "CustomReport" ? <ReportCustom reportReadyData={report_ready_data}/> : null}
            {report_mode === "LectureMaterial" ? <ReportMaterial reportReadyData={report_ready_data}/> : null}
            {report_mode === "RegisterReport" ? <ReportCreate reportReadyData={report_ready_data}/> : null}
        </div>
    )
}

export default Report;