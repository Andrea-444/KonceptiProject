maptilersdk.config.apiKey = '28X7x2vtR4iZb6S98Fot';

let school = 'Centar'

const listaMarkers = {
    "Centar": [21.74, 41.60],
    "Prilep": [21.565, 41.37],
    "Bitola": [21.34, 41.05],
    "Skopje": [21.44, 42.02],
}
const listAboutSchool = {
    "Centar": ["Karpos 1, Skopje", 1000, 100, 11.5, [500, 550, 600, 850, 700, 750, 800, 740, 800, 600]],
    "Prilep": ["Centar, Prilep", 100, 10, 15, [100, 250, 300, 250, 200, 350, 500, 440, 400, 600]],
    "Bitola": ["Vlez, Bitola", 100, 1000, 12, [400, 550, 400, 850, 700, 750, 400, 540, 600, 500]],
    "Skopje": ["Centar, Skopje", 1000, 10, 10, [100, 200, 300, 400, 500, 600, 700, 800, 900, 800]],
}

// START WHEN LOADING PAGE
// START WHEN LOADING PAGE
spawnLocationMap()
schoolsOptions()
makeGraph()
makeLineChart()
makePieChart()

function spawnLocationMap() {
    const schoolLocationMap = new maptilersdk.Map({
        container: 'schoolLocationMap', // container's id or the HTML element to render the map
        style: maptilersdk.MapStyle.DATAVIZ.DARK,
        center: listaMarkers[school], // starting position [lng, lat]
        zoom: 9, // starting zoom
    });

    let coords = listaMarkers[school]
    const marker = new maptilersdk.Marker({
        color: "#ce4444",
        draggable: false
    }).setLngLat(coords)
        .setPopup(new maptilersdk.Popup().setHTML(school))
        .addTo(schoolLocationMap);
}

function schoolsOptions() {
    const container = document.getElementById('schools')
    for (let listaMarkersKey in listaMarkers) {
        if (listaMarkersKey === school) {
            container.innerHTML += `<div onclick="changeSchool(this)" class="schoolsSchool flex schoolsActive">${listaMarkersKey}</div>`
        } else {
            container.innerHTML += `<div onclick="changeSchool(this)" class="schoolsSchool flex">${listaMarkersKey}</div>`
        }
    }
}

function removeActive() {
    const actives = document.getElementsByClassName('schoolsActive')
    for (let active of actives) {
        active.classList.remove('schoolsActive')
    }
}
function changeSchool(btn) {
    let newSchool = btn.innerText

    if (btn.classList.contains('schoolsActive')) return
    removeActive()
    btn.classList.add('schoolsActive')

    school = newSchool
    spawnLocationMap()
    makeGraph()
    makeLineChart()
    makePieChart()

    const abtSch = document.getElementById('aboutSchool')
    abtSch.innerHTML = `<h3>About ${newSchool}</h3>
    <p><i class="fa-solid fa-school"></i> School Location: ${listAboutSchool[newSchool][0]}</p>
    <p><i class="fa-solid fa-user"></i> Students: ${listAboutSchool[newSchool][1]}</p>
    <p><i class="fa-solid fa-chalkboard-user"></i> Teachers: ${listAboutSchool[newSchool][2]}</p>
    <p><i class="fa-solid fa-book"></i> Average Subjects per year: ${listAboutSchool[newSchool][3]}</p>
    <p>For every student there is ${listAboutSchool[newSchool][2] / listAboutSchool[newSchool][1]} teachers</p>`
}

function makeGraph() {
    const deleteCanvas = document.getElementById('studentTeacherPillar')
    deleteCanvas.innerHTML = `<canvas id="aboutSchoolOptionsGraph" width="30" height="30"></canvas>`

// Sample data for the graph
    let teachersData = listAboutSchool[school][2]
    let studentsData = listAboutSchool[school][1]
    const aboutSchoolData = {
        labels: ['Teachers', 'Students'],
        datasets: [{
            label: 'Number',
            backgroundColor: 'rgba(255,255,255,0.7)', // Bar color
            borderColor: 'rgb(58,100,45)',
            borderWidth: 2,
            data: [teachersData, studentsData] // Data values
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

function makeLineChart() {
    const deleteCanvas = document.getElementById('studentGrowth')
    deleteCanvas.innerHTML = `<canvas id="studentGrowthChart" width="300" height="300"></canvas>`

    // Sample data for the line chart
    const lineData = listAboutSchool[school][4]
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

function makePieChart() {
    const deleteCanvas = document.getElementById('studentPieChart')
    deleteCanvas.innerHTML = `<canvas id="schoolPopulationChart" width="400" height="400"></canvas>`

    let teachersData = listAboutSchool[school][2]
    let studentsData = listAboutSchool[school][1]

    const data = {
        labels: ['Teachers', 'Students'],
        datasets: [{
            label: 'School Population',
            data: [teachersData, studentsData],
            backgroundColor: [
                'rgb(58,100,45)', // Green color for teachers
                'rgb(45,173,104)' // Blue color for students
            ],
            borderColor: [
                'rgb(35,210,115)',
                'rgb(87,235,54)'
            ],
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