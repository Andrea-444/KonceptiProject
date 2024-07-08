var mymap = L.map('mapid').setView([41.5501684, 21.5836714], 8);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(mymap);

var markers = [];

async function makeDropdownOpshtina(datas) {
    let data = [];
    datas["Здраствени установи"].forEach(d => {
        data.push(d);
    });
    let dropdown = document.getElementById('odberi_opshtina');
    for (let i = 0; i < data.length; i++) {
        let option = document.createElement('option');
        let key = data[i]["Општина"];
        option.value = key;
        option.textContent = key;
        dropdown.appendChild(option);
    }
    const options = [];
    document.querySelectorAll('#odberi_opshtina > option').forEach((option) => {
        if (options.includes(option.value)) option.remove();
        else options.push(option.value);
    });
}

async function createItBubbles(data) {
    let innerWidth1 = window.innerWidth;
    const width = innerWidth1;
    const height = window.innerHeight * 0.6;

    const svg = d3.select("#bubble-chart")
        .attr("width", width)
        .attr("height", height);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    let radiusce = 35;
    let forcce = 60;

    let strX = 0.005;
    let strY = 0.2;
    let strCollide = 12;
    let heightDevisitor = 2.1;
    if (innerWidth <= 1650) {
        if (innerWidth1 <= 1500) {
            strY = 0.05;
            strCollide = 10;
        }
        if (innerWidth1 <= 1400) {
            strY = 0.03;
            strCollide = 9;
        }
        if (innerWidth1 <= 1200) {
            heightDevisitor = 1.8;
            strY = 0.02;
            strCollide = 6;
        }
        if (innerWidth1 <= 1000) {
            heightDevisitor = 1.8;
            strY = 0.02;
            strCollide = 5;
        }
        if (innerWidth1 <= window.innerHeight) {
            strY = 0.00615;
            strCollide = 8;
            heightDevisitor = 1.1;
        }
        if (innerWidth1 <= window.innerHeight - 300) {
            heightDevisitor = 1;
            strY = 0.005;
            strCollide = 9;
        }
    }
    if (document.getElementById('heder-zdravstvo').innerText === 'Специјалности') {
        radiusce = 25;
        strY = 0.075;
        strX = 0.0045;
        forcce = 35;
    }
    if (document.getElementById('heder-zdravstvo').innerText === 'Институции во секундарно ниво') {
        radiusce = 25;
        strY = 0.075;
        strX = 0.005;
        forcce = 50;
    }

    const simulation = d3.forceSimulation(data)
        .force("x", d3.forceX(width / 0.9).strength(strX))
        .force("y", d3.forceY(height / heightDevisitor).strength(strY))
        .force("collide", d3.forceCollide(forcce))
        .stop();

    for (let i = 0; i < 120; ++i) simulation.tick();

    const bubbles = svg.selectAll(".bubble")
        .data(data)
        .enter().append("circle")
        .attr("class", "bubble")
        .attr("r", d => radiusce)
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("fill", (d, i) => color(i));

    const labels = svg.selectAll(".label")
        .data(data)
        .enter().append("text")
        .attr("class", "label")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("fill", "black")
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .text(d => `${d["Опис"]}`);

    labels.attr("x", d => d.x)
        .attr("y", d => d.y);

    simulation.nodes(data)
        .on("tick", () => {
            bubbles.attr("cx", d => d.x)
                .attr("cy", d => d.y);

            labels.attr("x", d => d.x)
                .attr("y", d => d.y);
        });

    simulation.alpha(1).restart();
}

async function getData(dali) {
    let data = await fetchData("https://iammistake.github.io/KonceptiProject/podatoci/zdravstvo.json");
    let jsongradovi = await fetchData("https://iammistake.github.io/KonceptiProject/podatoci/gradovi.json");

    if (dali === "doctors") {
        makeDoctors(data["Доктори"], currFrom, currTo);
        return
    }

    data["Здраствени установи"].forEach(d => {
        ustanovi.push(d);
    });

    makeDropdownOpshtina(data);
    makeDoctors(data["Доктори"], currFrom, currTo);

    jsongradovi.forEach(grad => {
        datagradovi.push(grad);
    });
}

async function fetchItData() {
    let dropdown = document.getElementById('odberi_nivo');
    let nivo = dropdown.options[dropdown.selectedIndex].value;
    let heder = document.getElementById('heder-zdravstvo').innerHTML = nivo;
    let data = await fetchData("https://iammistake.github.io/KonceptiProject/podatoci/zdravstvo.json");

    let instituci = [];

    data[nivo].forEach(inst => {
        instituci.push(inst);
    });

    await createItBubbles(instituci);
}

