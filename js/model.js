const policyID = "a5bb0e5bb275a573d744a021f9b3bff73595468e002755b447e01559";
var pets = [];

function loadAssets(walletAddress, callback) {
    var url = 'https://pool.pm/wallet/' + walletAddress;
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        callback(xhr);
    };
    xhr.responseType = "json";
    xhr.open('GET', url);
    xhr.send();
}

function getHoskyRarity(hoskyNumber, callback) {
    var url = `https://tools-anywhere.herokuapp.com/https://cnft.tools/project/hosky/${hoskyNumber}`;
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        callback(xhr.response);
    };
    xhr.responseType = "json";
    xhr.open('GET', url);
    xhr.send();
}

function getHoskyNumber(hosky) {
    let hoskyNumber = hosky.name.substring(13);
    hoskyNumber = parseInt(hoskyNumber, 10);
    return hoskyNumber;
}