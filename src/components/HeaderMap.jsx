import React from 'react';
import Trucks from './Trucks';
import Calculator from './Calculator';

const HeaderMap = (props) => {
    const { quantity = 0, handleModalTrucksShow = Function.prototype} = props;
    return (
        <>
            <div className="header_center_side">
                <Calculator />
                <Trucks
                    quantity={quantity}
                    handleModalTrucksShow={handleModalTrucksShow}
                />
            </div>
        </>
    );
};

export default HeaderMap;
