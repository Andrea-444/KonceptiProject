maptilersdk.config.apiKey = '28X7x2vtR4iZb6S98Fot';

let selectedCompany = ''
let isOn = false

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
    // console.log(company, about)
    spawnLocationMap(marker)
    // makeGraph([about[2], generateRandomNumbers(about[2].length)])
    // makeLineChart(["Karpos 1, Skopje", 1000, 100, 11.5, [500, 550, 600, 850, 700, 750, 800, 740, 800, 600]])
    makePieChartSlim(about[2])
    makePositions(about[3])
    // makePieChart(about[3])

    const abtSch = document.getElementById('aboutSchool')
    abtSch.innerHTML = `<h3>About ${newCompany}</h3>
    <p><i class="fa-solid fa-school"></i> Година на основање: ${about[0]}</p>
    <p><i class="fa-solid fa-user"></i> Бр. на вработени: ${about[1]}</p>
    <p><i class="fa-solid fa-chalkboard-user"></i> Програмски јазици: ${about[2].length}</p>
    <p><i class="fa-solid fa-book"></i> Работни позиции:</p>`
    for (let i = 0; i < about[3].length; i++) {
        if (i > 2) break
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
        .range(["#e1dccd", "#d8c9ba", "#ccb9ac", "#D2B48C"]);

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

function makePositions(data) {
    const listici = document.getElementsByClassName('tag-list');
    let list0 = listici[0];
    let list1 = listici[1];
    for (let i = 0; i < listici.length; i++) {
        listici[i].innerHTML = ""
    }

    if (data.length < 5) {
        for (let i = 0; i < 5; i++) {
            let tmp = []
            for (let j = 0; j < data.length; j++) {
                tmp.push(data[j])
            }
            for (let j = 0; j < tmp.length; j++) {
                data.push(tmp[j])
            }
        }
    }

    for (let i = 0; i < data.length; i++) {
        list0.innerHTML += `<li>${data[i]}</li>`
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery && !mediaQuery.matches) {
        const tagScroller = document.querySelector(".tag-scroller");
        const allTags = tagScroller.querySelectorAll("li");

        function createElement(tagName, className = "") {
            const elem = document.createElement(tagName);
            elem.className = className;
            return elem;
        }

        function scrollersFrom(elements, numColumns = 2) {
            const fragment = new DocumentFragment();
            elements.forEach((element, i) => {
                const column = i % numColumns;
                const children = fragment.children;
                if (!children[column]) fragment.appendChild(createElement("ul", "tag-list"));
                children[column].appendChild(element);
            });
            return fragment;
        }

        /*	SPLIT THE LIST ELEMENT INTO TWO LISTS
                AND CALL THE ANIMATION
        */
        const scrollers = scrollersFrom(allTags, 2);
        tagScroller.innerHTML = "";
        tagScroller.appendChild(scrollers);
        addScrolling();

        /*	ADD scrolling CLASS TO THE WRAPPER ELEMENT,
                CLONE EACH LIST ITEM TO MAKE THE LIST LONG ENOUGH
                FOR INFINITE SCROLL AND THEN CALCULATE THE DURATION
                BASED ON WIDTH OF EACH SCROLLER TO MAKE THEM
                MOVE AT THE SAME RATE OF SPEED

                DEPENDING ON THE WIDTH OF .tag-scrollers, THE NUMBER OF
                LIST ITEMS AND THEIR INDIVIDUAL WIDTH, YOU MIGHT NEED
                TO CLONE THEM TWO TIMES EACH TO BE SURE EACH .tag-scroller
                WILL BE WIDE ENOUGH TO SUPPORT INFINITE SCROLL

                THIS COULD OF COURSE BE ADDED TO THE SCRIPT
                BUT FOR OUR USE CASE, WE KNOW THE MINIMUM NUMBER OF
                LIST ELEMENTS WILL BE ENOUGH FOR ONE CLONE EACH
        */
        function addScrolling() {
            tagScroller.classList.add("scrolling");
            document.querySelectorAll(".tag-list").forEach((tagList) => {
                const scrollContent = Array.from(tagList.children);
                scrollContent.forEach((listItem) => {
                    const clonedItem = listItem.cloneNode(true);
                    clonedItem.setAttribute("aria-hidden", true);
                    tagList.appendChild(clonedItem);
                });
                tagList.style.setProperty("--duration", (tagList.clientWidth / 100) + "s");
            });
        }
    }
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