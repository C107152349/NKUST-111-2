const readdata = document.getElementById("readdata");
const select = document.getElementById("select_year");

select.addEventListener('change', () => {
    const data_url = "./data/102_110/" + select.value + ".json";
    fetch(data_url)
        .then(res => {
            let data = res.json();
            return data;
        })
        .then(data => {
            //console.log(data);
            readdata.innerHTML = update(data);
    })
})
function update(data){
    let htmlstr = ``;
    data.forEach(element => {
        console.log(element);
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