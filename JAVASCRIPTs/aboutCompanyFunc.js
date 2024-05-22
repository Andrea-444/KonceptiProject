maptilersdk.config.apiKey = '28X7x2vtR4iZb6S98Fot';

let selectedCompany = ''
let isOn = false

// const listaMarkers = {
//     "Centar": [21.74, 41.60],
//     "Prilep": [21.565, 41.37],
//     "Bitola": [21.34, 41.05],
//     "Skopje": [21.44, 42.02],
// }
// const listAboutSchool = {
//     "Centar": ["Karpos 1, Skopje", 1000, 100, 11.5, [500, 550, 600, 850, 700, 750, 800, 740, 800, 600]],
//     "Prilep": ["Centar, Prilep", 100, 10, 15, [100, 250, 300, 250, 200, 350, 500, 440, 400, 600]],
//     "Bitola": ["Vlez, Bitola", 100, 1000, 12, [400, 550, 400, 850, 700, 750, 400, 540, 600, 500]],
//     "Skopje": ["Centar, Skopje", 1000, 10, 10, [100, 200, 300, 400, 500, 600, 700, 800, 900, 800]],
// }

// START WHEN LOADING PAGE
// START WHEN LOADING PAGE
// spawnLocationMap()
// makeGraph()
// makeLineChart()
// makePieChart()

function spawnLocationMap(loc) {
    const schoolLocationMap = new maptilersdk.Map({
        container: 'schoolLocationMap', // container's id or the HTML element to render the map
        style: maptilersdk.MapStyle.DATAVIZ.DARK,
        center: loc, // starting position [lng, lat]
        zoom: 9, // starting zoom
    });

    const marker = new maptilersdk.Marker({
        color: "#ce4444",
        draggable: false
    }).setLngLat(loc)
        .setPopup(new maptilersdk.Popup().setHTML(selectedCompany))
        .addTo(schoolLocationMap);
}

function changeSchool(company, marker, about) {
    if (isOn === false) {
        document.getElementById('aboutSchoolContainer').style.display = "block"
    }
    isOn = true

    if (selectedCompany === company) return

    let newCompany = company
    selectedCompany = newCompany
    spawnLocationMap(marker)
    makeGraph([about[2], generateRandomNumbers(about[2].length)])
    // makeLineChart(["Karpos 1, Skopje", 1000, 100, 11.5, [500, 550, 600, 850, 700, 750, 800, 740, 800, 600]])
    makePieChartSlim(about[2])
    makePieChart(about[3])

    const abtSch = document.getElementById('aboutSchool')
    abtSch.innerHTML = `<h3>About ${newCompany}</h3>
    <p><i class="fa-solid fa-school"></i> Година на основање: ${about[0]}</p>
    <p><i class="fa-solid fa-user"></i> Бр. на вработени: ${about[1]}</p>
    <p><i class="fa-solid fa-chalkboard-user"></i> Програмски јазици: ${about[2].length}</p>
    <p><i class="fa-solid fa-book"></i> Работни позиции:</p>`
    for (let i = 0; i < about[3].length; i++) {
        if (i > 3) break
        abtSch.innerHTML += `<p>${about[3][i]}</p>`
    }
}

