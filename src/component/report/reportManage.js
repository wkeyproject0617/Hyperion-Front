import React from 'react';

import './reportManage.css';
import ReportRelease from './reportRelease';
import PrepareReport from './reportReady';

function ReportManage({ setReportMode, reportReadyData, setReportReadyData }) {
  return (
    <div className="ReportManage">
      <PrepareReport
        setReportMode={setReportMode}
        reportReadyData={reportReadyData}
        setReportReadyData={setReportReadyData}
      />
      <ReportRelease />
    </div>
  );
}

export default ReportManage;
