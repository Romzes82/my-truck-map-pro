import React from 'react';
import { customRound } from '../utils/math';

const TrucksItem = (props) => {
    const { item = [], index, removeTruck = Function.prototype } = props;
    // [{id:1},{id:2}]
    let sumKg = 0;
    let sumValue = 0;
    let sumPal = 0;


    // console.log(customRound(2.675, 2)); // 2.68, совершенная точность!

    // console.log('calc(value)' + calc('value')());

    return (
        <div>
            <li className="collection-item">
                <div id={`collection-item-${index+1}`}>
                    {/* {id}, {weight} кг */}
                    авто {index + 1}) точки: &nbsp;
                    <span className="red-text">
                        {item.map((point, index) => {
                            sumKg = sumKg + point.weight * 1;
                            sumValue =
                                sumValue +
                                customRound(
                                    point.volume.replace(/,/g, '.') * 1,
                                    2
                                );
                            sumPal = sumPal + point.pallet * 1;
                            return index === item.length - 1
                                ? point.id
                                : point.id + ', ';
                            // index point.length;
                        })}
                    </span>
                    &nbsp; - {sumKg} кг || {customRound(sumValue, 2)} м3 ||{' '}
                    {sumPal} паллет
                    <span className="secondary-content">
                        <i
                            className="material-icons truck-delete"
                            onClick={()=>removeTruck(index)}
                        >
                            close
                        </i>
                    </span>
                </div>
            </li>
        </div>
    );
};

export default TrucksItem;
