import React, { useEffect, useState } from 'react';
import { API_MAP_KEY, API_MAP_URL } from '../config';
import HeaderMap from './HeaderMap';
import TrucksList from './TrucksList';

const CenterSide = (props) => {
 
    const { data } = props;

//    data - это массив:
//    console.log(Array.isArray(data));
     
    // https://www.mousedc.ru/learning/522-massiv-steyt-react/?ysclid=m3hcvf4nps534188601
    const [isLoadedScriptApi, setIsLoadedScriptApi] = useState(false);
    const [trucks, setTracks] = useState([]); // состояние-массив объектов "авто" со своими точками. Оно будет в модалке от клика по Тракс

    let pointsSelected=[];

    const [isModalTrucksShow, setModalTrucksShow] = useState(false);

    const handleModalTrucksShow = () => {
        setModalTrucksShow(!isModalTrucksShow);
    };
    
    const addTruck = () => {
        if (pointsSelected.length === 0) return;
        const newTruck = pointsSelected.map((point) => {
            return {
                ...data[point - 1],
                // cuantity: data[point - 1].cuantity + 1,
            };
        });
        // console.log('newTruck ' + newTruck[0].client);
        setTracks(trucks => [...trucks, newTruck]);

        pointsSelected=[];

    };

    // функция удаления авто из списка авто. Серыми будут все метки с полем quantity <> 0
    const removeTruck = (itemId) => {
        console.log('id ' + itemId);
        const newTruck = trucks.filter((el, index) => {
            return index !== itemId;
            // у того эл-та у которого id равен переданному в ф-ю id вернется false и он не будет добавлен в новоиспеченный массив newOrder
        });
        setTracks(newTruck);
    };

    // функция одидания загрузки на странице api maps 2.1
    function fetchScript() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');

            script.type = 'text/javascript';
            script.onload = resolve;
            script.onerror = reject;
            script.src = `${API_MAP_URL}?apikey=${API_MAP_KEY}&lang=ru_RU`;
            // script.src = 'https://yandex.st/jquery/2.2.3/jquery.min.js';
            script.async = 'async';

            document.head.appendChild(script);
        });
    }

    // загрузка скрипта на странице
    useEffect(() => {
        fetchScript().then(() => setIsLoadedScriptApi(true));
    }, []);

    // создаем карту из подгруженного ymaps.Map
    const createMap = () => {
        try {
            window.ymaps.ready(() => {
                const newMap = new window.ymaps.Map(
                        'customMap',
                        { center: [55.76, 37.64], zoom: 10, controls: [] }
                    ),
                    rightButton = new window.ymaps.control.Button('Send');

                newMap.controls.add(rightButton, {
                    float: 'right',
                    selectOnClick: false,
                });

                const myCollection = new window.ymaps.GeoObjectCollection(
                    {},
                    {
                        //preset: 'islands#redIcon', //все метки красные
                        draggable: true, // и их можно перемещать
                        balloonPanelMaxMapArea: Infinity,
                        //блокировка открытия балуна
                        //openBalloonOnClick: false
                        // Отключаем кнопку закрытия балуна.
                        //balloonCloseButton: false,
                        // Балун будем открывать и закрывать кликом по иконке метки.
                        //hideIconOnBalloonOpen: false
                    }
                );

                const callbackForTruckDelete = (e) => {
                    if (
                        !e.target.parentElement.parentElement.id.match(
                            /collection-item-.*/
                        ) ||
                        e.button !== 0
                    )
                        return;

                    const IdTemp = e.target.parentElement.parentElement.id;
                    const arrStr = document
                        .getElementById(IdTemp)
                        .getElementsByTagName('span')[0].textContent;

                    const arr = arrStr.split(',');
                    // сортировка т.к. будем иметь дело с итератором от 1 до ...
                    arr.sort();
                    arr.forEach((element) => {
                        // Найдем в коллекции геообъект с геометрией "Ломаная линия".
                        let iterator = myCollection.getIterator(),
                            object;
                        element = element.trim();
                        while (
                            (object = iterator.getNext()) !==
                            iterator.STOP_ITERATION
                        ) {
                            if (
                                object.geometry.getType() === 'Point' &&
                                element === object.properties.get('iconContent')
                            ) {
                                // let tempPreset = data[element-1]['preset']; //object.options.get('preset');
                                object.options.set(
                                    'preset',
                                    data[element - 1]['preset']
                                    // tempPreset
                                    // data[element]['preset']
                                );
                                object.properties._data.activeFlag = false;
                                break;
                            }
                        }
                    });
                    subscribePlacemarkClick(arr);
                };

                // найдем на странице списки левый и правый
                let listLeft =
                    document.getElementsByClassName('myListDeliveryLeft');
                // document.addEventListener('click', () => callback(['3', '5']));
                document.addEventListener('mousedown', (e) => {
                    callbackForTruckDelete(e);
                });
                let listRight = document.getElementsByClassName(
                    'myListDeliveryRight'
                );

                let varForBalloonContentBodyAndHintContent;

                //заполняем левый и правый списки
                for (let i = 0; i < data.length; i++) {
                    const li = document.createElement('li');
                    li.id = i + 1;
                    const hr = document.createElement('hr');
                    li.setAttribute('tabindex', '0');
                    li.addEventListener('focus', (e) => hendleFocusLi(e));
                    li.addEventListener('blur', (e) => hendleUnFocusLi(e));
                    // пока отключил из-за конфликта закрашиваний
                    // похоже решение конфликта можно осуществить через type = e.get('type');
                    // li.addEventListener('mouseover', (e) => hendleFocusLi(e));
                    // li.addEventListener('mouseout', (e) => hendleUnFocusLi(e));

                    if (data[i]['type'] === 'Москва и область') {
                        li.innerText =
                            '- ' + data[i]['id'] + ') ' + data[i]['address'];
                        li.title = data[i]['client'];
                        listLeft[0].appendChild(li);
                        listLeft[0].appendChild(hr);
                        varForBalloonContentBodyAndHintContent =
                            data[i]['client'];
                    } else {
                        li.innerText =
                            '- ' + data[i]['id'] + ') ' + data[i]['address'];
                        li.title = data[i]['info'];
                        listRight[0].appendChild(li);
                        listRight[0].appendChild(hr);
                        varForBalloonContentBodyAndHintContent =
                            data[i]['type'];
                    }
                }

                // вынужденно объявленная глобальная переменная
                let startPreset;

                const hendleFocusLi = (event) => {
                    if (event.target.hasFocus === true) {
                        return;
                    }
                    event.target.hasFocus = true;
                    const num = event.target.id;
                    let iterator = myCollection.getIterator(),
                        object;

                    while (
                        (object = iterator.getNext()) !==
                        iterator.STOP_ITERATION
                    ) {
                        if (
                            object.geometry.getType() === 'Point' &&
                            num === object.properties.get('iconContent')
                        ) {
                            startPreset = object.options.get('preset');
                            object.options.set('preset', 'islands#greenIcon');
                            break;
                        }
                    }
                };

                const hendleUnFocusLi = (event) => {
                    if (event.target.hasFocus === false) {
                        return;
                    }
                    event.target.hasFocus = false;
                    const num = event.target.id;
                    let iterator = myCollection.getIterator(),
                        object;

                    while (
                        (object = iterator.getNext()) !==
                        iterator.STOP_ITERATION
                    ) {
                        if (
                            object.geometry.getType() === 'Point' &&
                            num === object.properties.get('iconContent')
                        ) {
                            object.options.set('preset', startPreset);
                            break;
                        }
                    }
                };

                // заполнение меток совйствами и складывание их в колллекцию
                for (let i = 0; i < data.length; i++) {
                    if (data[i]['type'] === 'Москва и область') {
                        varForBalloonContentBodyAndHintContent =
                            data[i]['client'];
                    } else {
                        varForBalloonContentBodyAndHintContent =
                            data[i]['type'];
                    }
                    myCollection.add(
                        new window.ymaps.Placemark(
                            [
                                // data[i]['latitude'].replace(/,/g, '.'),
                                // data[i]['longitude'].replace(/,/g, '.'),
                                data[i]['latitude'],
                                data[i]['longitude'],
                            ],
                            {
                                hintContent:
                                    data[i]['weight'] +
                                    ', ' +
                                    data[i]['volume'] +
                                    ', ' +
                                    data[i]['pallet'] +
                                    '<br/>' +
                                    varForBalloonContentBodyAndHintContent,
                                iconContent: data[i]['id'],
                                balloonContentBody: [
                                    '<address>',
                                    '<strong>' + data[i]['info'] + '</strong>',
                                    '<br/>',
                                    '<hr/>',
                                    '' +
                                        data[i]['weight'] +
                                        ' кг, ' +
                                        data[i]['volume'] +
                                        ' куб.м., ' +
                                        data[i]['pallet'] +
                                        ' паллет' +
                                        '',
                                    '<br/>',
                                    '<hr/>',
                                    '' +
                                        varForBalloonContentBodyAndHintContent +
                                        '',
                                    '</address>',
                                ].join(''),
                                volumeInPallet: data[i]['volumeInPallet'],
                                weight: data[i]['weight'],
                                volume: data[i]['volume'],
                                pallet: data[i]['pallet'],
                                activeFlag: false,
                                typeDelivery: data[i]['type'],
                                dopInfo: data[i]['info'],
                                varHintAndBody:
                                    varForBalloonContentBodyAndHintContent,
                            },
                            {
                                preset: data[i]['preset'],
                            }
                        )
                    );
                }

                //добавлеяем колбэк слушателя на коллекцию это для калькуляции и окраску+флаг активных меток
                const calc = document.getElementsByClassName('calculator');

                let sum_kg = 0;
                let sum_kub = 0;
                let sum_pal = 0;
                let sum_val_in_pal = 0;
                let operand;

                const subscribePlacemarkClick = (numbersOfPoints) => {
                    numbersOfPoints.sort().forEach((element) => {
                        // Найдем в коллекции геообъект с геометрией "Point".
                        let iterator = myCollection.getIterator(),
                            object;
                        element = element.trim();
                        while (
                            (object = iterator.getNext()) !==
                            iterator.STOP_ITERATION
                        ) {
                            if (
                                object.geometry.getType() === 'Point' &&
                                element === object.properties.get('iconContent')
                            ) {
                                
                                object.properties._data.activeFlag = false;
                                object.events.add(
                                    ['click'],
                                    hendleClickPlacemark
                                );
                                break;
                            }
                        }
                    });
                };

                const UnSubscribePlacemarkClick = (numbersOfPoints) => {
                    numbersOfPoints.sort().forEach((element) => {
                        let iterator = myCollection.getIterator(),
                            object;
                        element = element.trim();
                        while (
                            (object = iterator.getNext()) !==
                            iterator.STOP_ITERATION
                        ) {
                            if (
                                // true
                                object.geometry.getType() === 'Point' &&
                                element === object.properties.get('iconContent')
                            ) {
                                object.events.remove(
                                    'click',
                                    hendleClickPlacemark
                                );
                                break;
                            }
                        }
                    });
                };

                // стартовая инициализация подписки всех меток коллекции
                const lengthCol = myCollection.getLength();
                (() => {
                    let tempArr = [];
                    for (let i = 1; i <= lengthCol; i++) {
                        tempArr.push('' + i);
                    }
                    subscribePlacemarkClick(tempArr);
                })();

                function hendleClickPlacemark(e) {
                    let object = e.get('target');
                    object.properties._data.activeFlag =
                        !object.properties._data.activeFlag;
                    const tempPreset =
                        object.properties._data.typeDelivery ===
                        'Москва и область'
                            ? 'islands#blueIcon'
                            : 'islands#redIcon';

                    if (object.properties._data.activeFlag === false) {
                        object.options.set('preset', tempPreset);
                        pointsSelected = pointsSelected.filter(
                            (number) =>
                                number !== object.properties._data.iconContent
                        );
                    } else {
                        object.options.set('preset', 'islands#nightCircleIcon');
                        pointsSelected.push(
                            object.properties._data.iconContent
                        );
                    }

                    if (object.properties._data.activeFlag) {
                        operand = 1;
                    } else {
                        operand = -1;
                    }
                    let rez = '';
                    calc[0].innerHTML = '';

                    sum_kg = sum_kg + object.properties._data.weight * operand;
                    sum_kub =
                        sum_kub +
                        object.properties._data.volume.replace(/,/g, '.') *
                            operand;
                    sum_kub = sum_kub.toFixed(1) * 1;
                    sum_pal =
                        sum_pal + object.properties._data.pallet * operand;
                    sum_val_in_pal =
                        sum_val_in_pal +
                        object.properties._data.volumeInPallet.replace(
                            /,/g,
                            '.'
                        ) *
                            operand;
                    sum_val_in_pal = sum_val_in_pal.toFixed(1) * 1;
                    rez = `${sum_kg} кг | ${sum_kub} м3 | ${sum_pal} пал ( ${sum_val_in_pal} м3)`;
                    calc[0].innerHTML += rez;
                }

                // Добавление коллекции на карту.
                newMap.geoObjects.add(myCollection);

                // Устанавливаем центр и масштаб карты так, чтобы отобразить всю коллекцию целиком.
                newMap.setBounds(myCollection.getBounds());

                rightButton.events.add('click', () => {
                    pointsSelected.sort().forEach((element) => {
                        // Найдем в коллекции геообъект с геометрией "Point".
                        let iterator = myCollection.getIterator(),
                            object;
                        element = element.trim();
                        while (
                            (object = iterator.getNext()) !==
                            iterator.STOP_ITERATION
                        ) {
                            if (
                                object.geometry.getType() === 'Point' &&
                                element === object.properties.get('iconContent')
                            ) {
                                object.options.set(
                                    'preset',
                                    'islands#grayCircleIcon'
                                );
                                object.balloon.close();
                                break;
                            }
                        }
                    });
                    UnSubscribePlacemarkClick(pointsSelected);
                    addTruck(pointsSelected);
                    sum_kg = 0;
                    sum_kub = 0;
                    sum_pal = 0;
                    sum_val_in_pal = 0;
                    calc[0].innerHTML = `0 кг | 0 м3 | 0 пал ( 0 м3)`;
                });
            });
        } catch (error) {
            console.log('error is', error);
        }
    };

    // если скрипт карты подключен, рендерим проинициализированную карту
    useEffect(() => {
        if (isLoadedScriptApi) {
            createMap();
            // и подгружаем данные? или раньше - скорее всего раньше надо это делать, перед  createMap(), а в креайт добавлять в
            // мап коллекцию меток
            // coords = data;
        }
        // eslint-disable-next-line
    }, [isLoadedScriptApi]);

    return (
        <>
            <div className="side center_side">
                <HeaderMap
                    quantity={trucks.length}
                    handleModalTrucksShow={handleModalTrucksShow}
                />
                {isModalTrucksShow && (
                    <TrucksList
                        trucks={trucks}
                        handleModalTrucksShow={handleModalTrucksShow}
                        removeTruck={removeTruck}
                    />
                )}
                <div id="customMap"></div>
                {/* напишем элементы, которые раскидаем по карте на карте */}
            </div>
        </>
    );
};

export default CenterSide;