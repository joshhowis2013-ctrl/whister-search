/*
==================================
WHISTER SEARCH V3
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

/*
==================================
THEME
==================================
*/

function applyTheme(){

    const theme =
    localStorage.getItem("theme");

    document.body.classList.toggle(
        "light-mode",
        theme === "light"
    );

}

applyTheme();

/*
==================================
SEARCH HISTORY
==================================
*/

function saveRecentSearch(search){

    if(!search) return;

    let searches =
    JSON.parse(
        localStorage.getItem(
            "recentSearches"
        ) || "[]"
    );

    searches.unshift(search);

    searches =
    [...new Set(searches)]
    .slice(0,20);

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

    if(!aiPanel) return;

    aiPanel.style.display =
    localStorage.getItem(
        "whister_ai"
    ) === "on"
    ? "block"
    : "none";

}

updateAiPanel();

/*
==================================
SEARCH INPUT
==================================
*/

if(searchInput){

    searchInput.value =
    query;

    searchInput.addEventListener(
        "keydown",
        e=>{

            if(e.key === "Enter"){

                runSearch();

            }

        }
    );

}

function runSearch(){

    const value =
    searchInput.value.trim();

    if(!value) return;

    location.href =
    `search.html?q=${encodeURIComponent(value)}`;

}

/*
==================================
TOP BAR
==================================
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

        case "ai":

            generateSummary(query);

            break;

    }

}

function openSettings(){

    location.href =
    "settings.html";

}

/*
==================================
CUSTOM ANSWERS
==================================
*/

const customAnswers = {

    "atmos web" : {

        icon:"🌦️",

        title:"Atmos Web",

        answer:
        "Your weather made clearer.",

        description:
        "Modern weather forecasting focused on clarity, simplicity and accessibility."

    },

    "whister" : {

        icon:"🔎",

        title:"Whister Search",

        answer:
        "Search without being watched.",

        description:
        "Privacy-focused search powered by Brave."

    }

};

/*
==================================
LOAD PAGE
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

    if(
        localStorage.getItem(
            "whister_ai"
        ) === "on"
    ){

        generateSummary(query);

    }

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

                Fetching results.

            </div>

        </div>

    `;

}

/*
==================================
OPENAI SUMMARY
==================================
*/

async function generateSummary(query){

    try{

        const response =
        await fetch(
            "/api/ai.php",
            {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    query
                })
            }
        );

        const data =
        await response.json();

        if(data.error){

            summaryDiv.innerHTML = `

                <h2>
                    ✨ Whister AI Summary
                </h2>

                <p>
                    AI unavailable.
                    OpenAI API credit required.
                </p>

            `;

            return;

        }

        const answer =
        data.choices?.[0]
        ?.message?.content;

        summaryDiv.innerHTML = `

            <h2>
                ✨ Whister AI Summary
            </h2>

            <p>
                ${answer}
            </p>

        `;

    }

    catch(error){

        summaryDiv.innerHTML = `

            <h2>
                ✨ Whister AI Summary
            </h2>

            <p>
                AI currently unavailable.
            </p>

        `;

    }

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

                    Unable to connect
                    to Brave Search.

                </div>

            </div>

        `;

    }

}

/*
==================================
RESULTS
==================================
*/

function renderResults(data){

    const results =
    data.web?.results || [];

    const searchLower =
    query.toLowerCase();

    resultsDiv.innerHTML = "";

    if(customAnswers[searchLower]){

        const item =
        customAnswers[searchLower];

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

    resultsDiv.innerHTML += `

        <div class="result-count">

            About ${results.length}
            results

        </div>

    `;

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
                class="favicon">

                <div>

                    <div class="result-url">

                        ${result.url}

                    </div>

                    <a
                    href="${result.url}"
                    target="_blank"
                    class="result-title">

                        ${result.title}

                    </a>

                </div>

            </div>

            <div class="result-description">

                ${result.description || ""}

            </div>

        `;

        resultsDiv.appendChild(
            card
        );

    });

    if(data.query?.related_queries){

        const related =
        document.createElement(
            "div"
        );

        related.className =
        "related-searches";

        related.innerHTML =
        "<h3>Related Searches</h3>";

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

function searchRelated(search){

    location.href =
    `search.html?q=${encodeURIComponent(search)}`;

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
    `search.html?q=${encodeURIComponent("weather " + city)}`;

}

function openCalculator(){

    const expression =
    prompt(
        "Calculator"
    );

    if(!expression) return;

    try{

        const result =
        Function(
            `"use strict";return (${expression})`
        )();

        alert(result);

    }

    catch{

        alert(
            "Invalid calculation"
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
    `search.html?q=${encodeURIComponent(value)}`;

}

function openTimeZone(){

    const location =
    prompt(
        "Location"
    );

    if(!location) return;

    location.href =
    `search.html?q=${encodeURIComponent("time in " + location)}`;

}