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

const previews = [...document.querySelectorAll("#projects video")];
const motionToggle = document.querySelector("#motion-toggle");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const visible = new Set();
let enabled = !reduceMotion.matches;

function updatePlayback() {
  motionToggle.textContent = enabled ? "Pause animations" : "Play animations";
  for (const video of previews) {
    if (enabled && visible.has(video) && !document.hidden) {
      video.play().catch(error => {
        // A browser can require a tap before playing even a silent video.
        if (error.name === "NotAllowedError" && enabled) {
          enabled = false;
          updatePlayback();
        }
      });
    } else {
      video.pause();
    }
  }
}

const observer = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (entry.isIntersecting) visible.add(entry.target);
    else visible.delete(entry.target);
  }
  updatePlayback();
});
for (const video of previews) {
  video.controls = false;
  observer.observe(video);
}
motionToggle.hidden = false;
motionToggle.addEventListener("click", () => {
  enabled = !enabled;
  updatePlayback();
});
reduceMotion.addEventListener("change", () => {
  enabled = !reduceMotion.matches;
  updatePlayback();
});
document.addEventListener("visibilitychange", updatePlayback);

// Keep the two camera paths aligned after buffering or returning to this tab.
const edited = comparison.querySelector("video");
const original = comparison.querySelector(".original");
edited.addEventListener("timeupdate", () => {
  if (original.readyState >= 2 && Math.abs(original.currentTime - edited.currentTime) > 0.1) {
    original.currentTime = edited.currentTime;
  }
});
updatePlayback();
