import Vue from 'vue';
import Router from 'vue-router';
import ProductList from './components/pages/product/ProductList.vue';
import ProductAdd from './components/pages/product/ProductAdd.vue';
import Login from './components/pages/auth/Login.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    { path: '/', component: ProductList },
    { path: '/product/add', component: ProductAdd },
    { path: '/login', component: Login },
  ],
});
