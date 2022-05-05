const readdata = document.getElementById("readdata");
const select = document.getElementById("select_year");

let geoJsons_global = [];

let map = L.map('mapid').setView([23.683234, 120.1825975], 8);
let tiles = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 13,
    minZoom: 8,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/light-v9',
    tileSize: 512,
    zoomOffset: -1
}).addTo(map);
function getColor(d) {
    return d > 40000 ? '#800026' :
           d > 3000  ? '#BD0026' :
           d > 2000  ? '#E31A1C' :
           d > 1000  ? '#FC4E2A' :
           d > 500   ? '#FD8D3C' :
           d > 200   ? '#FEB24C' :
           d > 100   ? '#FED976' :
                      '#FFEDA0';
}
function first_draw() {
    let req = new XMLHttpRequest();
    req.open('GET', './data/TOWN_MOI_1100415.json');
    req.send()
    req.onload = function () {
        let obj = JSON.parse(req.responseText);
        let geoJson = L.geoJson(obj, { "color": "#100", "weight": 0.5, "opacity": 0.9 });
        geoJson.addTo(map);
        geoJsons_global.push(geoJson);
    }
}
function draw(data) {
    let req = new XMLHttpRequest();
    req.open('GET', './data/TOWN_MOI_1100415.json');
    req.send()
    req.onload = function () {
        let obj = JSON.parse(req.responseText);
        geoJsons_global.forEach(geoJson => {
            map.removeLayer(geoJson);
        });
        geoJsons_global = [];
        obj.features.forEach(element => {
            
            let site = element.properties.COUNTYNAME + element.properties.TOWNNAME;
            // console.log(site);
            // console.log(data.find(x => x.site_id === site).population_density);
            let myStyle = {
            "fillColor": getColor(data.find(x => x.site_id === site).population_density),
            "color": "#100",
            "weight": 0.5,
            "opacity": 0.9
            };
            let geoJson = L.geoJson(element, myStyle);
            geoJson.addTo(map);
            geoJsons_global.push(geoJson);
        });
        //console.log(obj.features[0].properties.COUNTYNAME + obj.features[0].properties.TOWNNAME);
    }
}

// $.getJSON('./data/TOWN_MOI_1100415.json', function(r){
//     L.geoJSON(r, {color: '#333'}).addTo(map);
// });
first_draw();
select.addEventListener('change', () => {
    const data_url = "./data/102_110/" + select.value + ".json";
    const xhr = new XMLHttpRequest;
    xhr.open("get", data_url, true);
    xhr.send();
    xhr.onload = function () {
        let data = JSON.parse(xhr.responseText);
        readdata.innerHTML = update(data);
        draw(data);
    }
})
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