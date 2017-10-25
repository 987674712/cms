import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
//import './assets/theme/theme-green/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
//import NProgress from 'nprogress'
//import 'nprogress/nprogress.css'
import routes from './routes'
//import Mock from './mock'
//Mock.bootstrap();
import 'font-awesome/css/font-awesome.min.css'
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/zh-cn'
import base from './base/base'


Vue.prototype.$url = 'http://' + location.host + '/cmsapi/v1/';
Vue.prototype.$axios = axios;
// axios get请求
Vue.prototype.$get = function(url, data, event, headers){
  headers = headers||{};
  headers.token = JSON.parse(sessionStorage.getItem('token'));
  var tokenTime = sessionStorage.getItem('tokenTime')
  var minTime = 5 * 60 * 1000;//5分钟
  if(new Date().getTime() - tokenTime > minTime&&tokenTime&&tokenTime !='null'){
    axios({
      method: 'post',
      url: 'http://' + location.host + '/cmsapi/v1/refreshToken',
      headers: {refreshToken:JSON.parse(sessionStorage.getItem('refreshToken'))}
    })
        .then(function(response){
          if(response.data.code == 1000){
            sessionStorage.setItem('token', JSON.stringify(response.data.data.token));
            sessionStorage.setItem('refreshToken', JSON.stringify(response.data.data.refreshToken));
            sessionStorage.setItem('tokenTime',new Date().getTime())
            Vue.prototype.$get(url, data, event, headers)
          }else{
            router.go({ path: '/login' });
          }
        })
  }else{
    axios({
      method: 'get',
      url: 'http://' + location.host + '/cmsapi/v1/'+url,
      params: data,
      headers: headers
    })
        .then(function(response){
          event(response.data)
        })
        .catch(function(err){
          console.log(err);
        });
  }
}
// axios post请求
Vue.prototype.$post = function(url, data, event, headers){
  headers = headers||{}
  headers.token = JSON.parse(sessionStorage.getItem('token'))
  var tokenTime = sessionStorage.getItem('tokenTime')
  var minTime = 5 * 60 * 1000;//5分钟
  if(new Date().getTime() - tokenTime > minTime&&tokenTime&&tokenTime !='null'){
    axios({
      method: 'post',
      url: 'http://' + location.host + '/cmsapi/v1/refreshToken',
      headers: {refreshToken:JSON.parse(sessionStorage.getItem('refreshToken'))}
    })
        .then(function(response){
          if(response.data.code == 1000){
            sessionStorage.setItem('token', JSON.stringify(response.data.data.token));
            sessionStorage.setItem('refreshToken', JSON.stringify(response.data.data.refreshToken));
            sessionStorage.setItem('tokenTime',new Date().getTime())
            Vue.prototype.$post(url, data, event, headers)
          }else{
            router.go({ path: '/login' });
          }
        })
  }else{
    axios({
      method: 'post',
      url: 'http://' + location.host + '/cmsapi/v1/'+url,
      data: data,
      headers: headers
    })
        .then(function(response){
          console.log(response);
          event(response.data)
        })
        .catch(function(err){
          console.log(err);
        });
  }
}
Vue.prototype.$moment = function(time){
  return moment(time).format('YYYY-MM-DD HH:mm:ss')
}
Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(moment)
Vue.use(base)
//NProgress.configure({ showSpinner: false });

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  //NProgress.start();
  if (to.path == '/login') {
    sessionStorage.removeItem('user');
  }
  let user = JSON.parse(sessionStorage.getItem('user'));
  if (!user && to.path != '/login') {
    next({ path: '/login' })
  } else {
    next()
  }
})

//router.afterEach(transition => {
//NProgress.done();
//});

new Vue({
  //el: '#app',
  //template: '<App/>',
  router,
  store,
  //components: { App }
  render: h => h(App)
}).$mount('#app')

