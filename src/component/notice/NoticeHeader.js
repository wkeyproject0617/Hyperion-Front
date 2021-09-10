import "./NoticeHeader.css";

function NoticeHeader(){
    return(
      <div className="Notice__Header">
      <span className="Notice__Select"><input type="checkbox"></input></span>
      <span className="Notice__Pin">☆</span>
      <span className="Notice__Division">구분</span>
      <span className="Notice__Title">제목</span>
      <span className="Notice__Date">공지일</span>
    </div>
    );
}

export default NoticeHeader;