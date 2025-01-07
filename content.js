function addMissingDates() {
    const createDateElement = (text, isNested = false) => {
        const dateSpan = document.createElement("span");
        dateSpan.className = "MILR5XIVy9h75WrLvKiq";
        dateSpan.textContent = text;

        if (isNested) {
            dateSpan.style.color = "rgb(136, 136, 136)";
            dateSpan.dataset.isNested = "true"; // Optional for differentiation
        }

        return dateSpan;
    };

    const addGlobalStyles = () => {
        const styleSheet = document.createElement("style");
        styleSheet.textContent = `
            .MILR5XIVy9h75WrLvKiq[data-is-nested="true"]::after {
                content: "\\00B7";
                padding: 0 5px;
            }
        `;
        document.head.appendChild(styleSheet);
    };

    const fetchDateFromUrl = (() => {
        const cache = new Map();
        return (url) => {
            if (cache.has(url)) {
                return Promise.resolve(cache.get(url));
            }

            return fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    const createdTimestamp = data[0]?.data?.children[0]?.data?.created;
                    const formattedDate = createdTimestamp
                        ? new Date(createdTimestamp * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                        : null;

                    cache.set(url, formattedDate); // Cache the result
                    return formattedDate;
                });
        };
    })();

    const getSearchResults = () => [
        { results: document.querySelectorAll("ol.react-results--main > li > article > div > h2 > a"), isNested: false, targetSpanSelector: "div > div > div > span.kY2IgmnCmOGjharHErah" },
        { results: document.querySelectorAll("ol.react-results--main > li > article > div > div > ul > li > a"), isNested: true, targetSpanSelector: "div > ul > li > p > span.kY2IgmnCmOGjharHErah" }
    ];

    const processSearchResults = (resultGroups) => {
        resultGroups.forEach(({ results, isNested, targetSpanSelector }) => {
            results.forEach(result => {
                const url = result.href;

                if (url.includes("reddit.com")) {
                    const jsonUrl = `${url.slice(0, -1)}.json`;
                    const parentElement = result.closest("li, article").querySelector(targetSpanSelector);

                    if (parentElement) {
                        const loadingSpan = createDateElement("Loading date...", isNested);
                        parentElement.prepend(loadingSpan);

                        fetchDateFromUrl(jsonUrl)
                            .then(formattedDate => {
                                if (formattedDate) {
                                    loadingSpan.textContent = formattedDate;
                                } else {
                                    loadingSpan.textContent = "Date not available";
                                }
                            })
                            .catch(error => {
                                console.error('Fetch error:', error);
                                loadingSpan.textContent = "Error loading date";
                            });
                    }
                }
            });
        });
    };

    addGlobalStyles(); // Add the centralized styles
    processSearchResults(getSearchResults());
}

window.onload = addMissingDates;
