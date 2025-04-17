import React from 'react';
import LeftSide from './LeftSide';
import CenterSide from './CenterSide';
import RightSide from './RightSide';

    
// ?сделать два объекта/массива МиО и ТК и отправлять пропсами в LeftSide, RightSide
// в CenterSide отправлять состояние data целиком

const Content = (props) => {
  const { data } = props;
  return (
      <main className="conteiner">
          <LeftSide data={data} />
          <CenterSide data={data} />
          <RightSide data={data} />
      </main>
  );
}

export default Content
