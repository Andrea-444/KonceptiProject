// const data = [
//     { name: 'Prilep', employees: 900 },
//     { name: 'Skopje', employees: 1200 },
//     { name: 'Bitola', employees: 800 },
//     { name: 'Centar', employees: 1000 },
//     { name: 'Company E', employees: 600 },
//     { name: 'Company G', employees: 700 },
//     { name: 'Company N', employees: 800 },
//     { name: 'Company M', employees: 840 },
//     { name: 'Company 4', employees: 650 },
//     { name: 'Company 3', employees: 620 },
//     { name: 'Company 3', employees: 620 },
//     { name: 'Company 3', employees: 620 },
//     { name: 'Company 3', employees: 620 },
//     { name: 'Company 3', employees: 620 },
//     { name: 'Company 3', employees: 620 },
//     { name: 'Company 3', employees: 620 },
//     { name: 'Company 3', employees: 620 },
//     { name: 'Company 3', employees: 620 },
//     { name: 'Company 3', employees: 620 },
//     { name: 'Company 3', employees: 620 },
//     { name: 'Company 3', employees: 620 },
//     { name: 'Company 3', employees: 620 },
//     { name: 'Company 3', employees: 620 },
//     { name: 'Company 3', employees: 620 },
//     { name: 'Company 3', employees: 620 },
//     { name: 'Company 3', employees: 620 },
//     { name: 'Company 3', employees: 620 },
//     { name: 'Company 3', employees: 620 },
//     { name: 'Company 3', employees: 620 },
//     { name: 'Company 3', employees: 620 },
//     { name: 'Company 3', employees: 620 },
//     { name: 'Company 2', employees: 790 },
//     { name: 'Company F', employees: 950 }
// ];

// Set up dimensions and radius for the bubble chart
async function createItBubbles(data) {
    // console.log(data)
    const width = window.innerWidth;
    const height = window.innerHeight * 0.8;

// Create SVG element
    const svg = d3.select("#bubble-chart")
        .attr("width", width)
        .attr("height", height);

// Define color scale
    const color = d3.scaleOrdinal(d3.schemeCategory10);

// Define bubble simulation
    const simulation = d3.forceSimulation(data)
        .force("x", d3.forceX(width / 0.9).strength(0.005))
        .force("y", d3.forceY(height / 2.2).strength(0.07))
        .force("collide", d3.forceCollide(d => d.employees * 0.05 + 20))
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
    let data = await fetchData("https://iammistake.github.io/KonceptiProject/KonceptiProject/podatoci/itIndustrija.json")
    let companies = []
    for (let i = 0; i < data.length; i++) {
        let tempObj = {}

        tempObj.name = data[i]["ИменаКомпанија"]
        let brEmpl = parseInt(data[i]["Брнавработени"]);
        if (brEmpl > 1500) {
            brEmpl /= 4
        }
        tempObj.employees = brEmpl + 500

        companies.push(tempObj)
    }
    // console.log(companies)
    await createItBubbles(companies)
    addItClickEvent(data)
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
                            marker = [21.44, 42.02]
                        } else if (kade.includes('Прилеп')) {
                            marker = [21.565, 41.37]
                        } else if (kade.includes('Охрид')) {
                            marker = [20.44, 41.02]
                        } else if (kade.includes('Битола')) {
                            marker = [21.34, 41.05]
                        } else if (kade.includes('Струмица')) {
                            marker = [20.94, 41.52]
                        } else {
                            marker = [22.44, 42.02]
                        }
                    } else {
                        if (kade === 'Скопје') {
                            marker = [21.44, 42.02]
                        } else if (kade === 'Прилеп') {
                            marker = [21.565, 41.37]
                        } else if (kade === 'Охрид') {
                            marker = [20.44, 41.02]
                        } else if (kade === 'Битола') {
                            marker = [21.34, 41.05]
                        } else if (kade === 'Струмица') {
                            marker = [20.94, 41.52]
                        } else {
                            marker = [22.44, 42.02]
                        }
                    }

                    about.push(data[i]["Годинанаосновање"])
                    about.push(data[i]["Брнавработени"])
                    about.push(data[i]["Програмскијазици"].length)
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
