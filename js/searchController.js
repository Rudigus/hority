const petSearchBar = document.querySelector(".search-bar");
const walletAddressLabel = document.getElementById("wallet-address-label");
const petNameLabel = document.getElementById("pet-name-label");
const searchErrorLabel = document.getElementById("search-error-label");
const urlSearchParams = new URLSearchParams(window.location.search);
const walletAddress = urlSearchParams.get("wallet");

loadQuery();
setupSearchBar();

function handleWallet(walletJSON) {
    var hoskies = walletJSON.tokens.filter(token => token.policy === policyID);
    let counter = 0;
    hoskies.forEach(hosky => {
        getHoskyRarity(getHoskyNumber(hosky), hoskyTools => {
            if (hoskyTools.rarityRank) {
                hosky.rarityRank = hoskyTools.rarityRank;
            } else {
                hosky.rarityRank = "Unavailable";
            }
            counter += 1;
            if (counter == hoskies.length) {
                hoskies = hoskies.sort((a, b) => a.rarityRank - b.rarityRank);
                populateTokenListing(hoskies);
            }
        })
    });
}

function searchWallet(walletAddress) {
    setImageSource();
    loadAssets(walletAddress, (xhr) => {
        if (xhr.status == 200) {
            hideSearchError();
            handleWallet(xhr.response);
        } else if (xhr.status == 404) {
            showSearchError("Wallet not found.");
        }
    });
}

async function loadQuery() {
    if (walletAddress) {
        searchWallet(walletAddress);
    }
}

function setupSearchBar() {
    petSearchBar.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            const url = new URL(window.location);
            url.searchParams.set('wallet', petSearchBar.value);
            url.searchParams.delete('asset');
            window.history.replaceState({}, '', url);
            searchWallet(petSearchBar.value);
        }
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