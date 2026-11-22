class Product {
    constructor(name, category, amount, image) {
        this.name = name;
        this.category = category;
        this.amount = amount;
        this.image = image;
    }

    addToBasket() {
        console.log("Product with name " + this.name + " has been added to the basket");
    }
}

class Shoe extends Product {
    constructor(name, amount, image) {
        super(name, "shoe", amount, image);
    }
}

class Grocerie extends Product {
    constructor(name, amount, image) {
        super(name, "grocerie", amount, image);
    }
}

function productFactory(item) {
    if (item.category === "shoe") {
        return new Shoe(item.name, item.amount, item.image);
    } else if (item.category === "grocerie") {
        return new Grocerie(item.name, item.amount, item.image);
    }
}

class Basket {
    constructor() {
        this.products = [];
    }

    add(product) {
        const basketItem = productFactory(product);
        basketItem.time = new Date().toLocaleTimeString();
        product.addToBasket();
        this.products.push(basketItem);
        this.showBasket();
    }

    remove(index) {
        const removedItem = this.products[index];
        this.products.splice(index, 1);

        for (let i = 0; i < store.products.length; i++) {
            if (store.products[i].name === removedItem.name) {
                store.products[i].amount = store.products[i].amount + 1;
                break;
            }
        }

        this.showBasket();
        store.showProducts();
    }

    showBasket() {
        const basketDiv = document.getElementById("basket");
        basketDiv.innerHTML = "";

        if (this.products.length === 0) {
            basketDiv.innerHTML = "<p>Кошик порожній</p>";
            return;
        }

        for (let i = 0; i < this.products.length; i++) {
            const item = this.products[i];

            basketDiv.innerHTML +=
                '<div class="basket-item">' +
                    "<p><b>" + item.name + "</b> (" + item.category + ")</p>" +
                    "<p><small>Час додавання: " + item.time + "</small></p>" +
                    '<button onclick="store.basket.remove(' + i + ')">Видалити</button>' +
                "</div>";
        }
    }
}

class Store {
    constructor() {
        this.products = [];
        this.basket = new Basket();
    }

    fillStoreWithProducts(jsonArray) {
        for (let i = 0; i < jsonArray.length; i++) {
            const newProduct = productFactory(jsonArray[i]);
            if (newProduct) {
                this.products.push(newProduct);
            }
        }
    }

    moveProductToBasket(index) {
        const product = this.products[index];

        if (product.amount > 0) {
            product.amount = product.amount - 1;
            this.basket.add(product);
            this.showProducts();
        }
    }

    showProducts() {
        const productsDiv = document.getElementById("products");
        productsDiv.innerHTML = "";

        for (let i = 0; i < this.products.length; i++) {
            const item = this.products[i];

            // Звичайна перевірка: якщо товару 0, блокуємо кнопку
            let disabledAttr = "";
            if (item.amount === 0) {
                disabledAttr = "disabled";
            }

            productsDiv.innerHTML +=
                '<div class="card">' +
                    '<img src="' + item.image + '" alt="' + item.name + '">' +
                    "<h3>" + item.name + "</h3>" +
                    "<p>Категорія: " + item.category + "</p>" +
                    "<p>Залишилось: <b>" + item.amount + "</b> шт.</p>" +
                    '<button onclick="store.moveProductToBasket(' + i + ')" ' + disabledAttr + ">" +
                        "Додати в кошик" +
                    "</button>" +
                "</div>";
        }
    }
}

const store = new Store();
store.basket.showBasket();

fetch("products.json")
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        store.fillStoreWithProducts(data);
        store.showProducts();
    });