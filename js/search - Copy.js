/*
==================================
WHISTER SEARCH V2
==================================
*/

const params = new URLSearchParams(window.location.search);

const query = params.get("q") || "";

const searchInput =
document.getElementById("searchInput");

const resultsDiv =
document.getElementById("results");

const summaryDiv =
document.getElementById("summary");

const aiPanel =
document.getElementById("aiPanel");

const aiToggle =
document.getElementById("aiToggle");

function switchTab(tab){

    const q =
    encodeURIComponent(query);

    switch(tab){

        case "all":

            location.href =
            `search.html?q=${q}`;

            break;

        case "images":

            window.open(
                `https://search.brave.com/images?q=${q}`,
                "_blank"
            );

            break;

        case "news":

            window.open(
                `https://search.brave.com/news?q=${q}`,
                "_blank"
            );

            break;

        case "videos":

            window.open(
                `https://search.brave.com/videos?q=${q}`,
                "_blank"
            );

            break;

        case "shopping":

            window.open(
                `https://search.brave.com/search?q=${q}+shopping`,
                "_blank"
            );

            break;

    }

}
/*
==================================
KNOWLEDGE PANELS
==================================
*/

if(
    searchLower ===
    "atmos web"
){

    summaryDiv.innerHTML = `

        <div class="atmos-card">

            <h1>

                🌦 Atmos Web

            </h1>

            <h3>

                Your weather made clearer.

            </h3>

            <p>

                A weather platform
                focused on presenting
                forecasts clearly and
                accessibly.

            </p>

        </div>

    `;

    return;

}
const customAnswers = {

    "atmos web": {
        icon:"🌦️",
        title:"Atmos Web",
        answer:"Your weather made clearer.",
        description:
        "Modern weather forecasting focused on simplicity, clarity and accessibility. you can run it locally. You can configure it to your needs."
        
    },

    "whister": {
        icon:"🔎",
        title:"Whister Search",
        answer:"Search without being watched.",
        description:
        "Privacy-focused search powered by Brave Search."
    },

    "youtube": {
        icon:"▶️",
        title:"YouTube",
        answer:"Online video-sharing platform owned by Google.",
        description:
        "The world's largest video-sharing platform."
    }

};
/*
=============================
TOP BAR BUTTONS
=============================
*/

function switchTab(tab){

    const q =
    encodeURIComponent(query);

    switch(tab){

        case "all":
            location.href =
            `search.html?q=${q}`;
            break;

        case "images":
            location.href =
            `search.html?q=${q}&tab=images`;
            break;

        case "news":
            location.href =
            `search.html?q=${q}&tab=news`;
            break;

        case "videos":
            location.href =
            `search.html?q=${q}&tab=videos`;
            break;

        case "shopping":
            location.href =
            `search.html?q=${q}&tab=shopping`;
            break;

        case "ai":

            aiToggle.checked = true;

            localStorage.setItem(
                "whister_ai",
                "on"
            );

            updateAiPanel();

            break;
            case "ai":

    generateSummary(query);

    break;

    }

}

function openSettings(){

    const currentTheme =
    localStorage.getItem("theme")
    || "dark";

    const choice =
    prompt(
`
Whister Settings

1 = Toggle Theme
2 = Clear Search History
3 = Toggle AI

Current Theme: ${currentTheme}
`
    );

    if(choice === "1"){

        if(currentTheme === "dark"){

            localStorage.setItem(
                "theme",
                "light"
            );

            document.body.classList.add(
                "light-mode"
            );

        }
        else{

            localStorage.setItem(
                "theme",
                "dark"
            );

            document.body.classList.remove(
                "light-mode"
            );

        }

    }

    if(choice === "2"){

        localStorage.removeItem(
            "recentSearches"
        );

        alert(
            "Search history cleared."
        );

    }

    if(choice === "3"){

        const enabled =
        localStorage.getItem(
            "whister_ai"
        ) === "on";

        localStorage.setItem(
            "whister_ai",
            enabled ? "off" : "on"
        );

        updateAiPanel();

    }

}
/*
==================================
SEARCH HISTORY
==================================
*/

