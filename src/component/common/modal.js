import React from 'react';

import './modal.css';

function Modal({Header, Body, Footer, onClose}){

  return(
    <>
      <div className="Modal">
        <div className="ModalContentsWrap">
          <div className="ModalContents">
            <div className="ModalCloseBtn">
              <span onClick={onClose}>&#215;</span>
            </div>
            
            <div className="ModalHeader">
              {Header}
            </div>

            <div className="ModalBody">
              {Body}
            </div>

            <div className="ModalFooter">
              {Footer}
            </div>

          </div>
        </div>

        <div className="ModalLayer"></div>
      </div>
    </>
  )
}

export default Modal;