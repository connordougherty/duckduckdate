function addMissingDates() {
    const searchResults = document.querySelectorAll("ol.react-results--main > li > article > div > h2 > a");

    const createDateElement = (text) => {
        const dateSpan = document.createElement("span");
        dateSpan.className = "MILR5XIVy9h75WrLvKiq";
        dateSpan.textContent = text;
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
                return createdTimestamp ? new Date(createdTimestamp * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : null;
            });
    };

    searchResults.forEach(result => {
        const url = result.href;

        if (url.includes("reddit.com")) {
            const jsonUrl = `${url.slice(0, -1)}.json`;
            const parentElement = result.closest("article").querySelector("div > div > div > span.kY2IgmnCmOGjharHErah");

            if (parentElement) {
                const loadingSpan = createDateElement("Loading date...");
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
}

window.onload = addMissingDates;
