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
