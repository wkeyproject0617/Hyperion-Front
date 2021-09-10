import React from "react";
import "./pageButton.css";

function PageButton({currentPage, setCurrentPage, totalPage}){

    const changePage = (e) => {
        const value = parseInt(e.target.value);
        
        if(0 <= value && value < totalPage){
            setCurrentPage(value);
        }
    }

    var buttons = [];
    const style={
        backgroundColor:"#1B3965",
        color:"white"
    }
    for(var i = 0; i < totalPage; i++){
        if(parseInt(currentPage) === i){
        buttons.push(<button key={i} className="PageButton" value={i}  style={style} onClick={changePage}>{i + 1}</button>);
        }else{
        buttons.push(<button key={i} className="PageButton" value={i}  onClick={changePage}>{i + 1}</button>);
        }
    }

    return(
        <div className="PageButtonWrap">
            <button className="PageButton" value={'0'} onClick={changePage} >{'<<'}</button>
            <button className="PageButton" value={`${currentPage - 1}`} onClick={changePage}>{'<'}</button>
            {buttons}
            <button className="PageButton" value={`${currentPage + 1}`} onClick={changePage}>{'>'}</button>
            {/* 페이지가 0부터 카운트 되기 때문에 totalPage에서 -1을 해주어야 한다 */}
            <button className="PageButton" value={`${totalPage - 1}`} onClick={changePage}>{'>>'}</button>
        </div>
    );
}

export default PageButton;