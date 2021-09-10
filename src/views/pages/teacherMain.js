import React, {useState} from 'react';
import '../../css/teacherMain.css';

import TeacherMainHeader from '../common/teacherMainHeader';
import Notice from '../../component/notice/notice';
import Course from '../../component/course/course';
import Subject from '../../component/subject/subject';
import Report from '../../component/report/report';
import Employee from '../../component/employee/employee';
import Student from '../../component/student/student';
import Schedule from '../../component/schedule/schedule';


function TeacherMain(){
  var page = null;
  const [mode, setMode] = useState("Schedule");
  
  if(mode === "Notice"){
      page = <Notice/>
  } else if(mode === "Course"){
      page = <Course/>
  } else if(mode === "Subject"){
      page = <Subject/>
  } else if(mode === "Report"){
      page = <Report/>
  } else if(mode === "Employee"){
      page = <Employee />
  } else if(mode === "Student"){
      page = <Student/>
  } else if(mode === "Schedule"){
      page = <Schedule />
  }

  return (
      <div className="TeacherMain">
         <TeacherMainHeader mode={mode} setMode={setMode}/>
         <div id="MainBody">
             {page} 
         </div>
      </div>
      
  );
}

export default TeacherMain;