function prebaraj() {
    let bubble = document.getElementById('bubble-chart').innerHTML = "";
    fetchItData();
}

function setMarkers() {
    let opshtina = document.getElementById('odberi_opshtina').value;

    // Remove previous markers
    markers.forEach(marker => mymap.removeLayer(marker));
    markers = [];

    ustanovi.forEach(ustanova => {
        if (ustanova["Општина"].toString().toLowerCase() === opshtina.toString().toLowerCase()) {
            let coords = ustanova["Геолокација"].split(", ");
            let newMarker = L.marker([parseFloat(coords[0]), parseFloat(coords[1])]).addTo(mymap)
                .bindPopup(`<b>${ustanova["Установи"]}</b><br>Тип: ${ustanova["Тип"]}<br>Вид: ${ustanova["Приватно\/Државно"]}<br>Ниво: ${ustanova["Примарно\/секундарно\/терциерно"]}`);
            markers.push(newMarker);
        }
    });

    // mymap.setView()

    datagradovi.forEach(grad => {
        if (grad["град"].toString().toLowerCase() === opshtina.toString().toLowerCase()) {
            mymap.setView([grad["координати"]["latitude"], grad["координати"]["longitude"]], 11)
        }
    })

    creatingUstanovi();
}

function creatingUstanovi() {
    let div = document.getElementById('info_ustanovi');
    let opshtina = document.getElementById('odberi_opshtina').value;
    div.innerHTML = "";
    ustanovi.forEach(ustanova => {
        if (ustanova["Општина"].toString().toLowerCase() === opshtina.toString().toLowerCase()) {
            div.innerHTML += "<div class='povekje_info_za_ustanova javnaCard'><p>" + ustanova['Установи'] + "</p>Тип: " + ustanova['Тип'] + "</p><p>Вид: " + ustanova['Приватно\/Државно'] + "</p><p>Ниво: " + ustanova['Примарно\/секундарно\/терциерно'] + "</p> </div>";
        }
    });
}

function doctorObject(data) {
    let tmp = {};

    tmp.name = data["Доктор"]

    return tmp
}

function splitDoctorsData(data) {
    let pol = {}
    pol["Машки"] = []
    pol["Женски"] = []

    let specijalnost = {}
    let rabMesto = {}

    let privDrzavno = {}
    privDrzavno["Приватно"] = []
    privDrzavno["Државно"] = []

    let nivo = {}
    nivo["Примарно"] = []
    nivo["Секундарно"] = []
    nivo["Терциерно"] = []

    let opstini = {}

    for (let i = 0; i < data.length; i++) {
        if (data[i]["Доктор"] === "/") {
            continue;
        }
        if (data[i]["Специјалност"] === "/") {
            continue;
        }

        // POL-at kalendar
        if (data[i]["Пол"] === "Женски") {
            let tmp = doctorObject(data[i])
            pol["Женски"].push(tmp)
        }
        if (data[i]["Пол"] === "Машки") {
            let tmp = doctorObject(data[i])
            pol["Машки"].push(tmp)
        }

        // Specijalnost
        let specTmp = data[i]["Специјалност"]
        if (specijalnost.hasOwnProperty(specTmp)) {
            specijalnost[specTmp].push(doctorObject(data[i]))
        } else {
            specijalnost[specTmp] = []
            specijalnost[specTmp].push(doctorObject(data[i]))
        }

        // rabMesto
        let rabMestoTmp = data[i]["Работно место"]
        if (rabMesto.hasOwnProperty(rabMestoTmp)) {
            rabMesto[rabMestoTmp].push(doctorObject(data[i]))
        } else {
            rabMesto[rabMestoTmp] = []
            rabMesto[rabMestoTmp].push(doctorObject(data[i]))
        }

        // privatno / drzavno
        if (data[i]["Приватно\/Државно"] === "Државно") {
            let tmp = doctorObject(data[i])
            privDrzavno["Државно"].push(tmp)
        }
        if (data[i]["Приватно\/Државно"] === "Приватно") {
            let tmp = doctorObject(data[i])
            privDrzavno["Приватно"].push(tmp)
        }

        // Nivo
        if (data[i]["Примарно\/Секундарно\/Терциерно"] === "Примарно ниво") {
            let tmp = doctorObject(data[i])
            nivo["Примарно"].push(tmp)
        }
        if (data[i]["Примарно\/Секундарно\/Терциерно"] === "Секундарно ниво") {
            let tmp = doctorObject(data[i])
            nivo["Секундарно"].push(tmp)
        }
        if (data[i]["Примарно\/Секундарно\/Терциерно"] === "Терциерно ниво") {
            let tmp = doctorObject(data[i])
            nivo["Терциерно"].push(tmp)
        }

        // opstini
        let opstiniTmp = data[i]["Општина"]
        if (opstini.hasOwnProperty(opstiniTmp)) {
            opstini[opstiniTmp].push(doctorObject(data[i]))
        } else {
            opstini[opstiniTmp] = []
            opstini[opstiniTmp].push(doctorObject(data[i]))
        }
    }

    console.log("POL", pol)
    console.log("specijalnost", specijalnost)
    console.log("rabMesto", rabMesto)
    console.log("privDrzavno", privDrzavno)
    console.log("nivo", nivo)
    console.log("opstini", opstini)
}

