BuildForm();
function BuildForm() {
  const formContainer = document.querySelector(".chemical-form");
  fetch("../data/formFields.json")
    .then((res) => res.json())
    .then((data) => {
      data.fields.forEach((field) => {
        const fieldContainer = document.createElement("div");
        fieldContainer.className = "field";

        formContainer.appendChild(fieldContainer);

        const fieldLabel = document.createElement("p");
        fieldLabel.className = "field-label";
        fieldLabel.textContent = field.label;

        if (field.required) {
          fieldLabel.textContent += " *";
        }

        fieldContainer.appendChild(fieldLabel);

        let fieldObj = null;

        if (field.type === "input") {
          fieldObj = document.createElement("input");
          fieldObj.type = field.input;
          if (field.placeholder) {
            fieldObj.placeholder = field.placeholder;
          }
          if (field.input != "file") {
            fieldObj.className = "field-input";
          }
          fieldObj.id = field.id;
          fieldObj.required = field.required;
        } else if (field.type === "select") {
          fieldObj = document.createElement("select");
          fieldObj.id = field.id;
          fieldObj.className = "field-input";
        } else if (field.type === "multi-select") {
          fieldObj = document.createElement("div");
          fieldObj.id = field.id;
          const fieldDataName = field.id;
          if (field.select === "grid") {
            fieldObj.className = "mutli-select-grid";
            fieldObj.style.gridTemplateColumns = field.collumn;
          } else if (field.select === "list") {
            fieldObj.className = "mutli-select-list";
          }
          fetch("../data/formData.json")
            .then((resData) => resData.json())
            .then((formData) => {
              const symbols = formData[fieldDataName];
              if (symbols) {
                symbols.forEach((element) => {
                  const label = document.createElement("label");
                  const input = document.createElement("input");
                  input.type = "checkbox";

                  input.addEventListener("change", () => {
                    if (input.checked) {
                      label.style.backgroundColor = field.selectedBgColor;
                      label.style.borderColor = field.selectedBorderColor;
                    } else {
                      label.style.backgroundColor = "";
                      label.style.borderColor = "";
                    }
                  });

                  label.appendChild(input);

                  if (field.select === "grid") {
                    input.className = "field-input";
                    label.className = "multi-select-icon";
                    label.id = element.name;

                    const img = document.createElement("img");
                    img.src = "../images/" + fieldDataName + "/" + element.img;
                    label.appendChild(img);
                  } else if (field.select === "list") {
                    label.className = "multi-select-list-item";
                    label.id = element.code;
                    const itemText = document.createElement("p");
                    itemText.textContent = element.code + " - " + element.text;

                    label.appendChild(itemText);
                  }
                  fieldObj.appendChild(label);
                });
              }
            });
        } else if (field.type === "textarea") {
          fieldObj = document.createElement("textarea");
          fieldObj.id = field.id;
          fieldObj.className = "field-area";
          fieldObj.required = field.required;
        }

        if (fieldObj != null) {
          fieldContainer.appendChild(fieldObj);
        }
      });
      const bottemNav = document.createElement("div");
      bottemNav.className = "bottemNav";
      bottemNav.innerHTML = `<button type="submit" id="add-chemical">
                        Add Chemical
                      </button>
                      <button type="button" id="cancel-form">
                        Cancel
                      </button>`;
      formContainer.appendChild(bottemNav);
    });
}
