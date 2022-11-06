AppData = {
    url: '159.203.6.121',
    port: '5000',
    row: [],
    grey_div: null
};

function getXHR(name, post) {
    let xhr = new XMLHttpRequest()

    xhr.open('POST', "http://" + AppData.url + ":" + AppData.port + '/' + name, true)
    xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8')
    xhr.send(post);
    return xhr;
}

let requestData = {
    session_id: document.cookie
}
//let xhr = getXHR('optimize', JSON.stringify(requestData))
//xhr.onload = () => {
//    loaded(JSON.parse(xhr.response));
//};
function loaded (json) {
    let line_break = document.createElement("br");
    let winnerSpan = document.createElement("span");
    winnerSpan.id = 'winner';
    winnerSpan.innerText = "Lowest Price";
    document.getElementById(json.shopping_list.winner).appendChild(line_break);
    document.getElementById(json.shopping_list.winner).appendChild(winnerSpan);
    let nofrillsprice = 0;
    for (obj in json.shopping_list.zero) {
        nofrillsprice += json.shopping_list.zero[obj].price
    }
    document.getElementById("nofrills-price").innerText = "$" + nofrillsprice.toFixed(2);
    let loblawsprice = 0;
    for (obj in json.shopping_list.one) {
        loblawsprice += json.shopping_list.one[obj].price
    }
    document.getElementById("loblaws-price").innerText = "$" + loblawsprice.toFixed(2);
    let metroprice = 0;
    for (obj in json.shopping_list.two) {
        metroprice += json.shopping_list.two[obj].price
    }
    document.getElementById("metro-price").innerText = "$" + metroprice.toFixed(2);
    AppData.row.push(json.shopping_list.zero);
    AppData.row.push(json.shopping_list.one);
    AppData.row.push(json.shopping_list.two);
}
function goBack() {
    if (AppData.grey_div != null) {
        document.getElementById('body').removeChild(grey_div);
        AppData.grey_div = null;
    }
}
function displayList(n) {
    let image;
    if (n == 0) {
        image = '<img id="listimage" src="images/nofrills.png" width="200px"></img>'
    } else if (n == 1) {
        image = '<img id="listimage" src="images/loblaws.png" width="200px"></img>'
    } else {
        image = '<img id="listimage" src="images/metro.png" width="200px"></img>'
    }
    let grey_div = document.createElement("div");
    grey_div.id = 'grey_div';
    document.getElementById('body').append(grey_div);
    let row = AppData.row[n];
    let back_button = document.createElement("button");
    back_button.id = 'back_button';
    back_button.innerHTML = "<img src='images/back.png' width='40px'>";
    back_button.addEventListener('click', () => {
        goBack();
    })
    let grid_div = document.createElement("div");
    grid_div.id = "grid_div";
    grid_div.innerHTML = image;
    let name_header_span = document.createElement("span");
    name_header_span.id = "name_header_span";
    name_header_span.innerText = "Product Name";
    let price_header_span = document.createElement("span");
    price_header_span.id = "price_header_span";
    price_header_span.innerText = "Price";
    grey_div.append(back_button);
    grid_div.append(name_header_span);
    grid_div.append(price_header_span);
    for (obj in row) {
        let name_span = document.createElement("span");
        name_span.classList = "name_span";
        name_span.innerText = row[obj].name;
        let price_span = document.createElement("span");
        price_span.classList = "price_span";
        price_span.innerText = '$' + row[obj].price;
        grid_div.append(name_span);
        grid_div.append(price_span);
    }
    grey_div.append(grid_div);
    AppData.grey_div = grey_div;
}
for (i in [0, 1, 2]) {
    document.getElementById(i).addEventListener('click', () => {
        if (AppData.row.length > i) {
            displayList(i);
        }
    })
}

fetch("./sample.json")
.then(response => {
   return response.json();
})
.then(data => loaded(data));
