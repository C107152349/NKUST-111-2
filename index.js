const readdata = document.getElementById("readdata");
const select = document.getElementById("select_year");
const btn = document.getElementById("btn");
let data_global;
let map;
initmap();
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
btn.addEventListener('click', () => {
    console.log(data_global);
})
function initmap() {
    let mapOptions = {
        center: new google.maps.LatLng(25.04674, 121.54168),
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    const map_url = "./data/TOWN_MOI_1100415.json";
    let mapElement = document.getElementById("mapDiv");
    map = new google.maps.Map(mapElement, mapOptions);
    map.data.loadGeoJson(map_url);
}
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