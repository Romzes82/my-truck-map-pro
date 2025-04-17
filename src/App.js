// import data from "./data.json"
import React, { useState, useEffect } from 'react';
import Content from './components/Content';
import { customRound } from './utils/math';

function App() {
    const [data, setData] = useState([]);

    // const API_URL = 'http://localhost:3500/points';
    // [username].github.io/[file-name].json
    const API_URL = 'https://Romzes82.github.io/api/db.json';

    useEffect(() => {
        fetch(API_URL)
            .then((response) => response.json())
            .then((data) => {
                setData(data); // Store the data in the component's state
                // console.log(data);
            })
            .catch((error) => console.error(error));
    }, []);

    // добавим каждому объекту массива поле preset с цветом метки
    data.forEach((point) => {
        if (point['type'] === 'Москва и область') {
            point['preset'] = 'islands#blueIcon';
        } else {
            point['preset'] = 'islands#redIcon';
        }
        // заменим в data в координатах "," на ".""
        point['latitude'] = point['latitude'].replace(/,/g, '.');
        point['longitude'] = point['longitude'].replace(/,/g, '.');
        const lat = customRound(point['latitude'], 3);
        const lon = customRound(point['longitude'], 3);
        // проверка наложения друг на друга меток
        data.forEach((inner_point) => {
            if (
                inner_point['id'] !== point['id'] &&
                customRound(inner_point['latitude'], 3) - lat === 0 &&
                customRound(inner_point['longitude'], 3) - lon === 0
            ) {
                console.log(
                    ` совпали метки ( ${lat},  ${lat} ) - метка ${inner_point['id']} и метка ${point['id']} `
                );
                // point['latitude'] = point['latitude'] + 0.01;
                // console.log(point['latitude']);
            }
        });
    });

    return (
        <div className="App">
            <Content data={data} />
            {/* {data.map((item, index) => (
             <div className="card" key={index}>
                 <div>{item.номер}</div>
                 <div>{item.адрес}</div>
                 <div>{item.клиент}</div>
             <hr/>
             </div>
         ))} */}
        </div>
    );
}

export default App;
