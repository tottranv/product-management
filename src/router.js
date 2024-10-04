import Vue from 'vue';
import Router from 'vue-router';
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
        { path: '/profile', component: Profile, meta: { requiresAuth: true } },
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
        next({ path: '/auth/login' });//unAuthenticated!
      } else {
        next();//accepted!
      }
    } else {
      next();
    }
  } catch (error) {
    throw new Error("An error occur", error);
  }
});

export default router;