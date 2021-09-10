import React, { useEffect, useState, useRef, forwardRef } from 'react';

import './student.css';

import Api from '../../api/studentControllerApi';
import SelectApi from '../../api/subjectSelectBoxController';
import CheckToken from "../../api/checkToken";

import PageButton from "../common/pagebutton";

function Student(){
  const [page, setPage] = useState("main");
  const [current_page, setCurrentPage] = useState(0);
  const [total_page, setTotalPage] = useState();

  const [students, setStudents] = useState();
  const [select, setSelect] = useState("전체");

  const [token, setToken] = useState(window.localStorage.getItem("accessToken"));
  const refreshToken = window.localStorage.getItem("refreshToken");

  useEffect(() => {
    Api.getStudents(current_page)
      .then((res) => {
        if(select === "전체"){
          if(res.data.description === "조회성공"){
            console.log(res.data.data);
            setStudents(res.data.data);
            setTotalPage(res.data.pagination.total_pages);
          } else{
            CheckToken(refreshToken, token, setToken, res);
          }
        } else {
          Api.getStudentCategories(select, current_page)
            .then((res) => {
              const description = res.data.description;

              if(description === "조회성공"){
                console.log(res.data);
                setStudents(res.data.data);
                setTotalPage(res.data.pagination.total_pages);

              } else if(description === "토큰에러"){

                CheckToken(refreshToken, token, setToken, res);

              } else if(description === "데이터없음"){
                // 과목 구분을 동적으로 받기 때문에 데이터가 없는 과목이 생성되지 않으므로 구현필요성이 없어보임.
              }
            })
            .catch((err) => {
              console.log(err);
            })
        }
      })
      .catch((err) => {
        console.log(err);
      })
  }, [current_page, token, refreshToken, select])

  const [DivisionSelect, setDivisionSelect] = useState();

  useEffect(() => {
    SelectApi.getSubjectsCategories()
      .then((res) => {
        const description = res.data.description;

        if(description === "조회성공"){
          setDivisionSelect(res.data.data);
        } else if(description === "토큰에러"){
          CheckToken(refreshToken, token, setToken, res);
        } else if(description === "데이터없음"){
          //개발필요성이 없어보임
        }
      })
      .catch((err) => {
        console.log(err);
      })
  }, [refreshToken, token])

  const CategoryChange = (e) => {
    const {value} = e.target;

    setSelect(value);
    setCurrentPage(0);

  }

  const readRef = useRef();

  if(page === "main"){
    return(
      <div className="studentWrap">
        <table className="studentTable">
          <thead className="studentTableHeader">
            <tr>
              <td>학생명</td>
              <td>아이디</td>
              <td>구분</td>
              <td>과목명</td>
              <td>레벨</td>
              <td>수강시간</td>
              <td>등록일</td>
            </tr>
          </thead>
          <tbody>
            {/*동적리스트 추후 구현*/}
            {students && students.map(row => (
                <StudentList key={row.lecture_id} row={row} ref={readRef} setPage={setPage}/>
              )
            )}
          </tbody>
        </table>
  
        <div className="studentController">
          <div>
            <select className="studentCtrlSelect" onChange={CategoryChange} value={select}>
              <option>전체</option>
            {
              DivisionSelect && DivisionSelect.map((data, index) => (
                <option key={index} value={data}>{data}</option>
              ))
            } 
            </select>
          </div>
  
          <PageButton currentPage={current_page} setCurrentPage={setCurrentPage} totalPage={total_page}/>
      
          {/*레이아웃용*/}
          <div>
            <button type="button" className="studentSpaceBtn"></button>
          </div>
  
        </div>
      </div>
    )
  }
}

const StudentList = forwardRef(({row, setPage}, ref) => {
  const ListClick = () => {
    const StudentId = row.lecture_id;
    ref.current = StudentId;
    setPage("read");
  }

  return(
    <tr className="studentTableBody" onClick={ListClick}>
      <td>{row.student_name}</td>
      <td>{row.student_account}</td>
      <td>{row.subject_category}</td>
      <td>{row.subject_title}</td>
      <td>{row.subject_level}</td>
      <td>{row.start_time}~{row.end_time}</td>
      <td>{row.created_at}</td>
    </tr>
  )
})
export default Student;