import Vue from 'vue'
import Router from 'vue-router'
import user from '@/components/management/user/user'

Vue.use(Router)

export default new Router({
  routes: [
    {path: '/user', name: 'user', component: user}
  ]
})
