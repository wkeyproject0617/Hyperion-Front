import React, {useState, useEffect, useCallback, useRef, forwardRef} from 'react';

import './subject.css';

import Api from '../../api/subjectControllerApi';
import SelectApi from '../../api/subjectSelectBoxController';
import CheckToken from "../../api/checkToken";
import PageButton from "../common/pagebutton";

import {SubjectC} from "./subjectCRUD";
import {SubjectR} from "./subjectCRUD";
import {SubjectU} from "./subjectCRUD";


function Subject(){
  const [subjects, setSubjects] = useState();
  const [page, setPage] = useState("main");

  const [current_page, setCurrentPage] = useState(0);
  const [total_page, setTotalPage] = useState();

  const [token, setToken] = useState(window.localStorage.getItem("accessToken"));
  const refreshToken = window.localStorage.getItem("refreshToken");

  const getSubjects = useCallback(() => {
    Api.getSubjects(current_page)
      .then((res) => {
        if(res.data.description === "조회성공"){
          setSubjects(res.data.data);
          setTotalPage(res.data.pagination.total_pages);
        }else{
          CheckToken(refreshToken, token, setToken, res);
        }
      })
      .catch((err) => {
        console.log(err);
      })
  }, [current_page, token, refreshToken]);

  useEffect(() => {
    getSubjects();
  }, [getSubjects, page]);

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
  
        }
      })
      .catch((err) => {
        console.log(err);
      })
    
  }, [refreshToken, token, setToken])

  const WriterCLick = () => {
    setPage("create");
  }

  const [select, setSelect] = useState("전체");
  const CategoryChange = (e) => {
    const {value} = e.target;

    setSelect(value)

    if(value === "전체"){
      getSubjects();
    }

    Api.getSubjectCategories(value, current_page)
      .then((res) => {
        const description = res.data.description;

        if(description === "조회성공"){
          setSubjects(res.data.data);
          setTotalPage(res.data.pagination.total_pages);

        } else if(description === "토큰에러"){

          CheckToken(refreshToken, token, setToken, res);

        } else if(description === "데이터없음"){

        }
      })
      .catch((err) => {
        console.log(err);
      })
  }

  const readRef = useRef();

  if(page === "main"){
    return(
      <div className="subjectWrap">
        <table className="subjectTable">
          <thead className="subjectTableHeader">
            <tr>
              <td>구분</td>
              <td>제목</td>
              <td>레벨</td>
              <td>회차</td>
              <td>교재</td>
              <td>작성자</td>
              <td>등록일</td>
            </tr>
          </thead>
          <tbody>
            {/*동적리스트 추후 구현*/}
            {subjects && subjects.map(row => (
                <SubjectList key={row.id} row={row} ref={readRef} setPage={setPage}/>
              )
            )}
          </tbody>
        </table>
  
        <div className="subjectController">
          <div>
            <select className="subjectCtrlSelect" onChange={CategoryChange} value={select}>
              <option value={"전체"}>전체</option>
            {
              DivisionSelect && DivisionSelect.map((data, index) => (
                <option key={index} value={data}>{data}</option>
              ))
            }
            </select>
          </div>
  
          <PageButton currentPage={current_page} setCurrentPage={setCurrentPage} totalPage={total_page}/>
  
          <div>
            <button type="button" className="subjectCtrlAddBtn" onClick={WriterCLick}>과목작성</button>
          </div>
  
        </div>
      </div>
    )
  } else if(page === "create"){
    return(
      <SubjectC 
        setPage={setPage}
        setCurrentPage={setCurrentPage} 
        setToken={setToken} 
        refreshToken={refreshToken} 
        token={token}
      />
    )
  } else if(page === "read"){
    return(
      <SubjectR
        setPage={setPage}
        setCurrentPage={setCurrentPage} 
        id={readRef.current}
        setToken={setToken} 
        refreshToken={refreshToken} 
        token={token}
      />
    )
  } else if(page === "update"){
    return(
      <SubjectU
        setPage={setPage}
        setCurrentPage={setCurrentPage} 
        id={readRef.current}
        setToken={setToken} 
        refreshToken={refreshToken} 
        token={token}
      />
    )
  }
  
}

const SubjectList = forwardRef(({row, setPage}, ref) => {
  const ListClick = () => {
    const SubjectId = row.id;
    ref.current = SubjectId;
    setPage("read");
  }

  return(
    <tr className="subjectTableBody" onClick={ListClick}>
      <td className="subjectTableCategory">{row.subject_category}</td>
      <td>{row.subject_title}</td>
      <td>{row.subject_level}</td>
      <td>{row.total_weeks}</td>
      <td>{row.subject_book}</td>
      <td>{row.created_by}</td>
      <td>{row.created_at}</td>
    </tr>
  )
})

export default Subject;