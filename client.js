const crypto = require('crypto');
const https = require('https');

const apiKey = "add api key here";
const privateKey = "add private key here";
const baseUrl = "api.btcmarkets.net";

function makeHttpCall(method, path, queryString, dataObj) {
    var data = null;
    if (dataObj) {
        data = JSON.stringify(dataObj);
    }
    const headers = buildAuthHeaders(method, path, data);
    let fullPath = path;
    if (queryString != null) {
        fullPath += '?' + queryString
    }
    const httpOptions = {host: baseUrl, path: fullPath, method: method, headers: headers};
    var req = https.request(httpOptions, function(res) {
        var output = '';
        res.on('data', function (chunk) {
            output += chunk;
        });
        res.on('end', function () {
            console.log(output);
        });
        console.log("response code: " + res.statusCode);
    });
    if (data) {
        req.write(data);
    }
    req.end();
}

function buildAuthHeaders(method, path, data) {
    const now = Date.now();
    let message =  method + path + now;
    if (data) {
        message += data;
    }
    const signature = signMessage(privateKey, message);
    const headers = {
        "Accept": "application/json",
        "Accept-Charset": "UTF-8",
        "Content-Type": "application/json",
        "BM-AUTH-APIKEY": apiKey,
        "BM-AUTH-TIMESTAMP": now,
        "BM-AUTH-SIGNATURE": signature
    };
    return headers;
}

function signMessage(secret, message) {
    var buffer = Buffer.from(secret, 'base64');
    var hmac = crypto.createHmac('sha512', buffer);
    var signature = hmac.update(message).digest('base64');
    return signature;
}

function getOpenOrders() {
    const path = '/v3/orders';
    makeHttpCall('GET', path, 'status=open', null);
}

function placeOrder() {
    const data = {
        marketId: 'XRP-AUD',
        price: '0.1',
        amount: "0.1",
        side: "Bid",
        type: "Limit"
    }
    const path = '/v3/orders';
    makeHttpCall('POST', path, null, data);
}

function cancelOrder(id) {
    const path = '/v3/orders/' + id ;
    makeHttpCall('DELETE', path, null, null);
}

// please add your API keys and uncomment any of the following methods to use

//placeOrder();
getOpenOrders();
//cancelOrder("1");
