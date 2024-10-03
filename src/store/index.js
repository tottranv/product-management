import Vuex from 'vuex';
import Vue from 'vue';

Vue.use(Vuex);

//dump generating a big list:
const generatingAList = (num) => {
    const tempList = [];
    const names = ['Sony', 'Samsung', 'Apple', 'Toshiba', 'Dell'];
    const middleNames = ['Alpha', 'Inspiration', 'Intelligence', 'New Generation', 'Sirius'];
    const inches = [12, 13, 14, 15, 16];
    for (let i = 0; i < num; i++) {
        const nameIndex = Math.floor(Math.random() * names.length);
        const midNameIndex = Math.floor(Math.random() * middleNames.length);
        const inIndex = Math.floor(Math.random() * inches.length);
        const name = `${names[nameIndex]} ${middleNames[midNameIndex]} ${inches[inIndex]}`;
        const price = Math.floor(Math.random() * 80 + 10) * 1000000;
        tempList.push({
            id: i + 1, name: `${name}" ${Date.now() + i}`, desc: `Laptop ${name} inch sản phẩm mới được yêu thích`, in_stock: true, price
        });
    }
    return tempList;
}

//fake list:
const initialProducts = generatingAList(100);
let tempCheck = 0;

export default new Vuex.Store({
    state: {
        products: [],
        viewProduct: null,
    },
    mutations: {
        initialProducts(state, products) {
            state.products = products;
        },
        loadMoreProducts(state, moreProducts) {
            state.products = state.products.concat(moreProducts);
        },
        addProduct(state, product) {
            state.products.push(product);
        },
        updateProduct(state, {i, product}) {
            state.products.splice(i, 1, product);
        },
        deleteProduct(state, id) {
            state.products.splice(id, 1);
        },
    },
    actions: {
        async fetchProducts({ commit }, {limit = 10, exchangeRate = 24600, convertToLocaleAmountOnly}) {
            const url = `https://dummyjson.com/products?limit=${limit}&select=id,title,price,description,stock,images,thumbnail`;
            try {
                const response = await fetch(url);
                if(!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const { products } = await response.json();
                if(products && Array.isArray(products)) {
                    const convertProducts = products.map(({
                        id,title,price,description,stock,images,thumbnail
                    }) => ({
                        id, name: title,
                        price: convertToLocaleAmountOnly(exchangeRate, price), description,
                        images, thumbnail,
                        in_stock: stock,
                    }));
                    commit('initialProducts', convertProducts);
                } else {
                    console.error('Invalid data format:', products);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        },
        initialProducts({ commit, state }) {    
            const list = tempCheck > 0 ? state.products.slice(0, 10) : initialProducts.slice(0, 10);
            commit('initialProducts', list);
            tempCheck++;
        },
        loadMoreProducts({ commit, state }, {limit = 10}) {
            const nextIndex = state.products.length - 1;
            const list = initialProducts.slice(nextIndex, Math.min(nextIndex + limit));
            commit('loadMoreProducts', list);
        },
        getProductById({ state }, id) {
            return state.products.find(product => product.id === id);
        },
        addProduct({ commit, state }, product) {
            //check1
            const productExists = state.products.some(item => item.name === product.name);
            if(productExists) {
                return Promise.reject('Product is already exists');
            }
            commit('addProduct', product);
            return Promise.resolve('Product is added');
        },
        updateProduct({ commit, state }, product) {
            //check1
            const findIndex = state.products.findIndex(item => item.id === product.id);
            if(findIndex === -1) {
                return Promise.reject('Product is not exists');
            }
            //check2
            const isDublicateWithOther = state.products.some(item => item.id!=product.id && item.name === product.name);
            if(isDublicateWithOther) {
                return Promise.reject('Has an other Product with this name');
            }
            commit('updateProduct', {i: findIndex,  product});
            return Promise.resolve('Product is updated');
        },
        deleteProduct({ commit, state }, id) {
            //check1
            const findIndex = state.products.findIndex(item => item.id === id);
            if(findIndex === -1) {
                return Promise.reject('Product is not exists');
            }
            commit('deleteProduct', id);
            return Promise.resolve('Product is deleted');
        },
    },
    getters: {
        products:  (state) => state.products,
        viewProduct: (state) => state.viewProduct,
    }
});
