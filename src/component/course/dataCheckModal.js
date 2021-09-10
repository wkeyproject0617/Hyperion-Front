import "../common/useModal.css";
import "./dataCheckModal.css";

function DataCheckModal({setShowModal, callback, data, token}){

    return(
        <div className="UseModal">
        <div className="UseModal__ContentsWrap">
            <div className="UseModal__TopBottomStyle"></div>
            <div className="UseModal__BackButtonWrap">
                <button className="UseModal__BackButton" onClick={()=>{setShowModal(false)}}>X</button>
            </div>
            <div className="UseModal__Contents">
                <div className="DataCheckModal__TitleWrap">
                    <span className="DataCheckModal__Title">해당 시간에는 학생이 배정되어 있습니다</span>
                </div>
                <div className="DataCheckModal__TextWrap">
                    <span className="DataCheckModal__Text">중복된 시간에 학생을 배정 하시겠습니까?</span>
                </div>
                <div className="DataCheckModal__ButtonWrap">
                    <button className="DataCheckModal__ButtonCancel" onClick={()=>{setShowModal(false)}}>취소하기</button>
                    <button className="DataCheckModal__ButtonConfirm" onClick={()=>{
                        setShowModal(false)
                        const header = {
                            headers:{
                                Authorization: `Bearer ${token}`
                            }
                        }
                        callback(data, header)}}>배정하기</button>
                </div>
            </div>
            <div className="UseModal__TopBottomStyle"></div>
        </div>
        </div>
    )
}

export default DataCheckModal;