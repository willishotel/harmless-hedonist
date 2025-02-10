fetch("products.json")
    .then(response => response.json())
    .then(products => {
        const container = document.querySelector(".product-container");
        container.innerHTML = ""; // Clear static content

        products.forEach(product => {
            let card = document.createElement("div");
            card.classList.add("product-card");

            card.innerHTML = `
                <a href="product-details.html?id=${product.id}" class="product-link">
                    <img src="${product.img}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>${product.price}</p>
                    <p class="product-description">${product.description}</p>
                    <button type="button" onclick="addToCart(${product.id})">Add to Cart</button>
                </a>
            `;

            container.appendChild(card);
        });
    })
    .catch(error => console.error("Error loading products:", error));