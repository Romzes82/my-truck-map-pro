import React from 'react'

const LeftSide = (props) => {
    const { data } = props;
    
    


  return (
      <div className="side side_left">
          <h2 className="side_title">Доставки</h2>
          <hr />
          <ul className="myListDeliveryLeft"></ul>
      </div>
  );
}

export default LeftSide
