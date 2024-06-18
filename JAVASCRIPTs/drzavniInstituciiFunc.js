
async function makeHierarchy(data) {
    const margin = {top: 0, right: 90, bottom: 30, left: outerWidth * 0.3},
        width = outerWidth - margin.left - margin.right,
        height = outerHeight * 4 - margin.top - margin.bottom;

// Append the svg object to the body of the page
    const svg = d3.select("#hierarhija").append('svg')
        .attr("width", width + margin.right + margin.left)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



    // Transform the data into a d3 hierarchy
    const root = d3.hierarchy(data);

    // Create the tree layout
    const tree = d3.tree().size([height, width]);

    // Assigns the x and y position for the nodes
    const treeData = tree(root);

    // Compute the new tree layout
    const nodes = treeData.descendants(),
        links = treeData.descendants().slice(1);

    // Normalize for fixed-depth
    nodes.forEach(d => d.y = d.depth * 180);

    // ****************** Nodes section ***************************

    // Update the nodes
    let i = 0
    const node = svg.selectAll('g.node')
        .data(nodes, d => d.id || (d.id = ++i));

    // Enter any new modes at the parent's previous position
    const nodeEnter = node.enter().append('g')
        .attr('class', 'node')
        .attr("transform", d => "translate(" + d.y + "," + d.x + ")");

    // Add Circle for the nodes
    nodeEnter.append('circle')
        .attr('class', 'node')
        .attr('r', 4)
        .style("fill", "#cfb717");

    // Add labels for the nodes
    nodeEnter.append('text')
        .attr("dy", ".35em")
        .attr("x", d => d.children || d._children ? -13 : 13)
        .attr("text-anchor", d => d.children ? "end" : "start")
        .style("fill", "#000000")
        .text(d => d.data.name);

    // ****************** links section ***************************
    let treeLink = d3.linkHorizontal().x(d => d.y).y(d => d.x)

    // Update the links
    const link = svg.selectAll('path.link')
        .data(links, d => d.id)
        .data(root.links())
        .join("path")
        .attr("d", d3.linkHorizontal().x(d => d.y).y(d => d.x));

    // Enter any new links at the parent's previous position
    // const linkEnter = link.enter().insert('path', "g")
    //     .attr("class", "link")
    //     .style("fill", "#000000")
    //     .style("color", "#000000")
    //     .attr('d', d => {
    //         const o = {x: d.x, y: d.y};
    //         return diagonal(o, o);
    //     });

    // Creates a curved (diagonal) path from parent to the child nodes
    function diagonal(s, d) {
        const path = `M ${s.y} ${s.x}
                        C ${(s.y + d.y) / 2} ${s.x},
                          ${(s.y + d.y) / 2} ${d.x},
                          ${d.y} ${d.x}`;

        return path;
    }
}

async function makeSobranie(data) {
    let sobranie = {}
    sobranie["name"] = "Собрание на РСМ"
    sobranie["children"] = []
    for (const key in data) {
        if (key === "Собрание на Република Северна Македонија") continue
        if (data[key]["Буџет (денари)"] === "/") continue
        sobranie["children"].push({name: key, value: data[key]["Буџет (денари)"], br: data[key]["Број на вработени"]})
    }
    data = sobranie

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
            .sum(d => d.value)
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
            let tmpCont = document.getElementById('aboutSobranieInfo')
            let v = d.value
            // console.log(d)
            tmpCont.innerHTML = `<h3>${d.data.name}</h3>
            <p><i class="fa-solid fa-person"></i> Број на вработени: ${d.data.br}</p>
            <p><i class="fa-solid fa-money-bill"></i> Буџет: ${formatNumber(d.data.value)} денари </p>`
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
}

