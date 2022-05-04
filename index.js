const readdata = document.getElementById("readdata");
const select = document.getElementById("select_year");
const btn = document.getElementById("btn");
let data_global;



var map = L.map('mapid').setView([23.683234, 120.1825975], 8);

var tiles = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 13,
    minZoom: 8,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1
}).addTo(map);
$.getJSON('./data/TOWN_MOI_1100415.json', function(r){
    L.geoJSON(r, {color: '#333'}).addTo(map);
});

select.addEventListener('change', () => {
    const data_url = "./data/102_110/" + select.value + ".json";
    const xhr = new XMLHttpRequest;
    xhr.open("get", data_url, true);
    xhr.send();
    xhr.onload = function () {
        data_global = JSON.parse(xhr.responseText);
        readdata.innerHTML = update(data_global);
    }
    
})
// btn.addEventListener('click', () => {
//     console.log(data_global);
// })

function update(data){
    let htmlstr = ``;
    data.forEach(element => {
        htmlstr = htmlstr + `
        <div align ="center">
            <p> 
                ${element["site_id"]}<br/>
                人口數:${element["people_total"]}<br/>
                面積:${element["area"]}平方公里<br/>
                人口密度:${element["population_density"]}
            </p>
        </div>
        `;
    })
    //回傳更新後字串
    return htmlstr;
}