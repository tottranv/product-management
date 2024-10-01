import Vuex from 'vuex';
import Vue from 'vue';

Vue.use(Vuex);

//fake list:
const initialProducts = [
    { id: 1, name: 'Laptop Sony 12"', desc: 'Laptop Sony 13 inch sản phẩm mới được yêu thích', in_stock: true, price: 22000000 },
    { id: 2, name: 'Laptop Samsung 13"', desc: 'Laptop Samsung 13 inch sản phẩm mới được yêu thích', in_stock: true, price: 23000000 },
    { id: 3, name: 'Laptop Toshiba 14"', desc: 'Laptop Toshiba 14 inch sản phẩm mới được yêu thích', in_stock: true, price: 24000000 },
    { id: 4, name: 'Laptop Dell 15"', desc: 'Laptop Dell 15 inch sản phẩm mới được yêu thích', in_stock: true, price: 25000000 },
];

export default new Vuex.Store({
    state: {
        products: initialProducts,
        viewProduct: null,
    },
    mutations: {
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
            const isDublicateWithOther = state.products.some(item => item.name === product.name);
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
