import noticeControllerApi from "../../api/dataControllerApi";
import "./notice.css";
import NoticeCRUD from "./noticeCRUD/NoticeCRUD";
import NoticeDetail from "./NoticeDetail";
import React, { useState, useEffect, useCallback } from "react";
import NoticeHeader from "./NoticeHeader";
import NoticeBody from "./NoticeBody";
import NoticeFoot from "./NoticeFoot";
import CheckToken from "../../api/checkToken";

function Notice(){

  const [notices, setNotices] = useState();
  const [current_page, setCurrentPage] = useState(0);
  const [total_page, setTotalPage] = useState();
  const [notice_mode, setNoticeMode] = useState("Notice");
  const [notice, setNotice] = useState();
  const [checked_id, setCheck] = useState([]);
  const [token, setToken] = useState(window.localStorage.getItem("accessToken"));
  const refreshToken = window.localStorage.getItem("refreshToken");
  const [pin, setPin] = useState([]);
  const _getNotice = useCallback(() => {
    const header = {
      headers:{
        Authorization: `Bearer ${token}`
      }
    }
    noticeControllerApi.getData("/api/notices?page=" + current_page, header).then(res => {
      // console.log(res);
      if(res.data.description === "조회성공"){
        setNotices(res.data.data);
        setTotalPage(res.data.pagination.total_pages);
      }else{
        CheckToken(refreshToken, token, setToken, res);
      }
    });
  }, [current_page, token, refreshToken]);

  useEffect(()=> {
    _getNotice();
  }, [_getNotice, notice_mode, checked_id, token, pin]);

  let layout = <NoticeMain/>;

  function NoticeMain(){
    return(
      <div className="NoticeMain">
        <NoticeHeader/>
        {notices ? <NoticeBody notices={notices} setNoticeMode={setNoticeMode} setNotice={setNotice} setCheck={setCheck} checkedId={checked_id} setPin={setPin}/>: "Loading..."}
        <NoticeFoot totalPage={total_page} currentPage={current_page} setCurrentPage={setCurrentPage} setNoticeMode={setNoticeMode} setNotice={setNotice} setCheck={setCheck} checkedId={checked_id}/>
      </div>
    );
  }

  if(notice_mode === "AddNotice" || notice_mode === "UpdateNotice"){
    layout = <NoticeCRUD mode={notice_mode} setMode={setNoticeMode} notice={notice}/>;
  }else if(notice_mode === "NoticeDetail"){
    layout = <NoticeDetail notice={notice} setMode={setNoticeMode}/>
  }
  
  return(
    <div className="Notice">
      {layout}
    </div>
  ); 
}

export default Notice;