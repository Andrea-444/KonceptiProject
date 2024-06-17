async function fetchData(pth)
{
    try
    {
        let response = await fetch(pth);
        return response.json();
    }
    catch (e)
    {
        console.error("Error:", e);
    }
}

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}