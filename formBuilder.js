BuildForm();

function BuildForm() {
  const formContainer = document.querySelector(".chemical-form");

  fetch("./data/formFields.json")
    .then((res) => res.json())
    .then((data) => {
      data.fields.forEach((field) => {
        const fieldContainer = document.createElement("div");
        fieldContainer.className = "field";
        formContainer.appendChild(fieldContainer);

        const fieldLabel = document.createElement("p");
        fieldLabel.className = "field-label";
        fieldLabel.textContent = field.label + (field.required ? " *" : "");
        fieldContainer.appendChild(fieldLabel);

        let fieldObj;
        let fieldId = field.id;
        if (field.idEnd) {
          fieldId = field.id + "-" + field.idEnd;
        }

        switch (field.type) {
          case "input":
            fieldObj = document.createElement("input");
            fieldObj.type = field.input;
            if (field.placeholder) fieldObj.placeholder = field.placeholder;
            if (field.input !== "file") fieldObj.className = "field-input";
            fieldContainer.appendChild(fieldObj);
            break;

          case "select":
            fieldObj = document.createElement("select");
            fieldObj.className = "field-input";
            fieldContainer.appendChild(fieldObj);
            break;

          case "multi-select":
            const selectedItems = document.createElement("p");
            selectedItems.className = "multi-select-selected-items";

            fieldObj = document.createElement("div");
            fieldObj.className =
              field.select === "grid"
                ? "multi-select-grid"
                : "multi-select-list";

            if (field.select === "grid" && field.collumn) {
              fieldObj.style.gridTemplateColumns = field.collumn;
            }
            const selectedCodes = [];
            fetch("./data/formData.json")
              .then((resData) => resData.json())
              .then((formData) => {
                const symbols = formData[fieldId];
                const colors = formData[field.id + "-color"];
                symbols?.forEach((element) => {
                  const label = document.createElement("label");
                  const input = document.createElement("input");
                  input.type = "checkbox";
                  input.addEventListener("change", () => {
                    if (input.checked) {
                      if (!selectedCodes.includes(element.code)) {
                        selectedCodes.push(element.code);
                      }
                      if (colors) {
                        colors.forEach((color) => {
                          if (
                            color.items === "all" ||
                            (symbols.indexOf(element) >= color.itemsStart &&
                              symbols.indexOf(element) <= color.itemsEnd)
                          ) {
                            label.style.backgroundColor = color.bgColor;
                            label.style.borderColor = color.borderColor;
                          }
                        });
                      }
                    } else {
                      const index = selectedCodes.indexOf(element.code);
                      if (index > -1) selectedCodes.splice(index, 1);
                      label.style.backgroundColor = "";
                      label.style.borderColor = "";
                    }

                    selectedItems.textContent =
                      selectedCodes.length > 0
                        ? "Selected items: " + selectedCodes.join(" / ")
                        : "";
                  });

                  label.appendChild(input);

                  if (field.select === "grid") {
                    input.className = "field-input";
                    label.className = "multi-select-icon";
                    label.id = element.name;

                    const img = document.createElement("img");
                    img.src = `./images/${field.id}/${element.img}`;
                    label.appendChild(img);
                  } else {
                    label.className = "multi-select-list-item";
                    label.id = element.code;
                    const itemText = document.createElement("p");
                    if (colors) {
                      colors.forEach((color) => {
                        if (
                          color.items === "all" ||
                          (symbols.indexOf(element) >= color.itemsStart &&
                            symbols.indexOf(element) <= color.itemsEnd)
                        ) {
                          itemText.style.color = color.textColor;
                        }
                      });
                    }
                    itemText.textContent = `${element.code} - ${element.text}`;
                    label.appendChild(itemText);
                  }

                  fieldObj.appendChild(label);
                });

                fieldContainer.appendChild(fieldObj);
                if (field.select === "list")
                  fieldContainer.appendChild(selectedItems);
              });
            break;

          case "textarea":
            fieldObj = document.createElement("textarea");
            fieldObj.className = "field-area";
            fieldContainer.appendChild(fieldObj);
            break;
        }
        fieldObj.id = fieldId;
        fieldContainer.id = field.type;
        fieldObj.required = field.required;
      });

      const bottemNav = document.createElement("div");
      bottemNav.className = "bottemNav";
      bottemNav.innerHTML = `
        <button onclick="AddChemical()" id="add-chemical">Add Chemical</button>
        <button onclick="CancelChemical()" type="button" id="cancel-form">Cancel</button>
      `;
      formContainer.appendChild(bottemNav);
    });
}