async function fetchInstutuciiData() {
    let data = await fetchData("https://iammistake.github.io/KonceptiProject/podatoci/drzavniInstitucii.json")
    // let data = await fetchData("../podatoci/drzavniInstitucii.json")
    // console.log(data)
    // console.log(data["Владини институции на РСМ"])
    let hierarchy = {}
    hierarchy["name"] = "Владини институции на РСМ"
    hierarchy["children"] = []
    for (const key in data["Владини институции на РСМ"]) {
        // console.log(key)
        let tmp = {}
        tmp["name"] = key
        tmp["children"] = []
        for (const key2 in data["Владини институции на РСМ"][key]) {
            let tmp2 = {}
            tmp2["name"] = key2
            // tmp2["children"] = []
            // for (let i = 0; i < data["Владини институции на РСМ"][key][key2].length; i++) {
            //     let tmp3 = {}
            //     tmp3["name"] = data["Владини институции на РСМ"][key][key2][i]
            //     tmp2["children"].push(tmp3)
            // }
            tmp["children"].push(tmp2)
        }
        hierarchy["children"].push(tmp)
    }
    // console.log(hierarchy)


    await makeHierarchy(hierarchy)
    await makeSobranie(data["Собрание на РСМ"])
    await makeDropdown(data["Министерства на РСМ"])
    // await makePieChartMin(data["Министерства на РСМ"])
}

async function makeDropdown(data) {
    const dropdown = document.getElementById('dropdown');

    // Populate dropdown with options
    Object.keys(data).forEach(key => {
        let option = document.createElement('option');
        option.value = key;
        option.textContent = key;
        dropdown.appendChild(option);
    });

    data = data[dropdown1Val][dropdown2Val]

    let tmp1 = []
    for (const dataKey in data) {
        if (data[dataKey] === 0) continue
        let tmp = {}
        tmp.name = dataKey
        tmp.value = data[dataKey]
        tmp1.push(tmp)
    }

    makePieChartMin(tmp1, "#pieChartMin")
}

function updatePieTexBox(s) {
    document.getElementById('aboutMinisterstvoInfo').innerHTML =
        `<h3>${dropdown1Val}</h3>
                    <h3>${dropdown2Val}</h3>
                    <p><i class="fa-solid fa-person"></i> Број на вработени ${s}</p>`
}

async function makePieChartMin(data, continer) {
    if (data === null) {
        data = await fetchData("https://iammistake.github.io/KonceptiProject/podatoci/drzavniInstitucii.json")
        // data = await fetchData("../podatoci/drzavniInstitucii.json")
        data = data["Министерства на РСМ"][dropdown1Val][dropdown2Val]
        let tmp1 = []
        for (const dataKey in data) {
            if (data[dataKey] === 0) continue
            let tmp = {}
            tmp.name = dataKey
            tmp.value = data[dataKey]
            tmp1.push(tmp)
        }
        data = tmp1
    }

    document.getElementById('pieChartMin').innerHTML = ""

    const width = outerWidth * 0.45;
    const height = outerHeight * 0.5;
    const radius = Math.min(width, height) / 2;
    // console.log(data)/
    const color = d3.scaleOrdinal(["#e1dccd", "#d8c9ba", "#ccb9ac", "#D2B48C"]);

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
            updatePieTexBox(data1.name + ": " + data1.value)
            d3.select(this).select("text")
                .style("display", "block")
                .style("font-size", "3rem")
                .style("font-weight", "bold")
        })
        .on("mouseout", function() {
            d3.select(this).select("text")
                .style("display", "block")
                .style("font-size", "1.5rem")
        });

    arcs.append("path")
        .attr("d", arc)
        .attr("fill", d => color(d.data.name));

    arcs.append("text")
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .attr("text-anchor", "middle")
        .text(d => d.data.name)
}

let dropdown1Val = "Министерство за животна средина и просторно планирање"
let dropdown2Val = "Половна структура"

fetchInstutuciiData()

document.addEventListener("DOMContentLoaded", function() {
    const checkbox = document.querySelector('.toggle input');
    const hierarchy = document.getElementById('hierarhija');
    const dropdown1 = document.getElementById('dropdown');
    const dropdown2 = document.getElementById('dropdown2');

    dropdown1.addEventListener('change', function () {
        dropdown1Val = dropdown1.options[dropdown1.selectedIndex].value;
        // console.log(dropdown1Val);

        makePieChartMin(null, "#pieChartMin")
    })

    dropdown2.addEventListener('change', function () {
        dropdown2Val = dropdown2.options[dropdown2.selectedIndex].value;
        // console.log(dropdown2Val);

        makePieChartMin(null, "#pieChartMin")
    })

    checkbox.addEventListener('change', function() {
        if (this.checked) {
            hierarchy.style.display = 'flex';
        } else {
            hierarchy.style.display = 'none';
        }
    });
});