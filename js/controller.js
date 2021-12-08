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
        petImage.style.margin = "15px";
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
        petRarityRank.style.margin = "15px";
        petRarityRank.classList.add("rounded-rectangle");
        // Pet Card
        const petCard = document.createElement("div");
        petCard.style.display = "inline-block";
        petCard.style.textAlign = "center";
        petCard.style.cursor = "pointer";
        //petCard.style.backgroundColor = "red";
        petCard.style.margin = "5px";
        petCard.appendChild(petImage);
        petCard.appendChild(petName);
        petCard.appendChild(petRarityRank);
        petCard.petInfo = pet;
        petCard.addEventListener("click", function (event) {
            window.open(`https://cnft.tools/hosky/${pet.name}`, '_blank').focus();
        });
        petListing.appendChild(petCard);
    });
}