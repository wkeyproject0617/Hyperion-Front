import React, { useState } from "react";
import Swal from "sweetalert2";
import CheckToken from "../../api/checkToken";
import Api from "../../api/dataControllerApi";
import "./noticeDetail.css";

function NoticeDetail({notice, setMode}){

    const [token, setToken] = useState(window.localStorage.getItem("accessToken"));
    const refreshToken = window.localStorage.getItem("refreshToken");

    const deleteNotice = () => {
        let header = {
            headers:{
                Authorization: `Bearer ${token}`
            }
        }
        Api.deleteData("/adminApi/notices/" + notice.id, header).then(res=>{
            console.log(res);
            Swal.fire(res.data.description, "", res.data.result_code.toLowerCase()).then(res =>{
                if(res.isConfirmed){
                    setMode("Notice");
                }else{
                    CheckToken(refreshToken, token, setToken, res);
                }
            });
        });
    }

    return(
        <div className="NoticeDetail">
            <div className="NoticeDetail__Header">
                <span className="NoticeDetail__Id">{notice.id}</span>
                <span className="NoticeDetail__Division">{notice.notice_division}</span>
                <span className="NoticeDetail__Title">{notice.title}</span>
                <span className="NoticeDetail__Date">{notice.notice_date}</span>
            </div>
            <div className="NoticeDetail__Body">
                <div className="NoticeDetail__Contents">
                    {notice.contents}
                </div>
                <div className="NoticeDetail__FileWrap">
                    <span className="NoticeDetail__FileLabel">첨부파일</span>
                </div>
            </div>
            <div className="NoticeDetail__Foot">
                <button className="NoticeDetail__GoNoticeList" onClick={()=>{setMode("Notice")}}>목록으로</button>
                <button className="NoticeDetail__DeleteNotice" onClick={deleteNotice}>삭제하기</button>
                <button className="NoticeDetail__UpdateNotice" onClick={()=>{setMode("UpdateNotice")}}>수정하기</button>
            </div>
        </div>
    );
}

export default NoticeDetail;