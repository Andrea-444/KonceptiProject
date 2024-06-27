document.addEventListener('DOMContentLoaded', async function () {
    // Fetch the data
    const data = await fetchData('podatoci\\turizam.json');

    if (!data) {
        console.error('No data found');
        return;
    }

    var map = L.map('map').setView([41.9981, 21.4254], 8); // Adjust zoom level according to your preference

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map);

    const hotelIcon = L.icon({
        iconUrl: './images/hotel.png',
        iconSize: [32, 32], 
        iconAnchor: [16, 32], 
        popupAnchor: [0, -32] 
    });

    const theaterIcon = L.icon({
        iconUrl: './images/theater.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });

    const cinemaIcon = L.icon({
        iconUrl: './images/cinema.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });

    const museumIcon = L.icon({
        iconUrl: './images/museum.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });

    for (let category in data) {
        if (data.hasOwnProperty(category)) {
            data[category].forEach(location => {
                if (location.hasOwnProperty('Локација') && Array.isArray(location.Локација) && location.Локација.length === 2) {
                    const [latitude, longitude] = location.Локација;

                    // Determine which icon to use based on the category
                    let markerIcon;
                    switch (category) {
                        case 'Хотели':
                            markerIcon = hotelIcon;
                            break;
                        case 'Театри':
                            markerIcon = theaterIcon;
                            break;
                        case 'Кина':
                            markerIcon = cinemaIcon;
                            break;
                        case 'Музеи':
                            markerIcon = museumIcon;
                            break;
                        default:
                            markerIcon = null;
                    }

                    let popupContent = `<b>${location.Име}</b><br>Град: ${location.Град}<br>`;
                    if (category === 'Хотели') {
                        popupContent += `Број на соби: ${location['Бр.Соби']}<br>`;
                        popupContent += `Број на легла: ${location['Бр.Легла']}<br>`;
                    }
                    if(category === 'Театри'){
                        popupContent += `Број на прeтстави 2023: ${location['бр. претстави 2023']}<br>`;
                        popupContent += `Број на актери: ${location['бр.актери']}<br>`;
                    }

                    // Add marker to the map with the appropriate icon and popup
                    if (markerIcon) {
                        L.marker([latitude, longitude], { icon: markerIcon })
                            .addTo(map)
                            .bindPopup(popupContent);
                    } else {
                        L.marker([latitude, longitude])
                            .addTo(map)
                            .bindPopup(popupContent);
                    }
                }
            });
        }
    }

  // Create a custom legend control
var legend = L.control({ position: 'bottomleft' });

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'map-legend');
    div.innerHTML += '<h4>Легенда</h4>';
    div.innerHTML += '<ul>';
    div.innerHTML += '<li><span class="legend-marker hotel"></span> Хотел</li>';
    div.innerHTML += '<li><span class="legend-marker theater"></span> Театар</li>';
    div.innerHTML += '<li><span class="legend-marker cinema"></span> Кино</li>';
    div.innerHTML += '<li><span class="legend-marker museum"></span> Музеј</li>';
    div.innerHTML += '</ul>';
    return div;
};

legend.addTo(map); // Add legend to the map

//PRV NACIN SO BAR PLOT

// let hotelNames = [];
// let roomCounts = [];
// let bedCounts = [];


// Iterate through data categories
// for (let category in data) {
//     if (data.hasOwnProperty(category) && category === 'Хотели') {
//         data[category].forEach(hotel => {
//             hotelNames.push(hotel['Име']);
//             // hotelNames.push(`${hotel['Име']} - ${hotel['Град']}`);
//             roomCounts.push(hotel['Бр.Соби']);
//             bedCounts.push(hotel['Бр.Легла']);
//         });
//     }
// }

// Display Chart using Chart.js
// var ctx = document.getElementById('myChart').getContext('2d');
// var myChart = new Chart(ctx, {
//     type: 'bar',
//     data: {
//         labels: hotelNames,
//         datasets: [{
//             label: 'Број на соби',
//             data: roomCounts,
//             backgroundColor: 'rgba(54, 162, 235, 0.6)',
//             borderColor: 'rgba(54, 162, 235, 1)',
//             borderWidth: 1
//         }, {
//             label: 'Број на легла',
//             data: bedCounts,
//             backgroundColor: 'rgba(255, 99, 132, 0.6)',
//             borderColor: 'rgba(255, 99, 132, 1)',
//             borderWidth: 1
//         }]
//     },
//     options: {
//         scales: {
//             y: {
//                 beginAtZero: true,
//                 title: {
//                     display: true,
//                     text: 'Број на соби и легла'
//                 }
//             },
//             x: {
//                 title: {
//                     display: true,
//                     text: 'Хотели'
//                 }
//             }
//         }
//     }
// });

//KRAJ

//VTOR NACIN SO SCATTER PLOT

// let hotelData = [];

// // Iterate through data categories
// for (let category in data) {
//     if (data.hasOwnProperty(category) && category === 'Хотели') {
//         data[category].forEach(hotel => {
//             hotelData.push({
//                 name: hotel['Име'],
//                 city: hotel['Град'],
//                 rooms: hotel['Бр.Соби'],
//                 beds: hotel['Бр.Легла'],
//                 radius: 10
//             });
//         });
//     }
// }

// var ctx = document.getElementById('myChart').getContext('2d');
// var myChart = new Chart(ctx, {
//     type: 'scatter',
//     data: {
//         datasets: [{
//             label: 'Хотели',
//             data: hotelData.map(hotel => ({x: hotel.rooms, y: hotel.beds, radius: hotel.radius})),
//             backgroundColor: 'rgba(54, 162, 235, 0.6)',
//             borderColor: 'rgba(54, 162, 235, 1)',
//             borderWidth: 1,
//             pointRadius: function(context) {
//                 return context.raw.radius;
//             },
//             pointHoverRadius: function(context) {
//                 return context.raw.radius * 1.5; // Increase hover radius for better visibility
//             },
//             pointBackgroundColor: 'rgba(54, 162, 235, 0.6)'
//         }]
//     },
//     options: {
//         plugins: {
//             tooltip: {
//                 callbacks: {
//                     label: function(context) {
//                         const index = context.dataIndex;
//                         const hotel = hotelData[index];
//                         return `${hotel.name} - ${hotel.city}: ${hotel.rooms} соби, ${hotel.beds} легла`;
//                     }
//                 }
//             }
//         },
//         scales: {
//             x: {
//                 title: {
//                     display: true,
//                     text: 'Број на соби'
//                 },
//                 beginAtZero: true
//             },
//             y: {
//                 title: {
//                     display: true,
//                     text: 'Број на легла'
//                 },
//                 beginAtZero: true
//             }
//         }
//     }
// });

//KRAJ

let setCities = new Set();

function generateRandomColor() {
    const alpha = 0.4; 
    const randomColor = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${alpha})`;
    return randomColor;
}

let hotelData = [];

            // Iterate through data categories
            for (let category in data) {
                if (data.hasOwnProperty(category) && category === 'Хотели') {
                    data[category].forEach(hotel => {
                        hotelData.push({
                            name: hotel['Име'],
                            city: hotel['Град'],
                            rooms: hotel['Бр.Соби'],
                            beds: hotel['Бр.Легла'],
                            size: hotel['Бр.Легла']
                        });
                    
                            setCities.add(hotel['Град']);
                    });
                }
            }

            console.log(setCities);

            let cityColors = {};
            setCities.forEach(city => {
                cityColors[city] = generateRandomColor();
            });
        
            var ctx = document.getElementById('myChart').getContext('2d');
            var myChart = new Chart(ctx, {
                type: 'bubble',
                data: {
                    datasets: [{
                        label: 'Хотели',
                        data: hotelData.map(hotel => ({
                            x: hotel.rooms,
                            y: hotel.beds,
                            r: hotel.size / 10, 
                            city: hotel.city  
                        })),
                        backgroundColor: hotelData.map(hotel => cityColors[hotel.city]), 
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const hotel = hotelData[context.dataIndex];
                                    return `${hotel.name} - ${hotel.city}: ${hotel.rooms} соби, ${hotel.beds} легла`;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Број на соби'
                            },
                            beginAtZero: true
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Број на легла'
                            },
                            beginAtZero: true
                        }
                    }
                }
            });
            


// const legendContainer = document.getElementById('legend');
// legendContainer.innerHTML = '<h4>Легенда</h4>';
// setCities.forEach(city => {
//         const color = cityColors[city];
//         legendContainer.innerHTML += `<div><span class="legend-color" style="background-color: ${color};"></span> ${city}</div>`;
// });
        

let theaterNames = [];
let actorCounts = [];
let showCounts = [];
let theaterLocations = [];

for (let category in data) {
    if (data.hasOwnProperty(category) && category === 'Театри') {
        data[category].forEach(theater => {
            theaterNames.push(`${theater['Име']} - ${theater['Град']}`);
            actorCounts.push(parseInt(theater['бр.актери'], 10) || 0); // Default to 0 if parsing fails
            showCounts.push(parseInt(theater['бр. претстави 2023'], 10) || 0); // Default to 0 if parsing fails
            theaterLocations.push(theater['Локација']);
        });
    }
}

console.log('Theater Names:', theaterNames);
    console.log('Actor Counts:', actorCounts);
    console.log('Show Counts:', showCounts);

    var ctx = document.getElementById('circularBarChart').getContext('2d');
    var cicrcularChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: theaterNames,
            datasets: [{
                label: 'Број на актери',
                data: actorCounts,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }, {
                label: 'Број на претстави 2023',
                data: showCounts,
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Број на актери и претстави'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Театри'
                    }
                }
            }
        }
    });
});