function saveRecentSearch(search){

    let searches = JSON.parse(
        localStorage.getItem(
            "recentSearches"
        ) || "[]"
    );

    searches.unshift(search);

    searches =
    [...new Set(searches)]
    .slice(0,10);

    localStorage.setItem(
        "recentSearches",
        JSON.stringify(searches)
    );

}

if(query){
    saveRecentSearch(query);
}

/*
==================================
INIT
==================================
*/

if(searchInput){
    searchInput.value = query;
}

/*
==================================
AI SETTINGS
==================================
*/

if(localStorage.getItem("whister_ai") === null){

    localStorage.setItem(
        "whister_ai",
        "on"
    );

}

if(aiToggle){

    aiToggle.checked =
    localStorage.getItem(
        "whister_ai"
    ) === "on";

    aiToggle.addEventListener(
        "change",
        ()=>{

            localStorage.setItem(
                "whister_ai",
                aiToggle.checked
                    ? "on"
                    : "off"
            );

            updateAiPanel();

        }
    );

}

function updateAiPanel(){

    const enabled =
    localStorage.getItem(
        "whister_ai"
    ) === "on";

    if(aiPanel){

        aiPanel.style.display =
            enabled
                ? "block"
                : "none";

    }

}

updateAiPanel();

async function generateSummary(query){

    try{

        const response =
        await fetch(
            "/api/ai.php",
            {
                method:"POST",

                headers:{
                    "Content-Type":
                    "application/json"
                },

                body:JSON.stringify({

                    query

                })

            }
        );

        const data =
        await response.json();

        const answer =
        data.choices?.[0]
        ?.message?.content;

        if(answer){

            summaryDiv.innerHTML = `

                <h2>

                    ✨ AI Summary

                </h2>

                <p>

                    ${answer}

                </p>

            `;

        }

    }
    catch(error){

        console.error(error);

    }

}
/*
==================================
ENTER KEY
==================================
*/

if(searchInput){

    searchInput.addEventListener(
        "keydown",
        e=>{

            if(
                e.key === "Enter"
            ){

                runSearch();

            }

        }
    );

}

/*
==================================
SEARCH
==================================
*/

function runSearch(){

    const value =
    searchInput.value.trim();

    if(!value) return;

    location.href =
    "search.html?q=" +
    encodeURIComponent(value);

}

/*
==================================
LOAD
==================================
*/

window.addEventListener(
    "load",
    loadSearch
);

async function loadSearch(){

    if(!query) return;

    showLoading();

    await performSearch(query);
    generateSummary(query);

}

/*
==================================
LOADING
==================================
*/

function showLoading(){

    resultsDiv.innerHTML = `

        <div class="result">

            <div class="result-title">
                Searching...
            </div>

            <div class="result-description">
                Fetching live results.
            </div>

        </div>

    `;

}

/*
==================================
BRAVE SEARCH
==================================
*/

async function performSearch(query){

    try{

        const response =
        await fetch(
            `/api/search.php?q=${encodeURIComponent(query)}`
        );

        const data =
        await response.json();

        renderResults(data);

    }

    catch(error){

        console.error(error);

        resultsDiv.innerHTML = `

            <div class="result">

                <div class="result-title">
                    Search Error
                </div>

                <div class="result-description">
                    Unable to connect to Brave Search.
                </div>

            </div>

        `;

    }

}

/*
==================================
RENDER RESULTS
==================================
*/

