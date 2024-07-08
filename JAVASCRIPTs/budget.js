document.addEventListener('DOMContentLoaded', function () {
    const main = document.getElementsByTagName('main')[0]
    let dropdownButtons = main.querySelectorAll('.dropdown-toggle');
    // console.log(dropdownButtons)
    let maxWidth = 0;
    // Find the maximum width among all dropdown buttons
    dropdownButtons.forEach(function (button) {
        let width = button.offsetWidth;
        if (width > maxWidth) {
            maxWidth = width;
        }
    });

    // Set the same width for all dropdown buttons
    dropdownButtons.forEach(function (button) {
        button.style.width = maxWidth + 'px';
    });
});

// Wait for DOM content to load
document.addEventListener('DOMContentLoaded', function () {
    // Fetch all dropdown items
    const main = document.getElementsByTagName('main')[0]
    let dropdownItems = main.querySelectorAll('.dropdown-item');
    let selectedValue = null;


    // Function to handle dropdown item click
    function handleDropdownItemClick(event) {
        event.preventDefault(); // Prevent default behavior of <a> tag

        // Get selected year or category from data attribute
        selectedValue = event.target.dataset.year || event.target.dataset.category;

        // Update selectedValue div with selected value and dropdown label
        let parentDropdownLabel = event.target.closest('.dropdown').querySelector('.dropdown-toggle').innerText.trim();
        document.getElementById('typeSelected').innerText = `${parentDropdownLabel}: ${event.target.innerText}`;
        // console.log(parentDropdownLabel);
        // console.log(event.target.parentNode.parentNode.id)
        // console.log(selectedValue);
        // Fetch budget data based on selected value
        fetchBudgetData(parentDropdownLabel, selectedValue);
    }

    // Add click event listener to each dropdown item
    dropdownItems.forEach(function (item) {
        item.addEventListener('click', handleDropdownItemClick);
    });

    // document.getElementById("myDdvButton").addEventListener("click", handleDropdownItemClick);

    // console.log("Dropdown menu event listeners are set up.");
});

// Function to fetch budget data
async function fetchBudgetData(selectedType, selectedValue) {
    try {
        // console.log("The type of data selected is --> " + selectedType + " and the object i need to find is --> " + selectedValue)
        // Fetch JSON data
        let response = await fetch("https://iammistake.github.io/KonceptiProject/podatoci/budget.json");
        let data = await response.json();
        // console.log(data); // Check if data is fetched correctly
        //
        // console.log("Type: " + selectedType + " Value: " + selectedValue)

        // Process and visualize data
        await processAndVisualizeData(data, selectedType, selectedValue);

        // Log selected value for confirmation
        // console.log('Selected Value:', selectedValue);
    } catch (error) {
        console.error('Error fetching or processing budget data:', error);
    }
}

