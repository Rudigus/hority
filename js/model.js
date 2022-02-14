const policyID = "a5bb0e5bb275a573d744a021f9b3bff73595468e002755b447e01559";

let ownedTraits = {
    "stats": {
        "traitCount": 0,
        "uniqueTraitCount": 0
    }
};
let totalTraits = {};

loadTotalTraits();

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

function loadTotalTraits() {
    var url = `https://tools-anywhere.herokuapp.com/https://cnft.tools/api/project/hoskyattr/`;
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        totalTraits = xhr.response;
        // Removes the none traits from totalAttr
        totalTraits.totals.totalAttr -= 6
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

function formatTraitName(traitName) {
    // Adds spaces between words (based on capital letters)
    traitName = traitName.replace(/([A-Z])/g, ' $1').trim();
    // Capitalizes the first letter
    traitName = traitName.charAt(0).toUpperCase() + traitName.slice(1);
    return traitName;
}

function hasTrait(hosky, traitName) {
    let traits = hosky["metadata"]["-----Traits-----"]
    for (let i = 0; i < traits.length; i++) {
        let trait = traits[i];
        for (var key in trait) {
            if (trait[key].toLowerCase().includes(traitName.toLowerCase())) {
                return true;
            }
        }
    }
    return false;
}

function loadOwnedTraits(hoskies, callback) {
    // Resets
    for (let key in ownedTraits) {
        if (!ownedTraits.hasOwnProperty(key)) {
            continue;
        }
        for (let subkey in key) {
            if (ownedTraits[key].hasOwnProperty(subkey)) {
                ownedTraits[key][subkey] = 0;
            }
        }
    }
    // Initializes
    for (let trait in totalTraits.attributes) {
        if (trait == "traitCount") {
            continue;
        }
        formattedTrait = formatTraitName(trait);
        if (!ownedTraits.hasOwnProperty(formattedTrait)) {
            ownedTraits[formattedTrait] = {};
        }
        for (let key in totalTraits.attributes[trait]) {
            if (key == "None") {
                continue;
            }
            ownedTraits[formattedTrait][key] = 0;
        }
    }
    // Populates
    hoskies.forEach(hosky => {
        let traits = hosky["metadata"]["-----Traits-----"]
        for (let i = 0; i < traits.length; i++) {
            let trait = traits[i];
            for (var key in trait) {
                if (!ownedTraits.hasOwnProperty(key)) {
                    ownedTraits[key] = {};
                }
                if (trait.hasOwnProperty(key) && ownedTraits[key].hasOwnProperty(trait[key])) {
                    if (ownedTraits[key][trait[key]] == 0) {
                        ownedTraits.stats.uniqueTraitCount += 1;
                    }
                    ownedTraits[key][trait[key]] += 1;
                }
                ownedTraits.stats.traitCount += 1;
            }
        }
    })
    callback();
}