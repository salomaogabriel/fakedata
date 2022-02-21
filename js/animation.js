var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function () {
    this.classList.toggle("active");
    var content = this.parentNode.nextElementSibling;
    if (content.style.maxHeight) {
      content.style.maxHeight = null;
      this.innerHTML = "&vee;";
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
      this.innerHTML = "&wedge;";
    }
  });
}
function UpdateScrollHeight() {
  for (i = 0; i < coll.length; i++) {
    var content = coll[i].parentNode.nextElementSibling;
    if (content.style.maxHeight) {
      content.style.maxHeight = content.scrollHeight + "px";
    }
  }
}
