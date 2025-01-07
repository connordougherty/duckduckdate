function addMissingDates() {
    const mainSearchResults = document.querySelectorAll("ol.react-results--main > li > article > div > h2 > a");
    const nestedSearchResults = document.querySelectorAll("ol.react-results--main > li > article > div > div > ul > li > a");

    const createDateElement = (text, isNested = false) => {
        const dateSpan = document.createElement("span");
        dateSpan.className = "MILR5XIVy9h75WrLvKiq";
        dateSpan.textContent = text;

        if (isNested) {
            dateSpan.style.color = "rgb(136, 136, 136)";

            dateSpan.style.setProperty("--after-padding", "0 5px");
            dateSpan.style.setProperty("--after-content", '"\\00B7"');

            const styleSheet = document.createElement("style");
            styleSheet.textContent = `
                .MILR5XIVy9h75WrLvKiq::after {
                    content: var(--after-content);
                    padding: var(--after-padding);
                }
            `;
            document.head.appendChild(styleSheet);
        }

        return dateSpan;
    };

    const fetchDateFromUrl = (url) => {
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const createdTimestamp = data[0]?.data?.children[0]?.data?.created;
                return createdTimestamp
                    ? new Date(createdTimestamp * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                    : null;
            });
    };

    const processSearchResults = (results, targetSpanSelector, isNested = false) => {
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
    };

    processSearchResults(mainSearchResults, "div > div > div > span.kY2IgmnCmOGjharHErah");
    processSearchResults(nestedSearchResults, "div > ul > li > p > span.kY2IgmnCmOGjharHErah", true);
}

window.onload = addMissingDates;
