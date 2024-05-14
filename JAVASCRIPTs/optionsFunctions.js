const optionsDisplay = document.getElementsByClassName('optionsDisplay')[0]
const displays = {
    "Locations": `<div id="optionsMapLoc"></div>`,
    "Area": `<div style="font-size: 5rem">Area</div>`,
    "Statistics": `<div id="statisticsOption">
            <div id="optionsStatistics">
            
            </div>
            <div id="optionsStatisticsList">
                <div onclick="displayStat(this, 'timeline')" class="statisticsList selected"><i class="fa-solid fa-sliders"></i></div>
                <div onclick="displayStat(this, 'pillars')" class="statisticsList"><i class="fa-solid fa-chart-simple"></i></div>
                <div onclick="displayStat(this, 'pie')" class="statisticsList"><i class="fa-solid fa-circle-half-stroke"></i></div>
                <div onclick="displayStat(this, 'graph')" class="statisticsList"><i class="fa-solid fa-arrow-trend-up"></i></div>
                <div onclick="displayStat(this, 'notes')" class="statisticsList"><i class="fa-solid fa-address-book"></i></div>
            </div>
        </div>`,
}
const minSize = Math.min(optionsDisplay.offsetWidth, optionsDisplay.offsetHeight) * 0.9 // GOLEMINA na piechart
const statDisplays = {
    "timeline": `<div class="timeline">
    <div class="timelineDim">
        <div class="indent">
            <h1>Timeline</h1>
            <div class="textBox">
                <h4>Macedonia</h4>
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
            </div>
            <div class="line">
                <div class="lineInfo" id="info1">
                    <div class="date">2016</div>
                    <div class="textBox">
                        <h4>Macedonia</h4>
                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                    </div>
                </div>
                <div class="lineInfo" id="info2">
                    <div class="date">2017</div>
                    <div class="textBox">
                        <h4>Republic Macedonia</h4>
                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                    </div>
                </div>
                <div class="lineInfo" id="info3">
                    <div class="date">2018</div>
                    <div class="textBox">
                        <h4>Republic North Macedonia</h4>
                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. It is a long established fact that a reader will be distracted.</p>
                    </div>
                </div>
                <div class="lineInfo" id="info4">
                    <div class="date">2019</div>
                    <div class="textBox">
                        <h4>Republic North Macedonia</h4>
                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.</p>
                    </div>
                </div>
                <div class="lineInfo" id="info5">
                    <div class="date">2020</div>
                    <div class="textBox">
                        <h4>Republic North Macedonia</h4>
                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>`,
    "pillars": `<div style="font-size: 5rem">Pillar</div>`,
    "pie": `<div id="optionsPieChart" class="flex">
                <div id="optionsPieChartText" class="flex">
                    <h1>Legend</h1>
                </div>
                <svg width="${minSize}" height="${minSize}" id="pie-chart"></svg>
            </div>`,
    "graph": `<canvas id="movingLineChart" width="400" height="200"></canvas>`,
    "notes": `<div style="font-size: 5rem">notes</div>`,
}

function removeDisplayed() {
    const options = document.getElementsByClassName('displayed')
    for (let option of options) {
        option.classList.remove('displayed')
    }
}

function changeDisplay(btn) {
    if (btn.classList.contains('displayed')) return
    removeDisplayed()
    btn.classList.add('displayed')

    optionsDisplay.innerHTML = displays[btn.innerHTML.toString()]

    if (btn.innerHTML.toString() === 'Statistics') {
        const optDis = document.getElementById('optionsStatistics')
        optDis.innerHTML = statDisplays['timeline'] // SO PRVO DA SE POKAZUVA
    } else if (btn.innerHTML.toString() === 'Locations') {
        spawnMap()
    }
}

function removeSelected() {
    const selected = document.getElementsByClassName('selected')
    for (let selectedElement of selected) {
        selectedElement.classList.remove('selected')
    }
}

function displayStat(btn, stat) {
    if (btn.classList.contains('selected')) return
    removeSelected()
    btn.classList.add('selected')

    const optDis = document.getElementById('optionsStatistics')
    optDis.innerHTML = statDisplays[stat]

    if (stat === 'pie') {
        spawnPieChart()
    } else if (stat === 'graph') {
        makeMovingLine()
    }
}



// MAPA LOCATIONS MAPA LOCATIONS MAPA LOCATIONS MAPA LOCATIONS MAPA LOCATIONS
// MAPA LOCATIONS MAPA LOCATIONS MAPA LOCATIONS MAPA LOCATIONS MAPA LOCATIONS
// MAPA LOCATIONS MAPA LOCATIONS MAPA LOCATIONS MAPA LOCATIONS MAPA LOCATIONS
maptilersdk.config.apiKey = '28X7x2vtR4iZb6S98Fot';
const listaMarkers = {
    "Centar": [21.74, 41.60],
    "Prilep": [21.565, 41.37],
    "Bitola": [21.34, 41.05],
    "Skopje": [21.44, 42.02],
}

function spawnMap() {
    const optionsMapLoc = new maptilersdk.Map({
        container: 'optionsMapLoc', // container's id or the HTML element to render the map
        style: maptilersdk.MapStyle.DATAVIZ.DARK,
        center: [21.74, 41.60], // starting position [lng, lat]
        zoom: 8, // starting zoom
    });

    for (let listaMarkersKey in listaMarkers) {
        let coords = listaMarkers[listaMarkersKey]
        const marker = new maptilersdk.Marker({
            color: "#ce4444",
            draggable: false
        }).setLngLat(coords)
            .setPopup(new maptilersdk.Popup().setHTML(listaMarkersKey))
            .addTo(optionsMapLoc);
    }
}
spawnMap()