// Function to process and visualize data
async function processAndVisualizeData(data, selectedType, selectedValue) {
    try {
        // Extract selected data based on selectedValue
        // let selectedData = {};


        if (selectedType === "Буџет") {
            selectedData = data[`Буџет ${selectedValue}`];
        } else if (selectedType === "Јавни проекти") {
            selectedData = data[`Јавни проекти`];
        } else if (selectedType === "Институции") {
            selectedData = data[`${selectedValue} - Институции`];
        } else if (selectedType === "Плански региони") {
            selectedData = data[`${selectedValue} - Плански региони`];
        } else if (selectedType === 'Мој ДДВ') {
            selectedData = data['Мој ДДВ']
        } else if (selectedType === 'Фирми') {
            // console.log("Enter firmi")
            // console.log(`Фирми - ${selectedValue}`)
            selectedData = data[`Фирми - ${selectedValue}`]
        } else {
            console.error('Unknown selectedType:', selectedType);
            return;
        }
        // console.log(selectedData)
        if (!selectedData) {
            console.error('No data found for selected value: ' + selectedValue + " and type " + selectedType);
            return;
        }

        // console.log(selectedData)

        // Prepare pie chart data
        let pieData = selectedData.map(d => {
            // Extract all attributes from the object 'd'
            let attributes = Object.keys(d).filter(key => key !== `БУЏЕТ ${selectedValue}`);

            // Construct a new object with all attributes
            let newData = {}

            // Depending on selectedType, populate newData accordingly
            if (selectedType === "Буџет") {
                newData.label = d[`БУЏЕТ ${selectedValue}`];
                newData.value = d['РАСХОДИ НА ОСНОВЕН БУЏЕТ'];
            } else if (selectedType === "Јавни проекти") {
                // console.log(d[0])
                // Object.entries(obj)[0]
                newData.label = Object.entries(d)[0][1];
                newData.value = d['Одвоен буџет(денари)'];
            } else if (selectedType === "Институции") {
                newData.label = Object.entries(d)[0][1];
                newData.value = d['Алоциран износ по проекти'];
            } else if (selectedType === "Плански региони") {
                newData.label = Object.entries(d)[0][1];
                newData.value = d['Алоциран износ по проекти'];
            } else if (selectedType == "Фирми") {
                let firstPart=''

                if (selectedValue === 'Биро за јавни набавки') {
                    newData.label = Object.entries(d)[1][1]
                    firstPart = d['Вредност на договорот'].substring(0, d['Вредност на договорот'].toString().length - 4);
                } else {
                    newData.label = Object.entries(d)[0][1]
                    var indexBlank = d["Износ"].indexOf(' ');
                    firstPart = d["Износ"].substring(0, indexBlank);
                }

                var price = firstPart.replace(/,/g, '.');
                // console.log(price)
                newData.value = price

            } else if (selectedType === "Мој ДДВ") {
                newData.label = Object.entries(d)[0][1]
                let values = Object.entries(d).slice(1, 4).map(entry => parseInt(entry[1]))
                // console.log(values)
                newData.value = values[0] + values[1] + values[2];
            }
            // var i = 0;
            // Include additional attributes from 'd' as needed
            Object.keys(d).forEach(attr => {
                if (attr !== selectedType && attr !== 'label' && attr !== 'value') {
                    // if (i === 0)
                    //     console.log(d[attr])
                    newData[attr] = d[attr];
                    // i++
                }
            });

            return newData;
        });

        // Render pie chart with the prepared data
        await renderPieChart(pieData);
        await renderBarChart(pieData);
        await renderCircleGrid(pieData);
    } catch (error) {
        console.error('Error processing or visualizing data:', error);
    }
}

// Function to render pie chart
async function renderPieChart(data) {
    try {
        // Select SVG container for pie chart
        let svg = d3.select("#pie-chart");
        svg.selectAll("*").remove();  // Clear previous SVG contents

        // Define dimensions and radius for pie chart
        let width = 540;
        let height = 340;
        let radius = Math.min(width, height) / 2;
        data.forEach(d => {
            d.value = parseFloat(d.value);
        });

        // Set SVG attributes
        svg.attr("width", width)
            .attr("height", height);

        // Define color scale for pie segments
        let color = d3.scaleOrdinal(d3.schemeCategory10);

        // Define pie generator
        let pie = d3.pie()
            .value(d => d.value)
            .sort(null);

        // Define arc generator
        let arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius);

        // Append 'g' element for pie chart segments
        let g = svg.append("g")
            .attr("transform", `translate(${width / 2},${height / 2})`)
            .selectAll(".arc")
            .data(pie(data))
            .enter().append("g")
            .attr("class", "arc");

        // Append path elements for pie chart segments
        g.append("path")
            .attr("d", arc)
            .style("fill", d => color(d.data.label))
            .on("mouseover", function (event, d) {
                tooltip.style("display", "block")
                    .html(getTooltipHtml(d.data));
            })
            .on("mousemove", function (event) {
                tooltip.style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 10) + "px");
            })
            .on("mouseout", function () {
                tooltip.style("display", "none");
            });

        // Append tooltip div to body
        let tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("display", "none");

        // Select labels container and clear previous contents
        let labelsContainer = d3.select("#labels");
        labelsContainer.selectAll("*").remove();

        // Append labels with data information
        data.forEach(d => {
            let labelItem = labelsContainer.append("div")
                .attr("class", "label-item");

            labelItem.append("div")
                .attr("class", "label-color")
                .style("background-color", color(d.label));
            // console.log(d)
            labelItem.append("div")
                .html(d.label + " --> <b>" + d.value + "ден</b>"); // Make value bold
        });

        // Function to construct tooltip HTML
        function getTooltipHtml(data) {
            let html = `<div><b>${data.label}</b>: ${data.value}</div>`;
            // Add extra information to tooltip
            let extraInfo = Object.keys(data).filter(key => key !== "label" && key !== "value").map(key => {
                return `<div><b>${key}:</b> ${data[key]}</div>`;
            }).join("");
            html += extraInfo;
            return html;
        }

    } catch (error) {
        console.error('Error rendering pie chart:', error);
    }
}

