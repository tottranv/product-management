import Vue from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue';
import router from './router';
import 'ant-design-vue/dist/antd.css';
import "./assets/styles/index.scss";
import store from './store';
Vue.config.productionTip = false
Vue.use(Antd);
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
