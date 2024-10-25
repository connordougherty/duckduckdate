function addMissingDates() {
    const searchResults = document.querySelectorAll("ol.react-results--main > li > article > div > h2 > a");

    const createDateElement = (date) => {
        const dateSpan = document.createElement("span");
        dateSpan.className = "MILR5XIVy9h75WrLvKiq";
        dateSpan.textContent = date;
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

            fetchDateFromUrl(jsonUrl)
                .then(formattedDate => {
                    if (formattedDate) {
                        const existingSpan = result.closest("article").querySelector("div > div > div > span > span.MILR5XIVy9h75WrLvKiq");
                        if (!existingSpan) {
                            const parentElement = result.closest("article").querySelector("div > div > div > span.kY2IgmnCmOGjharHErah");
                            if (parentElement) {
                                parentElement.prepend(createDateElement(formattedDate));
                            }
                        }
                    }
                })
                .catch(error => console.error('Fetch error:', error));
        }
    });
}

window.onload = addMissingDates;
