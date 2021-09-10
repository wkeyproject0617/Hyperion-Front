import React, { useCallback, useEffect, useState } from "react";
import "./course.css";
import PageButton from "../common/pagebutton";
import Api from "../../api/dataControllerApi";
import CheckToken from "../../api/checkToken";
import CourseCRUD from "./courseCRUD";

function Course(){
    const [token, setToken] = useState(window.localStorage.getItem("accessToken"));
    const refreshToken = window.localStorage.getItem("refreshToken");
    const [courseMode, setCourseMode] = useState("Course");
    const [course, setCourse] = useState();
    const [loading, setLoading] = useState(false);

    const getCourse = useCallback(()=> {
        const header = {
            headers:{
                Authorization: `Bearer ${token}`
            }
        }
        Api.getData("/api/lectures", header).then(res => {
            console.log(res);
            if(res.data.description === "조회성공"){
                setCourse(res.data.data);
            }
            else{
                CheckToken(refreshToken, token, setToken, res);
            }
            setLoading(false);
        })
    },[token, refreshToken]);

    useEffect(()=>{
        setLoading(true);
        getCourse();
    }, [getCourse, courseMode]);

   if(courseMode === "AddCourse"){
       return <CourseCRUD setCourseMode={setCourseMode}/>;
   }

    return(
        <div className="Course">
            <CourseHeader/>
            {loading ? "Loading..." : null}
            {course ? <CourseBody/> : <h4>수강 신청 목록이 없습니다<br></br>수강 신청을 해주세요</h4> }
            <CourseFoot setCourseMode={setCourseMode}/>
        </div>
    ); 
}

function CourseHeader(){
    return(
        <div className="CourseHeader">
            <span className="Course__Select">선택</span>
            <span className="Course__Pin">중요</span>
            <span className="Course__Division">구분</span>
            <span className="Course__Title">제목</span>
            <span className="Course__Teacher">강사명</span>
            <span className="Course__Student">학생명</span>
            <span className="Course__Time">강의시간</span>
            <span className="Course__Date">등록일</span>
      </div>
    )
}

function CourseBody(){
    return(
        <div className="CourseBody">
            
        </div>
    );
}

function CourseFoot({setCourseMode}){
    return(
        <div className="CourseFoot">
            <div className="CourseFoot__SelectDivisionWrap">
                <select className="CourseFoot__SelectDivision">
                    <option>전체</option>
                </select>
            </div>
            <PageButton />
            <div>
                <button className="CourseFoot__AddCourse" onClick={()=>{setCourseMode("AddCourse")}} >수강 신청</button>
            </div>
        </div>
    )
}


export default Course;