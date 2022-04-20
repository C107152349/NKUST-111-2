const readdata = document.getElementById("readdata");

load_data("./data/TaiChung_111_04_19.json");
function load_data(url){
    //從"./data/11007.json"讀取data
    fetch(url,{method:'GET'}).then(response =>{
        //回傳json檔
        return response.json();
    }).then(result =>{
        //讀取回傳json至result，json預設照時間排序
        //更新index.html
        readdata.innerHTML = update(result);
    })
}
function update(data){
    let htmlstr =``
    data.forEach(element =>{
        htmlstr = htmlstr + `
        <div align ="center">
            <p> 
                案號:${element["案號"]}
                ${element["發生日期"]}<br/>
                ${element["地址"]}<br/>
                起:${element["起"]} 訖:${element["訖"]}
            </p>
        </div>
        `;
    })
    //回傳更新後字串
    return htmlstr;
}