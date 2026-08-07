async function loadPlanurtrip(){

    const response =
        await fetch("planurtrip.html");

    const html =
        await response.text();

    document.querySelector(".planurtrip-container").innerHTML = html;
    initializePlanner();

}
loadPlanurtrip();

function initializePlanner()
{
    initializeGeoapify();
    initializeAddroom();
    initializeformDatacollector();

}
