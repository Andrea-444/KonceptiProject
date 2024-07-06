// Set up dimensions and radius for the bubble chart
async function createItBubbles(data) {
    // console.log(data)
    let innerWidth1 = window.innerWidth;
    const width = innerWidth1;
    const height = window.innerHeight * 0.8;

// Create SVG element
    const svg = d3.select("#bubble-chart")
        .attr("width", width)
        .attr("height", height);

// Define color scale
    const color = d3.scaleOrdinal(d3.schemeCategory10);

// Define bubble simulation
    let strX = 0.00485
    let strY = 0.06
    let strCollide = 12;
    let heightDevisitor = 2.1;
    if (innerWidth <= 1650) {
        if (innerWidth1 <= 1500) {
            // heightDevisitor = 1.8
            strY = 0.05
            strCollide = 10
        }
        if (innerWidth1 <= 1400) {
            // heightDevisitor = 1.8
            strY = 0.03
            strCollide = 9
        }
        if (innerWidth1 <= 1200) {
            heightDevisitor = 1.8
            strY = 0.02
            strCollide = 6
        }
        if (innerWidth1 <= 1000) {
            heightDevisitor = 1.8
            strY = 0.02
            strCollide = 5
        }
        if (innerWidth1 <= window.innerHeight) {
            strY = 0.00615
            strCollide = 8
            heightDevisitor = 1.1
        }
        if (innerWidth1 <= window.innerHeight - 300) {
            heightDevisitor = 1
            strY = 0.005
            strCollide = 9
        }
    }
    const simulation = d3.forceSimulation(data)
        .force("x", d3.forceX(width / 0.9).strength(strX))
        .force("y", d3.forceY(height / heightDevisitor).strength(strY))
        .force("collide", d3.forceCollide(d => d.employees * 0.05 + strCollide))
        .stop();

    for (let i = 0; i < 120; ++i) simulation.tick();

// Draw bubbles
    const bubbles = svg.selectAll(".bubble")
        .data(data)
        .enter().append("circle")
        .attr("class", "bubble")
        .attr("r", d => d.employees * 0.05)
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("fill", (d, i) => color(i));

// Add labels to bubbles
    const labels = svg.selectAll(".label")
        .data(data)
        .enter().append("text")
        .attr("class", "label")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("fill", "black")
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .text(d => `${d.name}`);

// Adjust label positions
    labels.attr("x", d => d.x)
        .attr("y", d => d.y);

// Restart the simulation to ensure proper positioning
    simulation.nodes(data)
        .on("tick", () => {
            bubbles.attr("cx", d => d.x)
                .attr("cy", d => d.y);

            labels.attr("x", d => d.x)
                .attr("y", d => d.y);
        });

    simulation.alpha(1).restart();
}

async function fetchItData() {
    let data = await fetchData("https://iammistake.github.io/KonceptiProject/podatoci/itIndustrija.json");
    let companies = [];
    for (let i = 0; i < data.length; i++) {
        let tempObj = {};

        tempObj.name = data[i]["ИменаКомпанија"];
        let brEmpl = parseInt(data[i]["Брнавработени"]);
        if (brEmpl > 1000) {
            brEmpl = 1000;
        }
        tempObj.employees = brEmpl + 350;

        companies.push(tempObj);
    }

    await createItBubbles(companies);
    await createPieChart(data);
    addItClickEvent(data);
}


function addItClickEvent(data) {
    let circles = document.getElementsByTagName('circle')
    let circlesTexts = document.getElementsByTagName('text')

    for (let circle of circles) {
        circle.addEventListener('click', () => {
            let which
            for (let circlesText of circlesTexts) {
                if (circlesText.x.animVal[0].value === circle.cx.animVal.value && circlesText.y.animVal[0].value === circle.cy.animVal.value) { // mozebi convert za string
                    which = circlesText.innerHTML
                    break
                }
            }
            // [21.74, 41.60],
//     "Prilep": [21.565, 41.37],
//     "Bitola": [21.34, 41.05],
//     "Skopje": [21.44, 42.02],

            // ["Karpos 1, Skopje", 1000, 100, 11.5, [500, 550, 600, 850, 700, 750, 800, 740, 800, 600]],

            let marker = []
            let about = []
            for (let i = 0; i < data.length; i++) {
                if (data[i]["ИменаКомпанија"] === which) {
                    let kade = data[i]["Локација"]
                    if (Array.isArray(kade)) {
                        if (kade.includes('Скопје')) {
                            marker = [
                                21.4097395,
                                41.9985988
                            ]
                        } else {
                            marker = [22.44, 42.02]
                        }
                    } else {
                        if (kade === 'Скопје') {
                            marker = [
                                21.4097395,
                                41.9985988
                            ]
                        } else if (kade === 'Прилеп') {
                            marker = [
                                21.552832,
                                41.346878
                            ]
                        } else if (kade === 'Охрид') {
                            marker = [
                                20.804352,
                                41.113532
                            ]
                        } else if (kade === 'Битола') {
                            marker = [
                                21.33146280340948,
                                41.03219121423016
                            ]
                        } else if (kade === 'Струмица') {
                            marker = [
                                22.63701587471554,
                                41.43730797752894
                            ]
                        } else if (kade === 'Штип') {
                            marker = [
                                22.191319434098016,
                                41.736028210137356
                            ]
                        } else if (kade === 'Велес') {
                            marker = [
                                21.771876,
                                41.714939
                            ]
                        } else {
                            marker = [21.44, 42.02]
                        }
                    }

                    about.push(data[i]["Годинанаосновање"])
                    about.push(data[i]["Брнавработени"])
                    about.push(data[i]["Програмскијазици"])
                    about.push(data[i]["Работнапозиција"])
                }
            }

            changeSchool(which, marker, about)
            let schLoc = document.getElementById('schoolLocation')
            schLoc.scrollIntoView({
                behavior: 'smooth' // Smooth scrolling
            });
        })

        
    }
}
fetchItData()

function countLanguages(data) {
    let languageCount = {};
    data.forEach(company => {
        if (company["Програмскијазици"]) {
            company["Програмскијазици"].forEach(language => {
                if (languageCount[language]) {
                    languageCount[language]++;
                } else {
                    languageCount[language] = 1;
                }
            });
        }
    });
    return languageCount;
}

async function createPieChart(data) {
    let languageCount = countLanguages(data);

    const ctx = document.getElementById('languagesPieChart').getContext('2d');
    const languagesPieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(languageCount),
            datasets: [{
                label: 'Programming Languages Distribution',
                data: Object.values(languageCount),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right'
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return 'Број на компании кои го користат: ' + tooltipItem.raw.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}


