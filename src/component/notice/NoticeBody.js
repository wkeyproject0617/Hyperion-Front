import "./NoticeBody.css";
import React, { useState } from "react";
import Api from "../../api/dataControllerApi";
import CheckToken from "../../api/checkToken";
function NoticeBody({notices, setNoticeMode, setNotice, setCheck, checkedId, setPin}){
    const [token, setToken] = useState(window.localStorage.getItem("accessToken"));
    const refreshToken = window.localStorage.getItem("refreshToken");
    const header = {
        headers:{
            Authorization: `Bearer ${token}`
        }
    }

    const onNoticeClick = (notice) => {
        setNoticeMode("NoticeDetail");
        setNotice(notice);
    }
    const onCheckClick = (e) =>{
        const checked = e.target.checked;
        const value = e.target.value;
        if(checked){
            setCheck([...checkedId, value]);
        }else{
            var temp = checkedId;
            setCheck(temp.filter(tmp => tmp !== value));
        }
    }
    const style={
        color:"#FFB300"
    }

    const onPinClick = (id, pin, e) => {
        var data = "false";
        if(!pin){
            data = "true";
        }
        Api.getData(`/adminApi/notices/${id}?pin=${data}`, header).then(res => {
            if(res.data.description === "체크성공"){
                setPin(id + data);
            }else{
                CheckToken(refreshToken, token, setToken, res);
            }
        })
    }

    return(
        <div className="Notice__Body">
        {notices.map((notice, index) => {
            var pin = '☆';
            if(notice.pin){
                pin = '★';
            }
            var checked = false;
            let checkedStyle = null;
            if(checkedId.includes(notice.id.toString())){
                checked = true;
                checkedStyle = {
                    backgroundColor:"#E8EBEF"
                }
            }
            return(
            <div className="Notice__Contents" key={notice.id} style={checkedStyle}>
                <span className="Notice__Select"><input type="checkbox" onClick={onCheckClick} value={notice.id} defaultChecked={checked}/></span>
                <span style={style} className="Notice__Pin" onClick={onPinClick.bind(this, notice.id, notice.pin)}>{pin}</span>
                <span className="Notice__Division">{notice.notice_division}</span>
                <span className="Notice__Title" onClick={onNoticeClick.bind(this, notice)}>{notice.title}</span>
                <span className="Notice__Date">{notice.notice_date}</span>
            </div>
            );
        })}
        </div>
    )
}
export default NoticeBody;