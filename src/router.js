import Vue from 'vue';
import Router from 'vue-router';
import ProductList from './components/pages/product/ProductList.vue';
import ProductAdd from './components/pages/product/ProductAdd.vue';
import Login from './components/pages/auth/Login.vue';
import MainLayout from './components/layouts/MainLayout.vue';
import AuthLayout from './components/layouts/AuthLayout.vue';
import ProductEdit from './components/pages/product/ProductEdit.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/auth',
      component: AuthLayout,
      children: [
        { path: 'login', component: Login },
      ],
    },
    {
      path: '/',
      component: MainLayout,
      children: [
        { path: '', component: ProductList, meta: { requiresAuth: true } },
        { path: '/product/add', component: ProductAdd, meta: { requiresAuth: true } },
        { path: '/product/edit/:id', component: ProductEdit, meta: { requiresAuth: true } },
      ],
    },
    { path: '*', redirect: '/' },
  ],
});

const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
}

router.beforeEach((to, from, next) => {
  try {
    if(to.matched.some(record => record.meta.requiresAuth)) {
      if(!isAuthenticated()) {
        next({ path: '/auth/login' });//unAuthenticated!
      } else {
        next();//accepted!
      }
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
  }
});

export default router;