class Product {
    constructor(name, category, amount, image) {
        this.name = name;
        this.category = category;
        this.amount = amount;
        this.image = image;
    }

    addToBasket() {
        console.log('Product with name ${this.name} has been added to the basket');
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
        const basketDiv = document.getElementById('basket');
        basketDiv.innerHTML += `
            <div class="basket-item">
                <b>${product.name}</b> (${product.category})<br>
                <small>Час додавання: ${product.time}</small>
            </div>
        `;
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

        // Перевіряємо, чи товар ще є в наявності
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
            const disabledAttr = item.amount === 0 ? 'disabled' : '';

            productsDiv.innerHTML += `
                <div class="card">
                    <img src="${item.image}" alt="${item.name}">
                    <h3>${item.name}</h3>
                    <p>Категорія: ${item.category}</p>
                    <p>Залишилось: <b>${item.amount}</b> шт.</p>
                    <button onclick="store.moveProductToBasket(${i})" ${disabledAttr}>
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