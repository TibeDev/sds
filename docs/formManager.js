const emptyState = document.querySelector(".empty-state-form");
const chemicalForm = document.querySelector(".form-container");

function NewChemical() {
  emptyState.style.display = "none";
  chemicalForm.style.display = "block";
}

function CancelChemical() {
  emptyState.style.display = "block";
  chemicalForm.style.display = "none";
}
