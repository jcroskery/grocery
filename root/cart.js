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
let xhr = getXHR('optimize', JSON.stringify(requestData))
xhr.onload = () => {
    let json = JSON.parse(xhr.response);
    let line_break = document.createElement("br");
    let winnerSpan = document.createElement("span");
    winnerSpan.id = 'winner';
    winnerSpan.innerText = "Lowest Price";
    document.getElementById(json.winner).appendChild(line_break);
    document.getElementById(json.winner).appendChild(winnerSpan);
    let nofrillsprice = 0;
    for (obj in json.shoppinglist.zero) {
        nofrillsprice += obj.price
    }
    document.getElementById("nofrills-price").innerText = "$" + nofrillsprice;
    let loblawsprice = 0;
    for (obj in json.shoppinglist.one) {
        loblawsprice += obj.price
    }
    document.getElementById("loblaws-price").innerText = "$" + loblawsprice;
    let metroprice = 0;
    for (obj in json.shoppinglist.two) {
        metroprice += obj.price
    }
    document.getElementById("metro-price").innerText = "$" + metroprice;
    row.push(json.shoppinglist.zero);
    row.push(json.shoppinglist.one);
    row.push(json.shoppinglist.two);
}
function goBack() {
    if (AppData.grey_div != null) {
        document.getElementById('body').removeChild(grey_div);
        AppData.grey_div = null;
    }
}
function displayList(n) {
    let grey_div = document.createElement("div");
    grey_div.id = 'grey_div';
    document.getElementById('body').append(grey_div);
    let row = AppData.row[n];
    let back_button = document.createElement("button");
    back_button.id = 'back_button';
    back_button.innerText = "back";
    back_button.addEventListener('click', () => {
        goBack();
    })
    let name_header_span = document.createElement("span");
    name_header_span.id = "name_header_span";
    let price_header_span = document.createElement("span");
    price_header_span.id = "price_header_span";
    grey_div.append(back_button);
    grey_div.append(name_header_span);
    grey_div.append(price_header_span);
    for (obj in row) {
        let name_span = document.createElement("span");
        name_span.classList = "name_span";
        name_span.innerText = obj.name;
        let price_span = document.createElement("span");
        price_span.classList = "price_span";
        price_span.innerText = '$' + obj.price;
        grey_div.append(name_span);
        grey_div.append(price_span);
    }
    AppData.grey_div = grey_div;
}
displayList(0);
for (i in [0, 1, 2]) {
    document.getElementById(i).addEventListener('click', () => {
        if (AppData.row.length > i) {
            displayList(i);
        }
    })
}

