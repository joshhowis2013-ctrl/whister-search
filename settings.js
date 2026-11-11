const aiSetting =
document.getElementById(
    "aiSetting"
);

aiSetting.checked =
localStorage.getItem(
    "whister_ai"
) !== "off";

aiSetting.addEventListener(
    "change",
    ()=>{

        localStorage.setItem(
            "whister_ai",
            aiSetting.checked
            ? "on"
            : "off"
        );

    }
);

function clearHistory(){

    localStorage.removeItem(
        "recentSearches"
    );

    alert(
        "History cleared."
    );

}

function setTheme(theme){

    localStorage.setItem(
        "theme",
        theme
    );

    applyTheme();

}

function applyTheme(){

    document.body.classList.toggle(
        "light-mode",
        localStorage.getItem("theme")
        === "light"
    );

}

applyTheme();