import "./confirmModal.css";

function ConfirmModal({title, content, callback}){

    return(
        <div className="ConfirmModal">
            <div className="ConfirmModal__ContentsWrap">
                <div className="ConfirmModal__TopBottomStyle"></div>
                <div className="ConfirmModal__TitleWrap">
                    <span className="ConfirmModal__Text">{title}</span>
                </div>
                <div className="ConfirmModal__Contents">
                    <div className="ConfirmModal__TextWrap">
                        <span className="ConfirmModal__Text">{content}</span>
                    </div>
                </div>
                <div className="ConfirmModal__ControlButtonWrap">
                    <button className="ConfirmModal__ButtonConfirm" onClick={callback}>확인</button>
                </div>
                <div className="ConfirmModal__TopBottomStyle"></div>
            </div>
        </div>
    )
}

export default ConfirmModal;