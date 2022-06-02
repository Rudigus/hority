const petListing = document.getElementById("pet-listing");
const imageSources = document.getElementById("image-source-container").children;
const reloadImagesButton = document.getElementById("reload-images-button");
const toggleMinimalistModeButton = document.getElementById("toggle-minimalist-mode-button");
const modal = document.getElementById("pet-modal");
const modalContent = document.getElementById("pet-modal-content");
const span = document.getElementsByClassName("close")[0];
var imageSource;
var minimalistMode = false;

setupModal();
setupReloadImagesButton();
setupChangeViewButton();

function setupModal() {
    span.onclick = function () {
        modal.style.display = "none";
        // Removes everything from modal content, except the close button
        for (var i = 1; i < modalContent.children.length; i) {
            modalContent.removeChild(modalContent.children[i]);
        }
    }
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
            // Removes everything from modal content, except the close button
            for (var i = 1; i < modalContent.children.length; i) {
                modalContent.removeChild(modalContent.children[i]);
            }
        }
    }
}

function setupReloadImagesButton() {
    reloadImagesButton.addEventListener("click", reloadImages);
}

function setupChangeViewButton() {
    toggleMinimalistModeButton.addEventListener("click", changeView);
}

function setImageSource() {
    for (var i = 0; i < imageSources.length; i++) {
        if (imageSources[i].checked) {
            imageSource = imageSources[i].value;
            return;
        }
    }
}

function getPetImage(petImageURL) {
    var hostname;
    if (imageSource === "ipfs.io") {
        hostname = "https://ipfs.io/ipfs/"
    } else if (imageSource === "blockfrost.io") {
        hostname = "https://ipfs.blockfrost.dev/ipfs/";
    }
    return hostname + petImageURL.substr(7);
}

function reloadImages() {
    for (var i = 0; i < petListing.children.length; i++) {
        let child = petListing.children[i];
        if (!child.petInfo || child.style.display == "none") {
            continue;
        }
        let image = child.getElementsByTagName("img").item(0);
        if (image.complete && image.naturalHeight === 0) {
            image.src = `${image.src}#${new Date().getTime()}`;
        }
    }
}

function changeView() {
    minimalistMode = !minimalistMode;
    petListing.style.maxWidth = minimalistMode ? "50%" : "initial";
    for (var i = 0; i < petListing.children.length; i++) {
        let child = petListing.children[i];
        if (!child.petInfo || child.style.display == "none") {
            continue;
        }
        child.style.backgroundColor = minimalistMode ? "transparent" : "#131920";
        child.style.margin = minimalistMode ? "0" : "10px";
        child.style.padding = minimalistMode ? "0" : "15px";
        let grandchildren = Array.from(child.children);
        let image = grandchildren.shift();
        image.style.margin = minimalistMode ? "0" : "15px auto";
        grandchildren.forEach( grandchild => {
            grandchild.style.display = minimalistMode ? "none" : "block";
        })
    }
}

