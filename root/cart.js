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
    loaded(JSON.parse(xhr.response));
};
function loaded (json) {
    console.log("loaded")
    let line_break = document.createElement("br");
    let winnerSpan = document.createElement("span");
    
    //document.getElementById(json.shopping_lists.winner).appendChild(line_break);
    //document.getElementById(json.shopping_lists.winner).appendChild(winnerSpan);
    let nofrillsprice = 0;
    console.log(json)
    for (obj in json.shopping_lists.NoFrills) {
        nofrillsprice += json.shopping_lists.NoFrills[obj].price
    }
    document.getElementById("nofrills-price").innerText = "$" + nofrillsprice.toFixed(2);
    let loblawsprice = 0;
    for (obj in json.shopping_lists.Loblaws) {
        loblawsprice += json.shopping_lists.Loblaws[obj].price
    }
    document.getElementById("loblaws-price").innerText = "$" + loblawsprice.toFixed(2);
    let metroprice = 0;
    for (obj in json.shopping_lists.Metro) {
        metroprice += json.shopping_lists.Metro[obj].price
    }
    if (nofrillsprice <= loblawsprice && nofrillsprice <= metroprice) {
        document.getElementById(0).classList += ' winner_colour';
    }
    if (loblawsprice <= nofrillsprice && loblawsprice <= metroprice) {
        document.getElementById(1).classList += ' winner_colour';
    }
    if (metroprice <= loblawsprice && metroprice <= nofrillsprice) {
        document.getElementById(2).classList += ' winner_colour';
    }
    document.getElementById("metro-price").innerText = "$" + metroprice.toFixed(2);
    AppData.row.push(json.shopping_lists.NoFrills);
    AppData.row.push(json.shopping_lists.Loblaws);
    AppData.row.push(json.shopping_lists.Metro);
}
function goBack() {
    if (AppData.grey_div != null) {
        document.getElementById('body').removeChild(grey_div);
        AppData.grey_div = null;
    }
}
const loader = document.querySelector("#loading");
function displayList(n) {
    loader.classList.remove("display");
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
    back_button.innerHTML = "<img id='back_image' src='images/back.png' width='40px'>";
    let grid_div = document.createElement("div");
    grid_div.id = "grid_div";
    let name_header_span = document.createElement("span");
    name_header_span.id = "name_header_span";
    name_header_span.innerText = "Product Name";
    let price_header_span = document.createElement("span");
    price_header_span.id = "price_header_span";
    price_header_span.innerText = "Price";
    grey_div.append(back_button);
    grey_div.innerHTML += image;
    grid_div.append(name_header_span);
    grid_div.append(price_header_span);
    for (obj in row) {
        let name_span = document.createElement("span");
        name_span.classList = "name_span";
        name_span.innerText = row[obj].name;
        let price_span = document.createElement("span");
        price_span.classList = "price_span";
        price_span.innerText = '$' + row[obj].price.toFixed(2);
        grid_div.append(name_span);
        grid_div.append(price_span);
    }
    grey_div.append(grid_div);
    document.getElementById("back_image").addEventListener('click', () => {
        goBack();
    })
    AppData.grey_div = grey_div;
}
document.getElementById(0).addEventListener('click', () => {
    if (AppData.row.length > 0) {
        displayList(0);
    }
})
document.getElementById(1).addEventListener('click', () => {
    if (AppData.row.length > 1) {
        displayList(1);
    }
})
document.getElementById(2).addEventListener('click', () => {
    if (AppData.row.length > 2) {
        displayList(2);
    }
})
//loader.classList.add("display");
