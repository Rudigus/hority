const policyID = "a5bb0e5bb275a573d744a021f9b3bff73595468e002755b447e01559";

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

function getRarityJSON(callback) {
    var url = `https://tools-anywhere.herokuapp.com/https://cnft.tools/api/project/hosky/`;
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

function getOwnedTraitCount(hoskies) {
    var ownedTraitCount = 0;
    var ownedTraits = [];
    hoskies.forEach(hosky => {
        let traits = hosky["metadata"]["-----Traits-----"]
        for (let i = 0; i < traits.length; i++) {
            let trait = traits[i];
            for (var key in trait) {
                if (!ownedTraits.hasOwnProperty(key)) {
                    ownedTraits[key] = [];
                }
                if (trait.hasOwnProperty(key) && !ownedTraits[key].includes(trait[key])) {
                    ownedTraits[key].push(trait[key]);
                    ownedTraitCount += 1;
                }
            }
        }
    })
    return ownedTraitCount;
}