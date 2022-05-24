const readdata = document.getElementById("readdata");
const select = document.getElementById("select_year");
const search_bar_element = document.getElementById("search_bar")
let search_bar;
let geoJsons_global = [];
let obj;
let data;
let req;
let map = L.map('mapid').setView([23.683234, 120.1825975], 8);
let tiles = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 12,
    minZoom: 8,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/light-v9'
}).addTo(map);
let draw_the_site = [L.polygon([]).addTo(map)]; //初始化，用來框出選擇的地區
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
    req = new XMLHttpRequest();
    req.open('GET', './data/TOWN_MOI_1100415.json');
    req.send()
    req.onload = function () {
        obj = JSON.parse(req.responseText);
        let geoJson = L.geoJson(obj,{ "color": "#100", "weight": 0.5, "opacity": 0.9 ,onEachFeature:onEachFeature});
        geoJson.addTo(map);
        geoJsons_global.push(geoJson);
    }
}
function onEachFeature(feature, layer) {
    layer.on('click', function (e) {
        let s = Object;
        s.value = feature.properties.COUNTYNAME + feature.properties.TOWNNAME;
        pick_site(s);
        popup(e);
    })
}
function draw(data) {
        obj = JSON.parse(req.responseText);
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
            "opacity": 0.9,
            onEachFeature:onEachFeature
            };
            let geoJson = L.geoJson(element, myStyle);
            geoJson.addTo(map);
            geoJsons_global.push(geoJson);
        });
        //console.log(obj.features[0].properties.COUNTYNAME + obj.features[0].properties.TOWNNAME);
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
        data = JSON.parse(xhr.responseText);
        // readdata.innerHTML = update(data);
        draw(data);
    }
    search_bar_element.innerHTML = `</br>
                                    <div class="autocomplete"">
                                        <input id="myInput" type="text" name="site_name" placeholder="輸入地區...">
                                        <button class="btn" id="btn" onclick="show_site()"><i class="fa fa-search"></i></button>
                                    </div>
                                    `;
    search_bar = document.getElementById("myInput");
    search_bar.focus();
    search_bar.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            show_site();
        }
    })
    document.getElementById("info").innerHTML = "";
})
function update(data){
    let htmlstr = ``;
    data.forEach(element => {
        htmlstr = htmlstr + `
        <div style = "display:inline;">
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
function autocomplete(inp, site_names) {
}
function pick_site(s) {
    console.log(s.value);
    try {
        obj.features.forEach(element => {
            let site = element.properties.COUNTYNAME + element.properties.TOWNNAME;
            if (s.value == site) {
                draw_the_site.forEach(d => {
                    map.removeLayer(d);
                })
                draw_the_site = [];
                let site_loca_oldarr = element.geometry.coordinates;
                let site_loca_newarr = [];
                site_loca_oldarr.forEach(arr => {
                    if (site_loca_oldarr.length == 1) {
                        site_loca_newarr.push(rev(arr));
                    }
                    else if (site_loca_oldarr.length >= 1) {
                        site_loca_newarr.push(rev(arr[0]));
                    }
                })
                site_loca_newarr.forEach(arr => {
                    draw_the_site.push(L.polygon([arr], {}).addTo(map));
                })
            }
            
        });
    } catch {}
}
function popup(e) {
    let site = e.sourceTarget.feature.properties.COUNTYNAME + e.sourceTarget.feature.properties.TOWNNAME;
    try {
        let site_data = data.find(x => x.site_id === site);
        let year = site_data.statistic_yyy;
        let people_total = site_data.people_total;
        let area = site_data.area;
        let population_density = site_data.population_density;
        let content = "民國 : " + year + " 年</br>"
            + site + "</br>" + "總人口 : " + people_total + " 人</br>"
            + "面積 : " + area + " 平方公里</br>" + "人口密度 : " + population_density + " 人/km^2";
        console.log(content);
        let popup = L.popup();
        popup
            .setLatLng(e.latlng)
            .setContent(content)
            .openOn(map);
    } catch { 
        let content = site;
        let popup = L.popup();
                    popup
                        .setLatLng(e.latlng)
                        .setContent(content)
                        .openOn(map);
    }
}
function show_site() {
    let htmlstr;
    const site_info = document.getElementById("info");
    const inp_site = document.getElementById("myInput").value;
    if (inp_site == '')
        return;
    htmlstr = site_class(data, inp_site);
    site_info.innerHTML = htmlstr;

}
function rev(arr) {
    let new_arr = [];
    let new_arr2 = [];
    for (i = 0; i < arr.length; i = i + 1){
        new_arr2 = [];
        for (j = arr[i].length-1; j >= 0; j = j - 1){
            new_arr2.push(arr[i][j]);
        }
        new_arr.push(new_arr2);
    }
    return new_arr;
}
console.log("搜尋'all'可列出所有地區");