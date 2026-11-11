const aiToggle = document.getElementById("homeAiToggle");

if (localStorage.getItem("whister_ai") === null) {
  localStorage.setItem("whister_ai", "on");
}

aiToggle.checked = localStorage.getItem("whister_ai") === "on";

aiToggle.addEventListener("change", () => {
  localStorage.setItem(
    "whister_ai",
    aiToggle.checked ? "on" : "off"
  );
});

document.querySelectorAll(".trends span").forEach(item => {
  item.addEventListener("click", () => {
    location.href =
      `search.html?q=${encodeURIComponent(item.innerText)}`;
  });
});

document.querySelectorAll(".quick-links a").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
  });
});