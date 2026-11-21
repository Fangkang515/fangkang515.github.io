const comparison = document.querySelector("#lake-demo");
const slider = comparison.querySelector("input");

function updateComparison() {
  comparison.style.setProperty("--split", slider.value + "%");
  comparison.querySelector(".before").hidden = Number(slider.value) < 18;
  comparison.querySelector(".after").hidden = Number(slider.value) > 82;
  slider.setAttribute("aria-valuetext", slider.value + " percent original");
}

slider.addEventListener("input", updateComparison);
updateComparison();
slider.hidden = false;
