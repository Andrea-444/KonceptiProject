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

    let radiusce = 50;
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
        radiusce = 30;
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

async function getData() {
    let data = await fetchData("https://iammistake.github.io/KonceptiProject/podatoci/zdravstvo.json");
    let jsongradovi = await fetchData("https://iammistake.github.io/KonceptiProject/podatoci/gradovi.json");

    data["Здраствени установи"].forEach(d => {
        ustanovi.push(d);
    });

    makeDropdownOpshtina(data);
    makeDoctors(data["Доктори"]);

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

async function makeDoctors(dataca) {
    let newData = {};
    newData.name = "Доктори";
    newData.children = [];

    for (let i = 0; i < 200; i++) {
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

    const svg = d3.select("#doctors").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-cx, -cy, width, height])
        .attr("style", "width: 100%; height: 100%; font: 1rem sans-serif;");

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
}

let ustanovi = [];
let datagradovi = [];
let datazdravstvo = [];

fetchItData();
getData();

document.addEventListener("DOMContentLoaded", function () {
    const opshtina = document.getElementById('odberi_opshtina');
    const checkbox = document.querySelector('.toggle input');
    const doctors = document.getElementById('doctors');
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