function populateTokenListing(pets) {
    petListing.replaceChildren();
    loadOwnedTraits(pets, function () {
        // Unique Trait Count
        const uniqueTraitCount = document.createElement("label");
        uniqueTraitCount.innerText = ownedTraits.stats.uniqueTraitCount + "/" +
            totalTraits.totals.totalAttr + " Unique Traits";
        uniqueTraitCount.style.fontSize = "1.25rem";
        uniqueTraitCount.style.display = "block";
        uniqueTraitCount.style.maxWidth = "200px";
        uniqueTraitCount.style.margin = "15px auto";
        petListing.appendChild(uniqueTraitCount);
        // Show Detailed Info
        const showDetailedInfo = document.createElement("label");
        showDetailedInfo.innerText = "Show Detailed Info";
        showDetailedInfo.style.display = "block";
        showDetailedInfo.style.cursor = "pointer";
        showDetailedInfo.style.maxWidth = "200px";
        showDetailedInfo.style.margin = "15px auto";
        showDetailedInfo.classList.add("rounded-rectangle");
        showDetailedInfo.style.backgroundColor = "#A52A2A";
        showDetailedInfo.addEventListener("click", function () {
            presentTraitModal();
        });
        petListing.appendChild(showDetailedInfo);
        // Trait Name Filter
        const traitNameFilter = document.createElement("input");
        traitNameFilter.type = "text";
        traitNameFilter.placeholder = "Filter by trait name";
        traitNameFilter.style.display = "block";
        traitNameFilter.style.maxWidth = "200px";
        traitNameFilter.classList.add("search-bar");
        traitNameFilter.addEventListener("input", function () {
            pets.forEach(pet => {
                let petHasTrait = hasTrait(pet, traitNameFilter.value);
                if (petHasTrait) {
                    for (var i = 0; i < petListing.children.length; i++) {
                        let petCard = petListing.children[i];
                        if (petCard.petInfo == pet) {
                            petCard.style.display = "inline-block";
                        }
                    }
                } else {
                    for (var i = 0; i < petListing.children.length; i++) {
                        let petCard = petListing.children[i];
                        if (petCard.petInfo == pet) {
                            petCard.style.display = "none";
                        }
                    }
                }
            })
        });
        petListing.appendChild(traitNameFilter);
    });
    pets.forEach(pet => {
        // Pet Image
        const petImage = document.createElement("img");
        petImage.src = getPetImage(pet.metadata.image);
        petImage.loading = "lazy";
        petImage.style.maxWidth = "150px";
        petImage.style.margin = "15px auto";
        petImage.style.display = "block";
        // Pet Name Label
        const petName = document.createElement("label");
        petName.innerText = pet.metadata.name;
        petName.style.display = "block";
        petName.style.cursor = "pointer";
        // Pet Rarity Rank
        const petRarityRank = document.createElement("label");
        petRarityRank.innerText = `Rank ${pet.rarityRank}`;
        petRarityRank.style.display = "block";
        petRarityRank.style.cursor = "pointer";
        petRarityRank.style.maxWidth = "100px";
        petRarityRank.style.margin = "15px auto";
        petRarityRank.classList.add("rounded-rectangle");
        // Pet Trait Count
        const petTraitCount = document.createElement("label");
        petTraitCount.innerText = `${pet["metadata"]["-----Traits-----"].length} Traits`;
        petTraitCount.style.display = "block";
        petTraitCount.style.cursor = "pointer";
        petTraitCount.style.maxWidth = "100px";
        petTraitCount.style.margin = "15px auto";
        petTraitCount.classList.add("rounded-rectangle");
        petTraitCount.style.backgroundColor = "blueviolet";
        // Pet Card
        const petCard = document.createElement("div");
        petCard.style.display = "inline-block";
        petCard.style.textAlign = "center";
        petCard.style.cursor = "pointer";
        petCard.style.backgroundColor = "#131920";
        petCard.style.borderRadius = "15px";
        petCard.style.margin = "10px";
        petCard.style.padding = "15px";
        petCard.appendChild(petImage);
        petCard.appendChild(petName);
        petCard.appendChild(petRarityRank);
        petCard.append(petTraitCount);
        petCard.petInfo = pet;
        petCard.addEventListener("click", function () {
            window.open(`https://cnft.tools/hosky/${pet.name}`, '_blank').focus();
        });
        petListing.appendChild(petCard);
    });
    hideSearchLoader();
}

function presentTraitModal() {
    for (var trait in ownedTraits) {
        if (trait == "stats") {
            continue;
        }
        traitLabel = document.createElement('label');
        traitLabel.innerText = trait;
        traitLabel.style.display = "block";
        traitLabel.style.color = "black";
        traitLabel.style.fontSize = "1.25rem";
        traitLabel.style.textAlign = "center";
        traitLabel.style.margin = "30px 0 10px";
        // Trait Details Table
        traitDetails = document.createElement('table');
        traitDetails.style.width = '100px';
        traitDetails.style.border = '1px solid black';
        traitDetails.style.margin = "0 auto";
        traitDetails.classList.add("styled-table");

        let headerNames = ["Trait", "Owned", "Available", "Ownership"];
        const tableRow = traitDetails.insertRow();
        headerNames.forEach(headerName => {
            let headerCell = document.createElement("th");
            headerCell.innerText = headerName;
            tableRow.appendChild(headerCell);
        });
        let sortedKeys = Object.keys(ownedTraits[trait]).sort((a, b) => {
            return ownedTraits[trait][a] - ownedTraits[trait][b];
        });
        for (let i = 0; i < sortedKeys.length; i++) {
            let key = sortedKeys[i];
            const tableRow = traitDetails.insertRow();
            let formattedTraitName = key;
            let ownedTraitCount = ownedTraits[trait][key];
            let traitName = Object.keys(totalTraits.attributes).find(element => {
                return formatTraitName(element) == trait;
            });
            let availableTraitCount = totalTraits.attributes[traitName][key];
            let ownership = ((ownedTraitCount / availableTraitCount) * 100).toFixed(2) + "%";
            let cellData = [formattedTraitName, ownedTraitCount, availableTraitCount, ownership];
            for (let j = 0; j < headerNames.length; j++) {
                const tableDataCell = tableRow.insertCell();
                tableDataCell.appendChild(document.createTextNode(cellData[j]));
                tableDataCell.style.border = '1px solid black';
            }
        }
        modalContent.appendChild(traitLabel);
        modalContent.appendChild(traitDetails);
    }

    modal.style.display = "block";
}