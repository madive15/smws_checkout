import React from 'react';

const RedierctCart = () => {

  const goBack = () => {
    window.history.back();
  }

  return (
    <>
      <p
        style={{
          fontSize:"24px",
        }}
      >ボトルあるいはグッズはイベントと共に購入できません。カートからどちらかの商品を削除してご注文ください。<a style={{
        fontWeight:"bold"
      }} href="#" onClick={goBack} >戻る</a></p>
    </>
  );
};

export default RedierctCart;