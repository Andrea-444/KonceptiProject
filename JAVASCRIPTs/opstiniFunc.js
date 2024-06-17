
async function makeMapOpstini(update) {
    let data = await fetchData("https://iammistake.github.io/KonceptiProject/podatoci/opstini.json")
    // let data = await fetchData("../podatoci/opstini.json")
    data = data["Општини"]

    if (update) {
        makeBallsOpstini(data)
        return
    }
    // console.log(data)

    let map = L.map('map').setView([41.6086, 21.7453], 8.49); // Centered in North Macedonia

    // Add a tile layer to add to our map, in this case it's a OSM tile layer.
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add markers to the map
    data.forEach(function(municipality) {
        let marker = L.marker(municipality["Координати"]).addTo(map);
        let popupContent = '<b>Општина: ' + municipality["Општини"] + '</b><br>' +
            'Адреса: ' + municipality["Адреса"] + '<br>' +
            'Резидентно население: ' + municipality["Резидентно население"] + '<br>' +
            'Домаќинства: ' + municipality["Домаќинства"] + '<br>';
        marker.bindPopup(popupContent);

        marker.on('mouseover', function(e) {
            this.bindPopup(popupContent).openPopup();
        });
        marker.on('mouseout', function(e) {
            this.closePopup();
        });
    });

    await makeBallsOpstini(data)
    await makePieOpstini(data)
}

async function makeBallsOpstini(data) {
    // FILTER True = spored opstni nad 10 000 ziteli
    // False = spored budget
    document.getElementById("topki").innerHTML = ""

    let opstini = {}
    let opsVoSk = ["Центар", "Гази Баба", "Аеродром", "Чаир", "Кисела Вода", "Бутел", "Шуто Оризари", "Карпош", "Ѓорче Петров", "Сарај"]

    opstini["name"] = "Macedonia"
    opstini["children"] = []
    opstini["children"].push({name: "Скопје", children: []})
    let skBudget = 7992959000 / opsVoSk.length
    data.forEach(ops => {
        if (filter) {
            if (ops["Општини"] !== "Град Скопје" && ops["Резидентно население"] > populationValue) {
                if (opsVoSk.includes(ops["Општини"])) {
                    opstini["children"][0].children.push({name: ops["Општини"], value: ops["Резидентно население"], budget: skBudget})
                } else {
                    opstini["children"].push({name: ops["Општини"], value: ops["Резидентно население"], budget: ops["Вкупен буџет "]})
                }
            }
        } else {
            if (ops["Општини"] !== "Град Скопје") {
                if (opsVoSk.includes(ops["Општини"])) {
                    opstini["children"][0].children.push({name: ops["Општини"], value: ops["Резидентно население"], budget: skBudget})
                } else {
                    opstini["children"].push({name: ops["Општини"], value: ops["Резидентно население"], budget: ops["Вкупен буџет "]})
                }
            }
        }
    })
    data = opstini

    const width = window.outerWidth * 0.5;
    const height = width;
    const format = d3.format(",d");
    const color = d3.scaleLinear()
        .domain([0, 5])
        .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
        .interpolate(d3.interpolateHcl);

    const pack = data => d3.pack()
        .size([width, height])
        .padding(3)(d3.hierarchy(data)
            .sum(filter ? d => d.value : d => d.budget)
            .sort((a, b) => b.value - a.value));

    const root = pack(data);
    // console.log(d3.select('body'))
    const svg = d3.select("#topki").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
        .style("display", "block")
        .style("margin", "0 5vw 5vh 0")
        .style("background", "#a6efe4")
        .style("cursor", "pointer")
        // .on("click", () => zoom(root));

    const node = svg.append("g")
        .selectAll("circle")
        .data(root.descendants().slice(1))
        .join("circle")
        .attr("fill", d => d.children ? color(d.depth) : "white")
        .attr("pointer-events", d => d.depth > 1 ? "none" : null)
        .on("mouseover", function() { d3.select(this).attr("stroke", "#000"); })
        .on("mouseout", function() { d3.select(this).attr("stroke", null); })
        .on("click", (event, d) => focus !== d && (zoom(event, d), event.stopPropagation()));

    const label = svg.append("g")
        .style("font", "0.8rem sans-serif")
        .style("color", "var(--header)")
        .attr("pointer-events", "none")
        .attr("text-anchor", "middle")
        .selectAll("text")
        .data(root.descendants())
        .join("text")
        .style("fill-opacity", d => d.parent === root ? 1 : 0)
        .style("display", d => d.parent === root ? "inline" : "none")
        .text(d => d.data.name);

    svg.on("click", (event) => zoom(event, root));
    let focus = root;
    let view;

    zoomTo([root.x, root.y, root.r * 2]);

    function zoomTo(v) {
        const k = width / v[2];

        view = v;

        label.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
        node.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
        node.attr("r", d => d.r * k);
    }

    function zoom(event, d) {
        if (!d.children) {
            let tmpCont = document.getElementById('aboutOpstinaInfo')
            let v = d.value
            console.log(d)
            tmpCont.innerHTML = `<h3>About ${d.data.name}</h3>
                    <p><i class="fa-solid fa-person"></i> Резидентно население: ${formatNumber(d.data.value)} луѓе</p>
                    <p><i class="fa-solid fa-money-bill"></i> Вкупен буџет: ${formatNumber(d.data.budget)} денари</p>`
            return
        }

        const focus0 = focus;
        focus = d;

        const transition = svg.transition()
            .duration(event.altKey ? 7500 : 750)
            .tween("zoom", d => {
                const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
                return t => zoomTo(i(t));
            });

        label
            .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
            .transition(transition)
            .style("fill-opacity", d => d.parent === focus ? 1 : 0)
            .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
            .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
    }

    // addItClickEvent()
}

