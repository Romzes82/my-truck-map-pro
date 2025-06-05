// import data from "./data.json"
import React, { useState, useEffect } from 'react';
import Content from './components/Content';
import { customRound } from './utils/math';

function App() {
    const [mapData, setMapData] = useState([]);

    // Обработчик сообщений
    useEffect(() => {
        const handleMessage = (event) => {
            // Важно: проверяем origin отправителя!

            if (event.origin !== 'http://localhost:3000') return;

            if (event.data?.type === 'UPDATE_TRUCK_MAP_DATA') {
                console.log('Получены данные:', event.data.payload);

                setMapData(event.data.payload);
            }
        };

        window.addEventListener('message', handleMessage);

        return () => window.removeEventListener('message', handleMessage);
    }, []);
    
// useEffect(() => {
//     const handleMessage = (event) => {
//         // 1. Проверяем origin отправителя (ваш случай)

//         if (event.origin !== 'http://localhost:3000') return; // Укажите правильный порт отправителя

//         // 2. Дополнительная проверка данных
//         if (!event.data || !event.data.type) return;

//         console.log('Получены данные:', event.data); // Для отладки

//         if (event.data.type === 'UPDATE_TRUCK_MAP_DATA') {
//             // 3. Валидация payload

//             if (Array.isArray(event.data.payload)) {
//                 setMapData(event.data.payload);
//             } else {
//                 console.error(
//                     'Некорректный формат данных:',
//                     event.data.payload
//                 );
//             }
//         }
//     };
//     window.addEventListener('message', handleMessage);

//     return () => window.removeEventListener('message', handleMessage);
// }, []);
    
    // useEffect(() => {
    //     const handleMessage = (event) => {
    //         // Проверяем origin в целях безопасности!

    //         if (event.origin !== 'http://localhost:3000') return; // Origin отправителя (home-vers-table)

    //         console.log(event.data.type);

    //         if (event.data.type === 'UPDATE_TRUCK_MAP_DATA') {
    //             console.log(event.data.payload);
    //             setMapData(event.data.payload); // Обновляем данные карты
    //         }
    //     };

    //     window.addEventListener('message', handleMessage);

    //     return () => window.removeEventListener('message', handleMessage);
    // }, []);

    // // const API_URL = 'http://localhost:3500/points';
    // // [username].github.io/[file-name].json
    // const API_URL = 'https://Romzes82.github.io/api/db.json';

    // useEffect(() => {
    //     fetch(API_URL)
    //         .then((response) => response.json())
    //         .then((data) => {
    //             setMapData(data); // Store the data in the component's state
    //             // console.log(data);
    //         })
    //         .catch((error) => console.error(error));
    // }, []);

    // добавим каждому объекту массива поле preset с цветом метки
    mapData.forEach((point) => {
        if (point['type'] === 'Москва и область') {
            point['preset'] = 'islands#blueIcon';
        } else {
            point['preset'] = 'islands#redIcon';
        }
        // заменим в mapData в координатах "," на ".""
        point['latitude'] = point['latitude'].replace(/,/g, '.');
        point['longitude'] = point['longitude'].replace(/,/g, '.');
        const lat = customRound(point['latitude'], 3);
        const lon = customRound(point['longitude'], 3);
        // проверка наложения друг на друга меток
        mapData.forEach((inner_point) => {
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
            <Content data={mapData} />
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
