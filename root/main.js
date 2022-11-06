function dec2hex (dec) {
    return dec.toString(16).padStart(2, "0")
}
function getXHR(name, post) {
    let xhr = new XMLHttpRequest()
 
    xhr.open('POST', "http://" + AppData.url + ":" + AppData.port + '/' + name, true)
    xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8')
    xhr.send(post);
    return xhr;
}
  
// generateId :: Integer -> String
function generateId (len) {
    return Math.floor(Math.random() * 4000000);
}

AppData = {
    sessid: '',
    rows: [],
    url: '159.203.6.121',
    port: '5000',
};



if (document.cookie != '') {
    //Call backend api to get stuff
    let requestData = {
        session_id: document.cookie
    }
    let xhr = getXHR('order', JSON.stringify(requestData))
    xhr.onload = () => {
        //Update rows
        let json = JSON.parse(xhr.response);
        console.log(json)
        let idx = 0;
        for (row in json.order) {
            add_row(json.order[row].name, json.order[row].number * 100, ' ' + json.order[row].units, '$' + json.order[row].estimated_cost.toFixed(2), idx++)
        }
        update_estimated_total();
    }
    
} else {
    document.cookie = generateId(64)
}
AppData.sessid = document.cookie

function update_estimated_total() {
    total_money = 0
    for (row in AppData.rows) {
        total_money += string_to_price(AppData.rows[row][4].innerText)
        
        console.log(string_to_price(AppData.rows[row][4].innerText))
    }
    document.getElementById("total-price").innerText = price_to_string(total_money)
}

function handle_returned_data(data, idx) {
    let row = AppData.rows[idx];
    let json = JSON.parse(data);
    row[3].innerText = ' ' + json.unit;
    row[4].innerText = price_to_string(json.estimated_price);
    update_estimated_total()
}
function price_to_string(price) {
    return "$" + price.toFixed(2)
}
function string_to_price(string) {
    return +(string.split('$')[1])
}

function add_row(name, number, unit, estimated_cost, idx) {
    let item_name_span = document.createElement("span");
    item_name_span.classList = 'item-name ' + idx;
    item_name_span.innerText = name;
    let unit_div = document.createElement("div");
    unit_div.classList = 'unit-div ' + idx;
    let quantity_span = document.createElement("input");
    quantity_span.type = 'number';
    quantity_span.classList = 'quantity ' + idx;
    quantity_span.value = number;
    let unit_span = document.createElement("span");
    unit_span.classList = 'unit ' + idx;
    unit_span.innerText = unit;
    unit_div.appendChild(quantity_span);
    unit_div.appendChild(unit_span);
    let cost_span = document.createElement("span");
    cost_span.classList = 'cost ' + idx;
    cost_span.innerText = estimated_cost;
    quantity_span.addEventListener('blur', () => {
        returned_value = Math.ceil(quantity_span.value / 100)
        quantity_span.value = returned_value * 100
        let requestData = {
            session_id: AppData.sessid,
            quantity: returned_value,
            name: item_name_span.innerText
        }
        let xhr = getXHR('edit', JSON.stringify(requestData))
        // Edit request
    });
    let delete_button = document.createElement('button');
    delete_button.classList = 'delete-button ' + idx;
    delete_button.innerHTML = '<img width="20" src="images/trash.png">';
    delete_button.addEventListener('click', () => {
        let requestData = {
            name: item_name_span.innerText,
            session_id: AppData.sessid
        }
        getXHR('delete', JSON.stringify(requestData))
        // Make delete request
        document.getElementById("list").removeChild(item_name_span);
        document.getElementById("list").removeChild(unit_div);
        document.getElementById("list").removeChild(cost_span);
        document.getElementById("list").removeChild(delete_button);
        AppData.rows.splice(idx, 1)
        update_estimated_total()
    });
    row = [item_name_span, unit_div, quantity_span, unit_span, cost_span, delete_button]
        document.getElementById("list").insertBefore(item_name_span, document.getElementById("check-out"));
        document.getElementById("list").insertBefore(unit_div, document.getElementById("check-out"));
        document.getElementById("list").insertBefore(cost_span, document.getElementById("check-out"));
        document.getElementById("list").insertBefore(delete_button, document.getElementById("check-out"));
    AppData.rows.push(row);
}

document.getElementById("add-row").addEventListener('click', () => {
    let search = document.getElementById("search").value;
    let amount = document.getElementById("amount").value;
    let requestData = {
        name: search,
        number: amount,
        session_id: AppData.sessid
    }
    let xhr = getXHR('addorder', JSON.stringify(requestData))
    xhr.onload = () => {
        handle_returned_data(xhr.response, AppData.rows.length - 1);
    }
    add_row(search, amount * 100, ' g', 'Calculating...', AppData.rows.length)
})

document.getElementById("check-out").addEventListener('click', () => {
    window.location = '/checkout.html';
})
