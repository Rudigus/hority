const petListing = document.getElementById("pet-listing");
const imageSources = document.getElementById("image-source-container").children;
const modal = document.getElementById("pet-modal");
const modalContent = document.getElementById("pet-modal-content");
const span = document.getElementsByClassName("close")[0];
var imageSource;

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

function populateTokenListing(pets) {
    petListing.replaceChildren();
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