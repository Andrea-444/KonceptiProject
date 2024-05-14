
// Sample data for the graph
const statData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August'],
    datasets: [{
        label: 'Sales',
        backgroundColor: 'rgba(255,255,255,0.63)', // Bar color
        borderColor: 'rgb(58,100,45)',
        borderWidth: 2,
        data: [200, 350, 280, 450, 300, 800, 1200, 100] // Data values
    }]
};

// Configuration options
const statOptions = {
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true,
                fontColor: 'white', // Set text color to white
                color: 'white' // Set line color to white
            },
            gridLines: {
                color: 'white' // Set grid line color to white
            }
        }],
        xAxes: [{
            ticks: {
                fontColor: 'white', // Set text color to white
                color: 'white' // Set line color to white
            },
            gridLines: {
                color: 'white' // Set grid line color to white
            }
        }]
    }
};

// Get the context of the canvas element we want to select
const statCtx = document.getElementById('stats').getContext('2d');

// Create the pillar graph
const statPillarGraph = new Chart(statCtx, {
    type: 'bar',
    data: statData,
    options: statOptions
});