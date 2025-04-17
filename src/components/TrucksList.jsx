import React from 'react';
import TrucksItem from './TrucksItem';

const TrucksList = (props) => {
    const {
        trucks = [],
        handleModalTrucksShow = Function.prototype,
        removeTruck = Function.prototype,
    } = props;
    // [[{id:1},{id:2}] , [{id:3},{id:4}]]
    // console.log('in TrucksList ' + trucks.length);

    const downloadTxt = (filename, array) => {
        const txtContent = array
            .map((row) =>
                row
                    // .map((field) => `"${field.toString().replace(/"/g, '""')}"`)
                    .map((field) => field.id)
                    .join(',')
            )
            .join('\n');

        const blob = new Blob([txtContent], {
            type: 'text;charset=utf-8;',
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const date = new Date();
    const date_name = `${date.getDate()}_${
        date.getMonth() + 1
    }_${date.getFullYear()}_${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}`;
    console.log(date_name);
    

    // downloadCsv('export.txt', trucks); //[[1,2,20],[10,3,4]]);

    return (
        <div>
            <ul className="collection with-header trucks-list">
                <i
                    className="material-icons trucks-list-save"
                    onClick={() =>
                        downloadTxt(`trucks_list_${date_name}.txt`, trucks)
                    }
                >
                    save
                </i>
                <li className="collection-header active">
                    <h2
                        className="collection-header-title"
                        // onClick={() => downloadTxt('name.txt', trucks)}
                    >
                        Список авто
                    </h2>
                    {/* <button
                        style={{}}
                        onClick={() => downloadTxt('name.txt', trucks)}
                    >
                        save in txt
                    </button> */}
                </li>
                <div className="trucks-list-scroll">
                    {trucks.length ? (
                        trucks.map((item, index) => {
                            // console.log('---');
                            // console.log(item);
                            return (
                                <TrucksItem
                                    key={index}
                                    item={item}
                                    index={index}
                                    removeTruck={removeTruck}
                                />
                            );
                        })
                    ) : (
                        <li className="collection-item">Список пуст</li>
                    )}
                </div>

                <i
                    className="material-icons trucks-list-close"
                    onClick={handleModalTrucksShow}
                >
                    close
                </i>
            </ul>
        </div>
    );
};

export default TrucksList;
