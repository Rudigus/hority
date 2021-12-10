const petSearchBar = document.querySelector(".search-bar");
const walletAddressLabel = document.getElementById("wallet-address-label");
const petNameLabel = document.getElementById("pet-name-label");
const searchLoader = document.getElementById("search-loader");
const searchLoaderMessage = document.getElementById("search-loader-message");
const searchErrorLabel = document.getElementById("search-error-label");
const urlSearchParams = new URLSearchParams(window.location.search);
const walletAddress = urlSearchParams.get("wallet");

loadQuery();
setupSearchBar();
let toolsData = [];

function handleWallet(walletJSON) {
    var hoskies = walletJSON.tokens.filter(token => token.policy === policyID);
    if (hoskies.length == 0) {
        hideSearchLoader();
        showSearchError("No hoskies found.");
        return
    }
    let counter = 0;
    getRarityJSON(hoskiesTools => {
        toolsData = hoskiesTools;
        hoskies.forEach(hosky => {
            let hoskyTools = hoskiesTools.stats.find(element => element.assetName == hosky.name)
            if (hoskyTools && hoskyTools.rarityRank) {
                hosky.rarityRank = hoskyTools.rarityRank;
            } else {
                hosky.rarityRank = "Unavailable";
            }
            counter += 1;
            if (counter == hoskies.length) {
                hoskies = hoskies.sort((a, b) => a.rarityRank - b.rarityRank);
                populateTokenListing(hoskies);
            }
        });
    })
}

function searchWallet(walletAddress) {
    setImageSource();
    loadAssets(walletAddress, (xhr) => {
        if (xhr.status == 200) {
            hideSearchError();
            handleWallet(xhr.response);
        } else if (xhr.status == 404) {
            hideSearchLoader();
            showSearchError("Wallet not found.");
        }
    });
}

async function loadQuery() {
    if (walletAddress) {
        showSearchLoader();
        searchWallet(walletAddress);
    }
}

function setupSearchBar() {
    let eventHandler = function () {
        petListing.replaceChildren();
        hideSearchError();
        showSearchLoader();
        const url = new URL(window.location);
        let searchBarAddress = petSearchBar.value.match(/addr[^\/]*/);
        if (searchBarAddress) {
            petSearchBar.value = searchBarAddress[0];
            url.searchParams.set('wallet', petSearchBar.value);
            window.history.replaceState({}, '', url);
            searchWallet(petSearchBar.value);
        } else {
            hideSearchLoader();
            showSearchError("Invalid Address.");
        }
    };
    petSearchBar.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            eventHandler();
        }
    });
    petSearchBar.addEventListener("paste", function() {
        setTimeout(eventHandler);
    });
}

function showSearchError(errorDescription) {
    searchErrorLabel.innerText = errorDescription;
    searchErrorLabel.style.textAlign = "center";
    searchErrorLabel.style.display = "block";
}

function hideSearchError() {
    searchErrorLabel.style.display = "none";
}

function showSearchLoader() {
    searchLoader.classList.add("lds-hourglass");
    searchLoaderMessage.style.textAlign = "center";
    searchLoaderMessage.style.display = "block";
}

function hideSearchLoader() {
    searchLoader.classList.remove("lds-hourglass");
    searchLoaderMessage.style.display = "none";
}