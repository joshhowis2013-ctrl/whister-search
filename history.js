const historyList =
document.getElementById(
    "historyList"
);

function loadHistory(){

    const history =
    JSON.parse(
        localStorage.getItem(
            "recentSearches"
        ) || "[]"
    );

    if(history.length === 0){

        historyList.innerHTML = `
            <div class="history-empty">
                No search history yet.
            </div>
        `;

        return;
    }

    history.forEach(search=>{

        historyList.innerHTML += `
            <div class="history-item">

                <a
                href="search.html?q=${encodeURIComponent(search)}">

                    🔍 ${search}

                </a>

            </div>
        `;

    });

}

function clearHistory(){

    if(
        !confirm(
            "Clear all search history?"
        )
    ) return;

    localStorage.removeItem(
        "recentSearches"
    );

    location.reload();

}

loadHistory();