function renderResults(data){

    const results =
    data.web?.results || [];

    const searchLower =
    query.toLowerCase();

    resultsDiv.innerHTML = "";

    /*
    ==========================
    WEATHER CARD
    ==========================
    */

    if(
        searchLower.startsWith(
            "weather "
        )
    ){

        const location =
        query.replace(
            /weather/i,
            ""
        ).trim();

        resultsDiv.innerHTML += `

            <div class="answer-card">

                <h2>
                    🌦 Weather Search
                </h2>

                <p>

                    Looking up weather
                    information for:

                    <strong>
                        ${location}
                    </strong>

                </p>

            </div>

        `;

    }

    /*
    ==========================
    KNOWLEDGE PANEL
    ==========================
    */

    if(
        customAnswers[
            searchLower
        ]
    ){

        const item =
        customAnswers[
            searchLower
        ];

        summaryDiv.innerHTML = `

            <div class="knowledge-card">

                <div class="knowledge-icon">

                    ${item.icon}

                </div>

                <div>

                    <h2>
                        ${item.title}
                    </h2>

                    <p>
                        ${item.answer}
                    </p>

                    <small>
                        ${item.description}
                    </small>

                </div>

            </div>

        `;

    }
    else{

        summaryDiv.innerHTML = `

            <h2>
                Search Summary
            </h2>

            <p>

                Found
                ${results.length}
                results for
                "${query}"

            </p>

        `;

    }

    /*
    ==========================
    RESULT COUNT
    ==========================
    */

    resultsDiv.innerHTML += `

        <div class="result-count">

            About
            ${results.length}
            results

        </div>

    `;

    /*
    ==========================
    SEARCH RESULTS
    ==========================
    */

    results.forEach(result=>{

        const card =
        document.createElement(
            "div"
        );

        card.className =
            "result";

        const favicon =
        result.profile?.img ||

        `https://www.google.com/s2/favicons?domain=${encodeURIComponent(result.url)}&sz=64`;

        card.innerHTML = `

            <div class="result-header">

                <img
                    src="${favicon}"
                    class="favicon"
                >

                <div>

                    <div class="result-url">

                        ${result.url}

                    </div>

                    <a
                        href="${result.url}"
                        class="result-title"
                        target="_blank"
                    >

                        ${result.title}

                    </a>

                </div>

            </div>

            <div class="result-description">

                ${result.description || ""}

            </div>

            <div class="meta">

                <span>

                    🔒 Indexed by Brave

                </span>

                <span>

                    ${
                        result.url.startsWith(
                            "https"
                        )
                        ? "🟢 Secure"
                        : "🔴 Not Secure"
                    }

                </span>

            </div>

        `;

        resultsDiv.appendChild(
            card
        );

    });

    /*
    ==========================
    RELATED SEARCHES
    ==========================
    */

    if(
        data.query?.related_queries
    ){

        const related =
        document.createElement(
            "div"
        );

        related.className =
        "related-searches";

        related.innerHTML =
        `
            <h3>
                Related Searches
            </h3>
        `;

        data.query.related_queries
        .slice(0,8)
        .forEach(item=>{

            const btn =
            document.createElement(
                "button"
            );

            btn.className =
                "related-btn";

            btn.textContent =
                item;

            btn.onclick =
                ()=>searchRelated(item);

            related.appendChild(
                btn
            );

        });

        resultsDiv.appendChild(
            related
        );

    }

}

/*
==================================
RELATED SEARCH
==================================
*/

function searchRelated(search){

    location.href =
        "search.html?q=" +
        encodeURIComponent(search);

}

/*
==================================
QUICK TOOLS
==================================
*/

function openWeather(){

    const city =
    prompt(
        "Enter city"
    );

    if(!city) return;

    location.href =
        "search.html?q=" +
        encodeURIComponent(
            "weather " + city
        );

}

function openCalculator(){

    const value =
    prompt(
        "Calculator"
    );

    if(!value) return;

    try{

        const result =
        Function(
            `"use strict";
            return (${value})`
        )();

        alert(result);

    }

    catch{

        alert(
            "Invalid expression"
        );

    }

}

function openCurrency(){

    const value =
    prompt(
        "Example: GBP to USD"
    );

    if(!value) return;

    location.href =
        "search.html?q=" +
        encodeURIComponent(value);

}

function openTimeZone(){

    const value =
    prompt(
        "Location"
    );

    if(!value) return;

    location.href =
        "search.html?q=" +
        encodeURIComponent(
            "time in " +
            value
        );

}

/*
==================================
FOLLOWUP BOX
==================================
*/

const followup =
document.querySelector(
    ".followup"
);

if(followup){

    followup.addEventListener(
        "keydown",
        e=>{

            if(
                e.key === "Enter"
            ){

                alert(
                    "AI chat coming soon."
                );

            }

        }
    );

}