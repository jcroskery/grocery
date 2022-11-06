AppData = {
    url: '159.203.183.114',
    port: '5000',
};

function getXHR(name, post) {
    let xhr = new XMLHttpRequest()
 
    xhr.open('POST', AppData.url + ":" + AppData.port + '/' + name, true)
    xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8')
    xhr.send(post);
    return xhr;
}

let requestData = {
    sessid: document.cookie
}
let xhr = getXHR('optimize', JSON.stringify(requestData))
xhr.onload = () => {
    let json = JSON.parse(xhr.response);
    
}
