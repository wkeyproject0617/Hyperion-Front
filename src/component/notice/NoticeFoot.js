import Swal from "sweetalert2";
import PageButton from "../common/pagebutton";
import "./NoticeFoot.css";
import Api from "../../api/dataControllerApi";
import { useState } from "react";
import CheckToken from "../../api/checkToken";

function NoticeFoot({totalPage, currentPage, setCurrentPage, setNoticeMode, setNotice, setCheck,checkedId}){
  const [token, setToken] = useState(window.localStorage.getItem("accessToken"));
  const refreshToken = window.localStorage.getItem("refreshToken");
    const AddNotice = () => {
      setNoticeMode("AddNotice");
      setNotice({
        pin:false,
        title:'',
        contents:'',
        notice_date:'',
        notice_division:'공지',
      });
    }
  
    const deleteNotice = () => {
      const header = {
        headers:{
          Authorization: `Bearer ${token}`
        }
      }
      Swal.fire({
        title:"선택된 공지 수 " + checkedId.length + "개",
        text:"확인 버튼을 누르면 공지가 삭제 됩니다",
        icon:"info",
        showCancelButton:true,
        confirmButtonText:"확인"
      }).then(res => {
        if(res.isConfirmed){
          for(var i = 0; i < checkedId.length; i++){
              Api.deleteData("/adminApi/notices/" + checkedId[i], header).then(res=>{
              console.log(res);
              if(res.data.description === "삭제성공"){
                Swal.fire(res.data.description, "", res.data.result_code.toLowerCase());
                setCheck([]);
              }else{
                CheckToken(refreshToken, token, setToken, res);
              }
            });
          }
        }
      });
    }
  
    return(
      <div className="Notice__Foot">
        <div className="Notice__SelectDivisionWrap">
          <select className="Notice__SelectDivision">
            <option>전체</option>
          </select>
        </div>
        <PageButton currentPage={currentPage} setCurrentPage={setCurrentPage} totalPage={totalPage}/>
        <div>
          { checkedId.length === 0 ? null : <button className="Notice__ButtonDeleteNotice" onClick={deleteNotice}>공지 삭제</button>}
          <button className="Notice__AddNotice" onClick={AddNotice}>공지 작성</button>
        </div>
      </div>
    );
  }

  export default NoticeFoot;