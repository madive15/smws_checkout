import React from 'react';

interface IModalContentsProps {
  clickable:any
  modalText:string
}

const ModalContents = ({clickable,modalText}:IModalContentsProps) => {

  return (
    <div className="btn-wrap" style={{ display: "flex", flexDirection: "column" }}>
      <p style={{ textAlign: "center", fontSize: "20px" }}>{modalText}</p>
      <button
        type='button'
        className='button button--small'
        onClick={clickable}>
        <span>確認</span>
      </button>
    </div>

  );
};

export default ModalContents;