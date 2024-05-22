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