async function makePieOpstini(data) {
    let osnovni = []
    let sredni = []
    let opsVoSk = ["Центар", "Гази Баба", "Аеродром", "Чаир", "Кисела Вода", "Бутел", "Шуто Оризари", "Карпош", "Ѓорче Петров", "Сарај"]

    osnovni.push({name: "Скопје", value: 0})
    sredni.push({name: "Скопје", value: 1778000000})
    data.forEach(d => {
        if (opsVoSk.includes(d["Општини"])) {
            osnovni[0].value += d["Пари овозможени за образование"]
        } else if (d["Општини"] === "Град Скопје") {

        } else {
            if (d["Пари овозможени за образование"] > 10000) {
                osnovni.push({name: d["Општини"], value: d["Пари овозможени за образование"]})
                sredni.push({name: d["Општини"], value: d["Column8"]})
            }
        }
    })
    // console.log(osnovni)
    // console.log(sredni)
    // data = opstini

    makePieChartOps(osnovni, "#pie1")
    makePieChartOps(sredni, "#pie2")
}

function makePieChartOps(data, continer) {
    // console.log(data)
    const width = outerWidth * 0.4;
    const height = outerHeight * 0.8;
    const radius = Math.min(width, height) / 2;

    const color = d3.scaleOrdinal()
        .domain(data.map(d => d.name))
        .range(d3.schemeCategory10);
        // .range(d3.interpolateBlues);
    // const color = d3.scaleSequential(d3.interpolateOranges);

    const svg = d3.select(continer)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const pie = d3.pie()
        .value(d => d.value);

    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    const arcs = svg.selectAll("arc")
        .data(pie(data))
        .enter()
        .append("g")
        .attr("class", "arc")
        .on("mouseover", function() {
            let data1 = d3.select(this)["_groups"][0][0]["__data__"].data;
            updatePieText(data1.name + " " + formatNumber(data1.value) + " денари")
            d3.select(this).select("text")
                .style("display", "block")
                .style("font-size", "2rem")
                .style("font-weight", "bold")
        })
        .on("mouseout", function() {
            d3.select(this).select("text").style("display", "none");
        });

    arcs.append("path")
        .attr("d", arc)
        .attr("fill", d => color(d.data.name));

    arcs.append("text")
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .attr("text-anchor", "middle")
        .text(d => d.data.name)
}

function updatePieText(text) {
    let ova = document.getElementById('pieText')
    ova.innerHTML = text
}

function updateFilter() {
    const selectedOption = document.querySelector('input[name="filter"]:checked').value;
    if (selectedOption === "Население") {
        populationValue = document.getElementById('populationValue').value;
        filter = true;
    } else {
        filter = false;
    }
    makeMapOpstini(true)
}

document.querySelectorAll('input[name="filter"]').forEach(radio => {
    radio.addEventListener('change', updateFilter);
});

document.getElementById('populationValue').addEventListener('input', updateFilter);

let populationValue = 10000
let filter = true;
updateFilter();
makeMapOpstini(false)
