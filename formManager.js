const emptyState = document.querySelector(".empty-state-form");
const chemicalForm = document.querySelector(".form-container");
const chemicalList = document.querySelector(".chemical-list");
function NewChemical() {
  emptyState.style.display = "none";
  chemicalForm.style.display = "block";
}

function CancelChemical() {
  emptyState.style.display = "block";
  chemicalForm.style.display = "none";
}

function AddChemical() {
  const chemical = document.createElement("label");
  chemical.className = "chemical";

  const chemicalTitles = document.createElement("div");
  chemicalTitles.className = "chemical-title-list";
  chemical.appendChild(chemicalTitles);

  const chemicalButtons = document.createElement("div");
  chemicalButtons.className = "chemical-buttons";
  chemicalButtons.innerHTML = `<button class="chemical-edit-btn">
          <img src="./images/Icons/pencil.svg" alt="" />
        </button>
        <button class="chemical-delete-btn" onclick="RemoveChemical(this)">
          <img src="./images/Icons/bin.svg" alt="" />
        </button>`;
  chemical.appendChild(chemicalButtons);

  const chemicalCategoryLists = document.createElement("div");
  chemicalCategoryLists.className = "chemical-category-lists";

  chemical.appendChild(chemicalCategoryLists);

  chemicalList.appendChild(chemical);

  fetch("./data/formFields.json")
    .then((res) => res.json())
    .then((data) => {
      data.fields.forEach((field) => {
        const fieldInput = document.querySelector("#" + field.id);
        if (
          field.chemicalDataType === "title" ||
          field.chemicalDataType === "sub-title"
        ) {
          const title = document.createElement("p");
          title.className = "chemical-" + field.chemicalDataType;

          if (field.type === "input") {
            if (field.input === "text") {
              title.textContent = field.label + ": " + fieldInput.value;
            }
          }

          chemicalTitles.appendChild(title);
        } else if (field.chemicalDataType === "category") {
          const chemicalCategoryList = document.createElement("div");
          chemicalCategoryList.className = "chemical-category-list";
          chemicalCategoryLists.appendChild(chemicalCategoryList);

          if (field.type === "multi-select") {
            const items = fieldInput.querySelectorAll("label");
            let checkedItems = [];

            items.forEach((item) => {
              const checkBox = item.querySelector("input");
              if (checkBox.checked) {
                checkedItems.push(item);
              }
            });
            fetch("./data/formData.json")
              .then((res) => res.json())
              .then((data) => {
                const colors = data[field.id + "-color"];
                checkedItems.forEach((item, index) => {
                  if (index < field.maxCategoryItems) {
                    const category = document.createElement("div");
                    category.className = "chemical-category";
                    if (colors) {
                      colors.forEach((color) => {
                        category.style.backgroundColor = color.bgColor;
                      });
                    }
                    if (fieldInput.className === "multi-select-grid") {
                      const icon = document.createElement("img");
                      const labelIcon = item.querySelector("img");
                      icon.src = labelIcon.src;
                      category.appendChild(icon);
                    } else if (fieldInput.className === "multi-select-list") {
                      const labelText = item.querySelector("p");
                      category.textContent = labelText.innerHTML;
                    }
                    chemicalCategoryList.appendChild(category);
                  } else if (index === field.maxCategoryItems) {
                    const categoryExtra = document.createElement("div");
                    categoryExtra.className = "chemical-category-extra";
                    categoryExtra.textContent =
                      "+" +
                      (checkedItems.length - field.maxCategoryItems) +
                      " meer";
                    chemicalCategoryList.appendChild(categoryExtra);
                  }
                });
              });
          }
        }
      });
    });
  SaveData();
}
function SaveData() {
  const fields = document.querySelectorAll(".field");
  const form = document.querySelector(".chemical-form");
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  fetch("https://reqres.in/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}
function RemoveChemical(deleteBtn) {
  deleteBtn.closest(".chemical").remove();
}
