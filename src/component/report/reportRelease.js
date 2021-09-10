import ReportManageTitle from "./reportManageTitle";

function ReportRelease(){
    const title = "과제 생성";
    const subTitle = "강사가 직접 설계하는 나만의 과제를 준비합니다";
    return(
        <div className="ReportRelease">
            <ReportManageTitle title={title} subTitle={subTitle} />
            <div className="ReportRelease__InputWrap">
                <div className="ReportRelease__InputStudentWrap">
                    <span className="ReportManage__InputLabel">학생명</span>
                    <input className="ReportManage__Input" autoComplete="off"/>
                    <span className="ReportManage__InputSubLabel">학생이름을 입력해 주세요</span>
                </div>
                <div className="ReportRelease__InputSubjectNameWrap">
                    <span className="ReportManage__InputLabel">과목명</span>
                    <input className="ReportManage__Input" autoComplete="off" placeholder="과목명"/>
                    <span className="ReportManage__InputSubLabel">과목명을 입력해 주세요</span>
                </div>
                <div className="ReportRelease__InputSubjectStateWrap">
                    <span className="ReportManage__InputLabel">과목 회차</span>
                    <input className="ReportManage__Input" autoComplete="off" placeholder="과목 회차"/>
                    <span className="ReportManage__InputSubLabel">과목의 회차를 선택해 주세요</span>
                </div>
                <div className="ReportRelease__InputDeadLineWrap">
                    <span className="ReportManage__InputLabel">마감 일자</span>
                    <div className="ReportRelease__InputDeadLineContent">
                        <InputDeadLineDate />
                        <div className="ReportManage__InputDeadLineTimeWrap">
                            <input className="ReportManage__InputDeadLineTime" placeholder="00"/> 
                            <span className="ReportManage__InputDeadLineLabel" >시</span> 
                            <input className="ReportManage__InputDeadLineTime" placeholder="00"/> 
                            <span className="ReportManage__InputDeadLineLabel">분</span> 
                        </div>
                    </div>
                    <span className="ReportManage__InputSubLabel">과제를 마감할 일자를 선택해 주세요</span>
                </div>
                <div className="ReportRelease__ButtonWrap">
                    <button className="ReportRelease__ButtonReleaseImmedi" >즉시 출제</button>
                    <button className="ReportRelease__ButtonRelease" >과제 생성</button>
                </div>
            </div>
        </div>
    )
}

function InputDeadLineDate(){
    var date = new Date();
    const NOWYEAR = date.getFullYear();
    var year_list = [];
    var month_list = [];
    for(var i = NOWYEAR; i <= NOWYEAR + 5; i++){
        year_list.push(<option key={i} value={i}>{i}</option>);
    }
    for(var k = 1; k <= 12; k++){
        month_list.push(<option key={k} value={k}>{k}</option>);
    }

    return(
        <div className="ReportManage__InputDeadLineDateWrap">
            <select className="ReportManage__InputDeadLineDate" placeholder="0000" >{year_list}</select>
            <span className="ReportManage__InputDeadLineLabel">년</span> 
            <select className="ReportManage__InputDeadLineDate" placeholder="00">{month_list}</select>
            <span className="ReportManage__InputDeadLineLabel">월</span> 
            <input className="ReportManage__InputDeadLineTime" placeholder="00"/> 
            <span className="ReportManage__InputDeadLineLabel">일</span> 
        </div>
    )
}

export default ReportRelease;