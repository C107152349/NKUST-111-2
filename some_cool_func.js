function site_class (data, inp) {
    let htmlstr = {};
    inp = inp.replace("台", "臺");
    const County_list = ["新北市", "臺北市", "桃園市", "臺中市", "臺南市", "高雄市",
        "宜蘭縣", "新竹縣", "苗栗縣", "彰化縣", "南投縣", "雲林縣",
        "嘉義縣", "屏東縣", "臺東縣", "花蓮縣", "澎湖縣", "基隆市",
        "新竹市", "嘉義市", "金門縣", "連江縣", "東沙群島", "南沙群島"];
    data.forEach(e => {
        if (e.site_id.search(inp) != -1 || (inp == "all")) {
            County_list.forEach((County) => {
                if (e.site_id.search(County) != -1) {
                    if (!htmlstr[County]) {
                        htmlstr[County] = `<button
                                            class="btn btn-secondary dropdown-toggle" 
                                            type="button"
                                            id="dropdownMenu2"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false">
                                            ${County}</button>
                                            <ul class="dropdown-menu" aria-labelledby="dropdownMenu2">`;
                    }
                    let machi = e["site_id"].replace(County, "")
                    if (machi) {
                        htmlstr[County] = htmlstr[County] + `
                        <li>
                        <button class="dropdown-item" type="button" value ="${machi}" onclick = "pick_site(this)">${machi}</button>
                        </li>`;
                    }
                    else {
                        htmlstr[County] = htmlstr[County] + `
                        <li>
                        <button class="dropdown-item" type="button" value ="${e["site_id"]}" onclick = "pick_site(this)">${e["site_id"]}</button>
                        </li>`;
                    }
                }
            })
        }
    });
    let total_htmlstr = ``;
    for(const [key, value] of Object.entries(htmlstr)) {
        htmlstr[key] = htmlstr[key] + `</ul>`;
        total_htmlstr = total_htmlstr + htmlstr[key];
    }
    return total_htmlstr;
}