import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  history:{
    type:'hash'
  },
  routes: [
    { path: '/', component: '@/pages/index',exact: true  },
    { path: '/me', component: '@/pages/me' ,exact: true },
    { path: '/user-info', component: '@/pages/user-info' ,exact: true },
    { path: '/news', component: '@/pages/news',exact: true },
    { path: '/news-info', component: '@/pages/news-info' ,exact: true},
    { path: '/shop', component: '@/pages/shop',exact: true  },
    { path: '/shop-info', component: '@/pages/shop-info',exact: true  },
    { path: '/login', component: '@/pages/login/login' ,exact: true },
    { path: '/register', component: '@/pages/login/register' ,exact: true},
    { path: '/my-like', component: '@/pages/my-like' ,exact: true},
    { path: '/address', component: '@/pages/address' ,exact: true},
    { path: '/address-add', component: '@/pages/address-add' ,exact: true},
    { path: '/address-edit', component: '@/pages/address-edit' ,exact: true},
    { path: '/buy-info', component: '@/pages/buy-info' ,exact: true},
    { path: '/password', component: '@/pages/password' ,exact: true},
    { path: '/order', component: '@/pages/order' ,exact: true},
  ],
  proxy: {
    '/shop-service/v1': {
      target: 'http://localhost:3000',
      changeOrigin: true
    },
    '/public': {
      target: 'http://localhost:3000',
      changeOrigin: true
    }
  },
});
