/* ============================= */
/*       Initial Setup           */
/* ============================= */
const emptyState = document.querySelector(".empty-state-form");
const chemicalForm = document.querySelector(".form-container");

const chemicalList = document.querySelector(".chemical-list");
const emptyStateChemicalList = document.querySelector(".empty-state");

// Initially show form and hide empty state
emptyState.style.display = "none";
chemicalForm.style.display = "block";

/* ============================= */
/*       Form Toggle Functions   */
/* ============================= */
function NewChemical() {
  emptyState.style.display = "none";
  chemicalForm.style.display = "block";
  ResetForm();
}

function CancelChemical() {
  emptyState.style.display = "block";
  chemicalForm.style.display = "none";
}

/* ============================= */
/*          Load Data            */
/* ============================= */
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
        <input class="field-input" type="checkbox" />
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
      `<option value="${c}">${c}</option>`
    );
  });
  ResetForm();
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

/* ============================= */
/*      Form Reset & Add         */
/* ============================= */
function ResetForm() {
  const allFields = document.querySelectorAll(
    "form.chemical-form input, form.chemical-form select, form.chemical-form textarea"
  );

  allFields.forEach((field) => {
    if (field.type !== "button") {
      field.value = "";
      field.checked = false;
    }
  });
}

function AddChemical() {
  const form = document.querySelector(".chemical-form");
  if (!form.checkValidity()) {
    return false;
  }
  const chemicalName = document.getElementsByName("chemical-name")[0];
  const casNumber = document.getElementsByName("cas-number")[0];
  const hazardIcons = document.querySelectorAll(".hazard");
  const chemicalList = document.querySelector(".chemical-list");

  let countOfIcons = 0;
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

  const chemicalEl = document.createElement("label");
  chemicalEl.className = "chemical";
  chemicalEl.innerHTML = `<input type="button" class="chemical-button"/>
      <div class="chemical-info">
        <p class="chemical-title">${chemicalName.value}</p>
        <p class="chemical-cas">CAS: ${casNumber.value}</p>
        <div class="hazard-category-list">${selectedHazardIcons}</div>
      </div>
      <div class="chemical-buttons">
        <button class="chemical-edit-btn">
          <img src="../images/Icons/pencil.svg" alt="" />
        </button>
        <button class="chemical-delete-btn" id="${chemicalName.value}-bin">
          <img src="../images/Icons/bin.svg" alt=""/>
        </button>
      </div>
    `;
  chemicalList.appendChild(chemicalEl);
  const deleteBtn = chemicalEl.querySelector(".chemical-delete-btn");

  deleteBtn.addEventListener("click", () => {
    AsignPromptQuestion("Are you sure you wanna remove this chemical?");
    ShowPrompt(true, () => RemoveChemical(chemicalEl), null);
  });
  CancelChemical();
  updateChemicalListHeight();
}

function RemoveChemical(chemical) {
  chemical.remove();
}

/* ============================= */
/*     Chemical List Helpers     */
/* ============================= */
function updateChemicalListHeight() {
  const firstChemical = chemicalList.querySelector(".chemical");
  if (firstChemical) {
    const chemicalHeight = firstChemical.offsetHeight;
    chemicalList.style.maxHeight = `${chemicalHeight * 2}px`;
  }
}

/* ============================= */
/*       Mutation Observer       */
/* ============================= */
const observer = new MutationObserver((mutationsList) => {
  if (chemicalList.children.length > 0) {
    emptyStateChemicalList.style.display = "none";
  } else {
    emptyStateChemicalList.style.display = "block";
  }
});

observer.observe(chemicalList, { childList: true });

/* ============================= */
/*             Prompt            */
/* ============================= */

function ShowPrompt(enable, doOnConfirm, doOnCancel) {
  const confirmContainer = document.querySelector(".confirm-container");
  const buttonContainer = confirmContainer.querySelector(".confirm-buttons");
  if (enable == true) {
    DisableOverlayPointer(true);
    confirmContainer.style.display = "flex";

    const yesBtn = document.getElementById("confirm-yes-btn");
    yesBtn.addEventListener("click", () => {
      ShowPrompt(false, null, null);
      if (doOnConfirm) doOnConfirm();
    });

    const noBtn = document.getElementById("confirm-no-btn");
    noBtn.addEventListener("click", () => {
      ShowPrompt(false, null, null);
      if (doOnCancel) doOnCancel();
    });
  } else {
    DisableOverlayPointer(false);
    confirmContainer.style.display = "none";
  }
}
function AsignPromptQuestion(question) {
  const promptQuestion = document.querySelector(".prompt-question");
  promptQuestion.textContent = question;
}

DisableOverlayPointer(false);

function DisableOverlayPointer(enable) {
  const overlayContainer = document.querySelector(".overlay-container");
  if (enable) {
    overlayContainer.style.pointerEvents = "all";
  } else {
    overlayContainer.style.pointerEvents = "none";
  }
}
