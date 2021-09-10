import "./useModal.css";

function UseModal({title, setShowModal}){

    return(
        <div className="UseModal">
            <div className="UseModal__ContentsWrap">
                <div className="UseModal__TopBottomStyle"></div>
                <div className="UseModal__BackButtonWrap">
                    <button className="UseModal__BackButton" onClick={()=>{setShowModal(false)}}>X</button>
                </div>
                <div className="UseModal__Contents">
                    <div className="UseModal__TextWrap">
                        <span className="UseModal__Text">{title}</span>
                    </div>
                </div>
                <div className="UseModal__TopBottomStyle"></div>
            </div>
        </div>
    )
}

export default UseModal;