document.addEventListener('DOMContentLoaded', function () {
    let dropdownButtons = document.querySelectorAll('.dropdown-toggle');
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
    let dropdownItems = document.querySelectorAll('.dropdown-item');
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
        console.log("The type of data selected is --> " + selectedType + " and the object i need to find is --> " + selectedValue)
        // Fetch JSON data
        let response = await fetch("https://iammistake.github.io/KonceptiProject/podatoci/budget.json");
        let data = await response.json();
        console.log(data); // Check if data is fetched correctly

        console.log("Type: " + selectedType + " Value: " + selectedValue)

        // Process and visualize data
        await processAndVisualizeData(data, selectedType, selectedValue);

        // Log selected value for confirmation
        console.log('Selected Value:', selectedValue);
    } catch (error) {
        console.error('Error fetching or processing budget data:', error);
    }
}

// Function to process and visualize data
async function processAndVisualizeData(data, selectedType, selectedValue) {
    try {
        // Extract selected data based on selectedValue
        let selectedData = {};


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
            console.log("Enter firmi")
            console.log(`Фирми - ${selectedValue}`)
            selectedData = data[`Фирми - ${selectedValue}`]
        } else {
            console.error('Unknown selectedType:', selectedType);
            return;
        }
        console.log(selectedData)
        if (!selectedData) {
            console.error('No data found for selected value: ' + selectedValue + " and type " + selectedType);
            return;
        }

        console.log(selectedData)

        // Prepare pie chart data
        let pieData = selectedData.map(d => {
            // Extract all attributes from the object 'd'
            let attributes = Object.keys(d).filter(key => key !== `БУЏЕТ ${selectedValue}`);

            // Construct a new object with all attributes
            let newData = {}

            // if (selectedType === "Буџет") {
            //     let newData = {label: d[`БУЏЕТ ${selectedValue}`], value: d['РАСХОДИ НА ОСНОВЕН БУЏЕТ']};
            //     attributes.forEach(attr => {
            //         newData[attr] = d[attr];
            //     });
            // } else if (selectedType === "Јавни проекти") {
            //     let newData = {label: d[`Јавни проекти`], value: d['Одвоен буџет(денари)']};
            //     attributes.forEach(attr => {
            //         newData[attr] = d[attr];
            //     });
            // } else if (selectedType === "Институции") {
            //     let newData = {label: d[`Институции`], value: d['Одвоен буџет(денари)']};
            //     attributes.forEach(attr => {
            //         newData[attr] = d[attr];
            //     });
            // } else if (selectedType === "Планински регион") {
            //     let newData = {label: d[`${selectedValue} - Планински регион`], value: d['Одвоен буџет(денари)']};
            //     attributes.forEach(attr => {
            //         newData[attr] = d[attr];
            //     });
            // } else {
            //     console.error('Unknown selectedType:', selectedType);
            //     return;
            // }

            // Depending on selectedType, populate newData accordingly
            if (selectedType === "Буџет") {
                newData.label = d[`БУЏЕТ ${selectedValue}`];
                newData.value = d['РАСХОДИ НА ОСНОВЕН БУЏЕТ'];
            } else if (selectedType === "Јавни проекти") {
                console.log(d[0])
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
                newData.label = Object.entries(d)[0][1]

                var indexBlank = d["Износ"].indexOf(' ');

                var firstPart = d["Износ"].substring(0, indexBlank);

                var price = firstPart.replace(/,/g, '.');
                console.log(price)
                newData.value = price
            } else if (selectedType === "Мој ДДВ"){
                newData.label = Object.entries(d)[0][1]
                let values = Object.entries(d).slice(1, 4).map(entry => parseInt(entry[1]))
                console.log(values)
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
            console.log(d)
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

async function showDDV() {
    let btn = document.getElementById('myDdvButton').innerText
    await fetchBudgetData('Мој ДДВ', 'kiro')
}