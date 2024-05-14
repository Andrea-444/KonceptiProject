if (window.outerWidth < 700) {
    const graf = document.getElementsByClassName('distGraph')[0]
    graf.innerHTML = `<canvas id="pillarGraph" width="0" height="30"></canvas>`
} else {
    const graf = document.getElementsByClassName('distGraph')[0]
    graf.innerHTML = `<canvas id="pillarGraph" width="30" height="30"></canvas>`
}

maptilersdk.config.apiKey = '28X7x2vtR4iZb6S98Fot';

const map = new maptilersdk.Map({
    container: 'map', // container's id or the HTML element to render the map
    // style: maptilersdk.MapStyle.STREETS,
    style: maptilersdk.MapStyle.DATAVIZ.DARK,
    center: [21.74, 41.60], // starting position [lng, lat]
    zoom: 8, // starting zoom
});

const listKeys = [
    "bbd6addb-69a4-4edb-b5a4-aaf2d7fb1cdc", //skopje
    "3173a69d-a9fe-4154-a8e7-4775d10a6dc2", //bitola
    "5360e35b-32a3-466e-9b86-13aae6e686a3", //ohrid
    "593279f4-a75a-444b-b956-dc4779dac915"  //prilep
]
const listColors = [
    "#2b6c2b",
    "#02027a",
    "#7e007e",
    "#730101",
    "#FFFF00",
    "#00FFFF",
    "#800080",
    "#008080",
    "#FFA500",
    "#008000"
]

map.on('load', async function () {
    for (let i = 0; i < listKeys.length; i++) {
        let geojson = await maptilersdk.data.get(listKeys[i]);
        let name = 'Macedonia_' + i
        map.addSource(name, {
            type: 'geojson',
            data: geojson
        });
        map.addLayer({
            'id': name,
            'type': 'fill',
            'source': name,
            'layout': {},
            'paint': {
                'fill-color': listColors[i],
                'fill-opacity': 0.5
            }
        });
    }
});





const data = {
    labels: ['Skopje', 'Bitola', 'Ohrid', 'Prilep'],
    datasets: [{
        label: 'Povrsina',
        backgroundColor: [listColors[0], listColors[1], listColors[2], listColors[3]], // Bar color
        borderColor: 'rgb(58,100,45)',
        borderWidth: 2,
        data: [150, 70, 60, 65] // Data values
    }]
};

// Configuration options
const options = {
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true,
                fontColor: 'white', // Set text color to white
            },
            gridLines: {
                color: 'rgba(255, 255, 255, 0.2)' // Set grid line color to white with some opacity
            }
        }],
        xAxes: [{
            ticks: {
                fontColor: 'white', // Set text color to white
            },
            gridLines: {
                color: 'rgba(255, 255, 255, 0.2)' // Set grid line color to white with some opacity
            }
        }]
    }
};



// Get the context of the canvas element we want to select
const ctx = document.getElementById('pillarGraph').getContext('2d');

// Create the pillar graph
const myPillarGraph = new Chart(ctx, {
    type: 'bar',
    data: data,
    options: options
});