// Function to render bar chart
async function renderBarChart(data) {
    try {
        // Clear previous SVG contents
        let svg = d3.select("#bar-chart");
        svg.selectAll("*").remove();

        // Define dimensions for the chart
        let margin = {top: 20, right: 30, bottom: 60, left: 60}; // Adjusted for better spacing
        let width = svg.node().getBoundingClientRect().width - margin.left - margin.right;
        let height = svg.node().getBoundingClientRect().height - margin.top - margin.bottom;

        data.forEach(d => {
            d.value = parseFloat(d.value);
        });

        // Set SVG attributes
        svg.attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

        // Create a color scale
        let color = d3.scaleOrdinal(d3.schemeCategory10);

        // Append 'g' element for bars
        let g = svg.append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        // Define x and y scales
        let x = d3.scaleBand()
            .rangeRound([0, width])
            .padding(0.1)
            .domain(data.map(d => d.label));

        let y = d3.scaleLinear()
            .rangeRound([height, 0])
            .domain([0, d3.max(data, d => d.value)]);

        // Add x-axis
        g.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)")
            .attr("font-size", "12px"); // Adjust font size for better fit

        // Add y-axis
        g.append("g")
            .call(d3.axisLeft(y).ticks(10));

        // Add bars
        g.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.label))
            .attr("y", d => y(d.value))
            .attr("width", x.bandwidth())
            .attr("height", d => height - y(d.value))
            .style("fill", (d, i) => color(i));

        // Add labels outside bars
        g.selectAll(".label")
            .data(data)
            .enter().append("text")
            .attr("class", "label")
            .attr("x", d => x(d.label) + x.bandwidth() / 2)
            .attr("y", d => y(d.value) - 10) // Adjust vertical position
            .attr("text-anchor", "middle")
            .attr("font-size", "12px") // Adjust font size for better fit
            .text(d => d.value);

    } catch (error) {
        console.error('Error rendering bar chart:', error);
    }
}

// Function to render circle grid chart with tooltips
async function renderCircleGrid(data) {
    try {
        // Clear previous SVG contents
        let svg = d3.select("#graph-chart");
        svg.selectAll("*").remove();

        // Define dimensions for the chart
        let margin = {top: 20, right: 20, bottom: 20, left: 20}; // Adjust margins as needed
        let width = svg.node().getBoundingClientRect().width - margin.left - margin.right;
        let height = svg.node().getBoundingClientRect().height - margin.top - margin.bottom;

        data.forEach(d => {
            d.value = parseFloat(d.value);
        });

        // Set SVG attributes
        svg.attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

        // Compute the number of circles per row and column based on data length
        let numCols = data.length; // All circles in a single row
        let numRows = 1; // Single row

        // Scale for circle sizes based on data values
        let radiusScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.value)])
            .range([5, Math.min(width / numCols, height / numRows) / 2]); // Adjust range for circle sizes

        // Group for circles
        let g = svg.append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`); // Apply margins

        // Append circles
        let circles = g.selectAll(".circle")
            .data(data)
            .enter().append("circle")
            .attr("class", "circle")
            .attr("cx", (d, i) => (i * (width / numCols)) + (width / numCols / 2))
            .attr("cy", height / 2)
            .attr("r", d => radiusScale(d.value))
            .style("fill", () => getRandomColor()) // Random circle color
            .style("opacity", 0.7) // Circle opacity
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut);

        // Function to handle mouseover event
        function handleMouseOver(event, d) {
            d3.select(this)
                .style("stroke", "black") // Add stroke for better visibility
                .style("stroke-width", 2);

            // Show tooltip
            tooltip.transition()
                .duration(200)
                .style("opacity", 0.9);
            tooltip.html(getTooltipHtml(d))
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 10) + "px");
        }

        // Function to handle mouseout event
        function handleMouseOut(event, d) {
            d3.select(this)
                .style("stroke", "none"); // Remove stroke

            // Hide tooltip
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        }

        // Add labels inside circles
        circles.append("text")
            .attr("class", "circle-label")
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .text(d => d.value);

        // Append tooltip div to body
        let tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        // Function to generate random color
        function getRandomColor() {
            let letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        // Function to construct tooltip HTML
        function getTooltipHtml(data) {
            let html = `<div><b>Value:</b> ${data.value}</div>`;
            // Add additional information from data
            Object.keys(data).forEach(key => {
                if (key !== "value") {
                    html += `<div><b>${key}:</b> ${data[key]}</div>`;
                }
            });
            return html;
        }

    } catch (error) {
        console.error('Error rendering circle grid chart:', error);
    }
}


async function showDDV() {
    let btn = document.getElementById('myDdvButton').innerText
    await fetchBudgetData('Мој ДДВ', 'kiro')
}