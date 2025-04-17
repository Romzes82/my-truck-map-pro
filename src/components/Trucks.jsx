import React from 'react'

const Trucks = (props) => {
    const { quantity = 0, handleModalTrucksShow = Function.prototype } = props;
    return (
        <div
            className="truck darken-4 black-text"
            onClick={handleModalTrucksShow}
        >
            <i className="material-icons">local_shipping</i>
            {quantity ? (
                <span className="truck-quantity">{quantity}</span>
            ) : null}
        </div>
    );
}

export default Trucks
