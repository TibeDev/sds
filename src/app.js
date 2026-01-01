const emptyState = document.querySelector(".empty-state-form");
const chemicalForm = document.querySelector(".form-container");

emptyState.style.display = "none";
chemicalForm.style.display = "block";

function NewChemical() {
  emptyState.style.display = "none";
  chemicalForm.style.display = "block";
}
function CancelChemical() {
  emptyState.style.display = "block";
  chemicalForm.style.display = "none";
}

fetch("../data/sdsData.json")
  .then((res) => res.json())
  .then((data) => {
    LoadHazards(data.hazards);
    LoadPhrases("h-phrases", data.hPhrases);
    LoadPhrases("p-phrases", data.pPhrases);
    LoadHazardClasses("select-hazard-classes", data.hazardClasses);
    LoadHazardClasses("select-phyiscal-states", data.physicalStates);
  });

function LoadHazards(hazards) {
  const path = "../images/GHS_ICONS/";
  const container = document.getElementsByClassName("hazard-grid")[0];
  hazards.forEach((hazard) => {
    container.insertAdjacentHTML(
      "beforeend",
      `
    <label class="hazard" id="${hazard.Name}">
      <input type="checkbox" />
      <img src="${path}${hazard.img}"/>
    </label>
    `
    );
  });
}

function LoadHazardClasses(containerId, classes) {
  const container = document.getElementById(containerId);
  classes.forEach((c) => {
    container.insertAdjacentHTML(
      "beforeend",
      `
      <option value="${c}">${c}</option>
    `
    );
  });
}

function LoadPhrases(containerId, phrases) {
  const container = document.getElementById(containerId);
  phrases.forEach((phrase) => {
    container.insertAdjacentHTML(
      "beforeend",
      `
      <label id="phrase">
        <input type="checkbox" />
        <p>${phrase.code} - ${phrase.text}</p>
      </label>
    `
    );
  });
}

function AddChemical() {
  let countOfIcons = 0;

  const chemicalName = document.getElementsByName("chemical-name")[0];
  const casNumber = document.getElementsByName("cas-number")[0];
  const hazardIcons = document.querySelectorAll(".hazard");

  const hazardClasses = document.getElementsByName("hazard-classes")[0];
  const physicalStates = document.getElementsByName("physical-states")[0];

  const chemicalList = document.querySelector(".chemical-list");

  let selectedHazardIcons = "";
  hazardIcons.forEach((icon) => {
    const input = icon.querySelector("input");
    if (input.checked) {
      if (countOfIcons < 2) {
        selectedHazardIcons += `<div class="hazard-category">${icon.id}</div>`;
      }
      countOfIcons++;
    }
  });
  if (countOfIcons > 2) {
    selectedHazardIcons += `<div class="hazard-category-extra">+${
      countOfIcons - 2
    } more</div>`;
  }
  chemicalList.insertAdjacentHTML(
    "beforeend",
    `
      <button class="chemical">
              <p class="chemical-title">${chemicalName.value}</p>
              <p class="chemical-cas">CAS: ${casNumber.value}</p>
              <div class="hazard-category-list">
                ${selectedHazardIcons}
              </div>
      </button>
    `
  );
  CancelChemical();
}

function CreateChemical() {
  const chemicalName = document.getElementsByName("chemical-name")[0];
  const casNumber = document.getElementsByName("cas-number")[0];
  const hazardIcons = document.querySelectorAll(".hazard");

  const hazardClasses = document.getElementsByName("hazard-classes")[0];
  const physicalStates = document.getElementsByName("physical-states")[0];

  chemicalName.value = false;
}