async function makeDoctors(dataca, from, to) {
    let newData = {};
    newData.name = "Доктори";
    newData.children = [];

    for (let i = from; i < to; i++) {
        let tmp = {};
        tmp.name = dataca[i]["Доктор"];
        tmp["Пол"] = dataca[i]["Пол"];
        if (tmp.name === "/") {
            i++;
            continue;
        }
        newData.children.push(tmp);
    }

    const data = newData;

    const width = innerWidth;
    const height = innerHeight;
    const cx = width * 0.5;
    const cy = height * 0.54;
    const radius = Math.min(width, height) / 2 - 200;

    const tree = d3.cluster()
        .size([2 * Math.PI, radius])
        .separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth);

    const root = tree(d3.hierarchy(data)
        .sort((a, b) => d3.ascending(a.data.name, b.data.name)));

    let svg
    if (isFirst) {
        svg = d3.select("#doctors").append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [-cx, -cy, width, height])
            .attr("style", "width: 100%; height: 100%; font: 0.85rem sans-serif;");
    } else {
        document.getElementById('doctors').innerHTML = ""
        svg = d3.select("#doctors").append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [-cx, -cy, width, height])
            .attr("style", "width: 100%; height: 100%; font: 0.85rem sans-serif;");
    }

    svg.append("g")
        .attr("fill", "none")
        .attr("stroke", "#555")
        .attr("stroke-opacity", 0.4)
        .attr("stroke-width", 1.5)
        .selectAll()
        .data(root.links())
        .join("path")
        .attr("d", d3.linkRadial()
            .angle(d => d.x)
            .radius(d => d.y));

    svg.append("g")
        .selectAll()
        .data(root.descendants())
        .join("circle")
        .attr("transform", d => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0)`)
        .attr("fill", d => d.children ? "#555" : "#999")
        .attr("r", 2.5);

    svg.append("g")
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", 3)
        .selectAll()
        .data(root.descendants())
        .join("text")
        .attr("transform", d => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0) rotate(${d.x >= Math.PI ? 180 : 0})`)
        .attr("dy", "0.31em")
        .attr("x", d => d.x < Math.PI === !d.children ? 6 : -6)
        .attr("text-anchor", d => d.x < Math.PI === !d.children ? "start" : "end")
        .attr("paint-order", "stroke")
        .attr("stroke", "white")
        .attr("fill", "currentColor")
        .text(d => d.data.name);

    if (isFirst) {
        splitDoctorsData(dataca)

        isFirst = false
    }
}

function changeDoctorsTree(broj) {
    if (broj === 100 && doctorsLength <= currTo + 100) {
        currFrom = 0
        currTo = 100
        return
    }
    if (broj === -100 && 0 >= currFrom) {
        currFrom = 6300
        currTo = 6400
        return
    }

    currFrom += broj
    currTo += broj
    getData("doctors")
}

let currFrom = 0
let currTo = 100
let doctorsLength = 6400

let isFirst = true

let ustanovi = [];
let datagradovi = [];
let datazdravstvo = [];

fetchItData();
getData("se");

document.addEventListener("DOMContentLoaded", function () {
    const opshtina = document.getElementById('odberi_opshtina');
    const checkbox = document.querySelector('.toggle input');
    const doctors = document.getElementById('doktorContainer');
    const nivo = document.getElementById("odberi_nivo");

    checkbox.addEventListener('change', function() {
        if (this.checked) {
            doctors.style.display = 'flex';
        } else {
            doctors.style.display = 'none';
        }
    });

    nivo.addEventListener('change', function () {
        prebaraj();
    });

    opshtina.addEventListener('onClick', function () {
        setMarkers();
    });
});