function makeGraph(lista) {
    const deleteCanvas = document.getElementById('studentTeacherPillar')
    deleteCanvas.innerHTML = `<canvas id="aboutSchoolOptionsGraph" width="30" height="30"></canvas>`

// Sample data for the graph
    const aboutSchoolData = {
        labels: lista[0],
        datasets: [{
            label: 'Number',
            backgroundColor: 'rgba(255,255,255,0.7)', // Bar color
            borderColor: 'rgb(58,100,45)',
            borderWidth: 2,
            data: lista[1] // Data values
        }]
    };

// Configuration options
    const aboutSchoolOptions = {
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
    const ctx = document.getElementById('aboutSchoolOptionsGraph').getContext('2d');

// Create the pillar graph
    const aboutSchoolOptionsGraph = new Chart(ctx, {
        type: 'bar',
        data: aboutSchoolData,
        options: aboutSchoolOptions
    });
}

function makeLineChart(listAboutSchool) {
    const deleteCanvas = document.getElementById('studentGrowth')
    deleteCanvas.innerHTML = `<canvas id="studentGrowthChart" width="300" height="300"></canvas>`

    // Sample data for the line chart
    const lineData = listAboutSchool[4]
    const data = {
        labels: ['2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023'],
        datasets: [{
            label: 'Students Going to School',
            data: lineData, // Data values
            borderColor: 'rgb(58,100,45)', // Line color
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
    const ctx = document.getElementById('studentGrowthChart').getContext('2d');

    // Create the line chart
    const studentGrowthChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: options
    });
}

function makePieChartSlim(listLanguages) {

    let data = []
    let tmpV = 100 / listLanguages.length
    for (let i = 0; i < listLanguages.length; i++) {
        let tmp = {}
        tmp.label = listLanguages[i]
        tmp.value = tmpV
        data.push(tmp)
    }

// Set up dimensions and radius for the donut chart
    const pieSlimDiv = document.getElementById('studentGrowth')
    pieSlimDiv.innerHTML = `<svg id="donut-chart"></svg>`

    const width = pieSlimDiv.offsetWidth;
    const height = pieSlimDiv.offsetHeight;
    const radius = Math.min(width, height) / 2;
    const innerRadius = radius / 2; // For the donut chart

// Set up color scale with shades of brown
    const color = d3.scaleOrdinal()
        .domain(data.map(d => d.label))
        .range(["#e5e1d8", "#d8c9ba", "#ccb9ac", "#D2B48C"]);

// Create the pie chart layout
    const pie = d3.pie()
        .value(d => d.value)
        .sort(null);

// Define arc generator
    const arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(radius);

// Create SVG element
    const svg = d3.select("#donut-chart")
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

// Draw the donut chart
    const arcs = svg.selectAll(".arc")
        .data(pie(data))
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
        .attr("stop-color", (d, i) => d3.rgb(color(i)).brighter(0.5));

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

function makePieChart(lista) {
    const deleteCanvas = document.getElementById('studentPieChart')
    deleteCanvas.innerHTML = `<canvas id="schoolPopulationChart" width="400" height="400"></canvas>`

    let tmpN = 100 / lista.length
    let tmpNlist = []
    for (let i = 0; i < lista.length; i++) {
        tmpNlist.push(tmpN)
    }

    const backgroundColors = [
        'rgb(58,100,45)',
        'rgb(45,173,104)',
        'rgb(87,235,54)',
        'rgb(35,210,115)',
        'rgb(235,94,40)',
        'rgb(235,194,54)',
        'rgb(87,135,234)',
        'rgb(135,54,234)',
        'rgb(235,54,154)',
        'rgb(54,235,214)'
    ];

    const data = {
        labels: lista,
        datasets: [{
            label: 'Company Number of Employees',
            data: tmpNlist,
            backgroundColor: backgroundColors,
            borderColor: 'rgb(255,255,255)',
            borderWidth: 1
        }]
    };

    // Configuration options
    const options = {
        responsive: true,
        maintainAspectRatio: false,
    };

    // Get the context of the canvas element we want to select
    const ctx = document.getElementById('schoolPopulationChart').getContext('2d');

    // Create the pie chart
    const schoolPopulationChart = new Chart(ctx, {
        type: 'pie',
        data: data,
        options: options
    });
}

function generateRandomNumbers(n) {
    const randomNumbers = [];
    for (let i = 0; i < n; i++) {
        const randomNumber = Math.floor(Math.random() * (1000 - 100 + 1)) + 100;
        randomNumbers.push(randomNumber);
    }
    return randomNumbers;
}