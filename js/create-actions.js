function AskForDataTypeName() {
  document.getElementById("data-type-name").classList.remove("hide");
  document.getElementById("background-dark").classList.remove("hide");
  console.log("hey");
}
function CreateCustomizedDataTypeForm() {
  var name = document.getElementById("data-type-name-input").value;
  document.getElementById("data-type-name").classList.add("hide");
  document.getElementById("background-dark").classList.add("hide");
  AddCustomizedDataTypeForm(name);
}
function AddCustomizedDataTypeForm(customizedName) {
  var oldHTML = document.getElementsByClassName("content")[0].innerHTML;
  document.getElementsByClassName("content")[0].innerHTML =
    customizedName +
    "<br>" +
    document.getElementsByClassName("content")[0].innerHTML;
  UpdateScrollHeight();
}
