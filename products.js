fetch("products.json")
    .then(response => response.json())
    .then(products => {
        const container = document.querySelector(".product-container");
        container.innerHTML = ""; // Clear previous content

        products.forEach(product => {
            // Format product name into a URL-friendly format
            const productSlug = product.name.toLowerCase().replace(/\s+/g, "-") + "-details";

            const card = document.createElement("div");
            card.classList.add("product-card");
            card.innerHTML = `
                <a href="/html-css-js-product-page/${productSlug}.html" class="product-link">
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>${product.price}</p>
                    <p class="product-description">${product.description}</p>
                    <button type="button">View Details</button>
                </a>
            `;
            container.appendChild(card);
        });
    })
    .catch(error => console.error("Error loading products:", error));