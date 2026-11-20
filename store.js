class Product {
    constructor(name, category, amount, image) {
        this.name = name;
        this.category = category;
        this.amount = amount;
        this.image = image;
    }

    addToBasket() {
        console.log(`Product with name ${this.name} has been added to the basket`);
    }
}


class Shoe extends Product {
    constructor(name, amount, image) {
        super(name, 'shoe', amount, image);
    }
}

class Grocerie extends Product {
    constructor(name, amount, image) {
        super(name, 'grocerie', amount, image);
    }
}


function productFactory(item) {
    if (item.category === 'shoe') {
        return new Shoe(item.name, item.amount, item.image);
    } else if (item.category === 'grocerie') {
        return new Grocerie(item.name, item.amount, item.image);
    }
}


class Basket {
    products = [];

    add(product) {
        product.time = new Date().toLocaleTimeString();
        product.addToBasket();
        this.products.push(product);
        this.showBasket();
    }

    
    remove(index) {
        const product = this.products[index];
        this.products.splice(index, 1);
        product.amount = product.amount + 1;
        this.showBasket();
        store.showProducts();
    }

    
    showBasket() {
        const basketDiv = document.getElementById('basket');
        basketDiv.innerHTML = '';

        for (let i = 0; i < this.products.length; i++) {
            const item = this.products[i];

            basketDiv.innerHTML += `
                <div class="basket-item">
                    <b>${item.name}</b> (${item.category})<br>
                    <small>Час додавання: ${item.time}</small><br>
                    <button onclick="store.basket.remove(${i})">Видалити</button>
                </div>
            `;
        }
    }
}


class Store {
    products = [];

    constructor() {
        this.basket = new Basket();
    }

    fillStoreWithProducts(jsonArray) {
        for (let i = 0; i < jsonArray.length; i++) {
            const newProduct = productFactory(jsonArray[i]);
            this.products.push(newProduct);
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
        const productsDiv = document.getElementById('products');
        productsDiv.innerHTML = '';

        for (let i = 0; i < this.products.length; i++) {
            const item = this.products[i];

            // Звичайна перевірка: якщо товару 0, блокуємо кнопку
            let stan = '';
            if (item.amount === 0) {
                stan = 'disabled';
            }

            productsDiv.innerHTML += `
                <div class="card">
                    <img src="${item.image}" alt="${item.name}">
                    <h3>${item.name}</h3>
                    <p>Категорія: ${item.category}</p>
                    <p>Залишилось: <b>${item.amount}</b> шт.</p>
                    <button onclick="store.moveProductToBasket(${i})" ${stan}>
                        Додати в кошик
                    </button>
                </div>
            `;
        }
    }
}


const store = new Store();

fetch('products.json')
    .then(response => response.json())
    .then(data => {
        store.fillStoreWithProducts(data);
        store.showProducts();
    });