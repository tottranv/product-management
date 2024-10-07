import Vue from 'vue';
import Router from 'vue-router';
import { showCountdownMessage } from './helpers';
const ProductList = () => import('./components/pages/product/ProductList.vue');
const ProductAdd = () => import('./components/pages/product/ProductAdd.vue');
const Login = () => import('./components/pages/auth/Login.vue');
const MainLayout = () => import('./components/layouts/MainLayout.vue');
const AuthLayout = () => import('./components/layouts/AuthLayout.vue');
const ProductEdit = () => import('./components/pages/product/ProductEdit.vue');
const Profile = () => import('./components/pages/user/Profile.vue');

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/auth',
      component: AuthLayout,
      children: [
        { path: 'login', component: Login, name: 'login' },
      ],
    },
    {
      path: '/',
      component: MainLayout,
      children: [
        { path: '', component: ProductList, meta: { requiresAuth: true }, name: 'productList' },
        { path: '/product/add', component: ProductAdd, meta: { requiresAuth: true }, name: 'productAdd' },
        { path: '/product/edit/:id', component: ProductEdit, meta: { requiresAuth: true }, name: 'productEdit' },
        { path: '/profile', component: Profile, meta: { requiresAuth: true }, name: 'profile' },
      ],
    },
    { path: '*', redirect: '/' },
  ],
});

const isAuthenticated = () => {
  const token = localStorage.getItem('accessToken');
  return !!token;
}

router.beforeEach((to, from, next) => {
  try {
    if(to.matched.some(record => record.meta.requiresAuth)) {
      if(!isAuthenticated()) {
        showCountdownMessage(1, () => {
          next({ path: '/auth/login' });//unAuthenticated!
        });
      } else {
        next();//accepted!
      }
    } else {
      next();
    }
  } catch (error) {
    throw new Error(error.message);
  }
});

export default router;