// MAKE PIE CHART MAKE PIE CHART MAKE PIE CHART MAKE PIE CHART
// MAKE PIE CHART MAKE PIE CHART MAKE PIE CHART MAKE PIE CHART
function putDataInLegend(pieData) {
    const putin = document.getElementById('optionsPieChartText')
    let sum = pieData.map(x => x.value).reduce((a, b) => a + b);
    let percentages = []
    pieData.forEach(data => {
        if (data.value !== 0) {
            let perc = parseInt((data.value / sum) * 100)
            percentages.push(perc)
            putin.innerHTML += `<div>${data.label}: value=${data.value}, percentage=${perc}%</div>`
        }
    })

    // TO GET TO 100%
    let percSum = percentages.reduce((a,b) => a + b)
    if (percSum !== 100) {
        let elem = putin.getElementsByTagName('div')[0];
        let innerHTML = elem.innerText
        let tmp = innerHTML.substring(0, innerHTML.length - 1 - percentages[0].toString().length);
        let newVar = 100 - percSum + percentages[0];
        elem.innerText = tmp + newVar.toString() + "%"
    }

}
function spawnPieChart() {
    // Sample data for the pie chart
    const pieData = [
        { label: 'M', value: 0 },
        { label: 'Skopje', value: 80 },
        { label: 'Prilep', value: 30 },
        { label: 'Bitola', value: 30 },
        { label: 'Ohrid', value: 35 }
    ];
    putDataInLegend(pieData)

// Set up dimensions and radius for the pie chart
    const width = minSize;
    const height = minSize;
    const radius = Math.min(width, height) / 2;

// Set up color scale with green shades
    const color = d3.scaleOrdinal()
        .domain(pieData.map(d => d.label))
        .range(d3.schemeGreens[pieData.length]);         //MENUVAJNE NA BOJA

// Create the pie chart layout
    const pie = d3.pie()
        .value(d => d.value)
        .sort(null);

// Define arc generator
    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

// Create SVG element
    const svg = d3.select("#pie-chart")
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

// Draw the pie chart
    const arcs = svg.selectAll(".arc")
        .data(pie(pieData))
        .enter()
        .append("g")
        .attr("class", "arc");

// Add gradients
    const gradients = arcs.append("linearGradient")
        .attr("id", (d, i) => `gradient${i}`)
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", "100%")
        .attr("y2", "100%");

    gradients.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", (d, i) => d3.rgb(color(i)).brighter(0));

    gradients.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", color);

    arcs.append("path")
        .attr("d", arc)
        .attr("fill", (d, i) => `url(#gradient${i})`);

// Add labels to each slice
    arcs.append("text")
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .attr("text-anchor", "middle")
        .text(d => d.data.label)
        .attr("class", "slice");
}



// MAKE LINE CHART MAKE LINE CHART MAKE LINE CHART MAKE LINE CHART MAKE LINE CHART MAKE LINE CHART
// MAKE LINE CHART MAKE LINE CHART MAKE LINE CHART MAKE LINE CHART MAKE LINE CHART MAKE LINE CHART
const dataLine = [
    ["Jan 1 2010", 100],
    ["Jul 1 2010", 200],
    ["Jan 1 2011", 300],
    ["Jul 1 2011", 200],
    ["Jan 1 2012", 400],
    ["Jul 1 2012", 200],
    ["Jan 1 2013", 600],
    ["Jul 1 2013", 700],
    ["Jan 1 2014", 200],
    ["Jul 1 2014", 200],
    ["Jan 1 2015", 100],
    ["Jul 1 2015", 300],
    ["Jan 1 2016", 300],
    ["Jul 1 2016", 400],
    ["Jan 1 2017", 600],
    ["Jul 1 2017", 400],
    ["Jan 1 2018", 300],
    ["Jul 1 2018", 300],
    ["Jan 1 2019", 400],
    ["Jul 1 2019", 200],
    ["Jan 1 2020", 200],
    ["Jul 1 2020", 200],
    ["Jan 1 2021", 600],
    ["Jul 1 2021", 700],
    ["Jan 1 2022", 600],
    ["Jul 1 2022", 700],
    ["Jan 1 2023", 700],
    ["Jul 1 2023", 700],
    ["Jan 1 2024", 900],
    ["Jul 1 2024", 1200]
]
function makeMovingLine() {
    // Initialize empty data for the line chart
    let data = {
        labels: [],
        datasets: [{
            label: 'Data',
            data: [],
            borderColor: 'rgb(30,119,24)', // Line color
            borderWidth: 2,
            fill: false
        }]
    };

// Configuration options
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    };

// Get the context of the canvas element we want to select
    const ctx = document.getElementById('movingLineChart').getContext('2d');

// Create the line chart with initial empty data
    const movingLineChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: options
    });

// Function to generate random data and update the chart
    let brojac = 0
    function updateChart() {
        movingLineChart.data.labels.push(dataLine[brojac][0]);
        movingLineChart.data.datasets[0].data.push(dataLine[brojac][1]);

        brojac++

        if (movingLineChart.data.labels.length > dataLine.length) {
            movingLineChart.data.labels.shift();
            movingLineChart.data.datasets[0].data.shift();
        }

        movingLineChart.update();
    }

    setInterval(updateChart, 300);
}