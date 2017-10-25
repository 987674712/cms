import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import Table from './views/nav1/Table.vue'
import Form from './views/404'
import user from './views/nav1/users.vue'
import Page4 from './views/nav2/Page4.vue'
import Page5 from './views/nav2/Page5.vue'
import Page6 from './views/nav3/Page6.vue'
import echarts from './views/charts/echarts.vue'
import books from './views/books/books'
import bookcate from './views/books/bookcate'
import bookchap from './views/books/bookchap.vue'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    //{ path: '/main', component: Main },
    {
        path: '/',
        component: Home,
        name: '账号管理',
        type: '1',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/main', type: '1', component: Main, name: '主页', hidden: true },
            { path: '/table', type: '1', component: Table, name: '角色管理' },
            { path: '/form', type: '1', component: user, name: '用户管理' },
            { path: '/user', type: '1', component: Form, name: '权限管理' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '书籍管理',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/books', type: '1', component: books, name: '书籍管理' },
            { path: '/bookcate', type: '1', component: bookcate, name: '书籍分类管理' },
            { path: '/bookchap', type: '1', component: bookchap, name: '章节管理', hidden: true }
        ]
    },
    //{
    //    path: '/',
    //    component: Home,
    //    name: '导航二',
    //    iconCls: 'fa fa-id-card-o',
    //    children: [
    //        { path: '/page4', component: Page4, name: '页面4' },
    //        { path: '/page5', component: Page5, name: '页面5' }
    //    ]
    //},
    //{
    //    path: '/',
    //    component: Home,
    //    name: '',
    //    iconCls: 'fa fa-address-card',
    //    leaf: true,//只有一个节点
    //    children: [
    //        { path: '/page6', component: Page6, name: '导航三' }
    //    ]
    //},
    //{
    //    path: '/',
    //    component: Home,
    //    name: 'Charts',
    //    iconCls: 'fa fa-bar-chart',




//    http://192.168.1.10:8081/reader-cmsapi/v1/ book
//    http://192.168.1.10:8081/v1/user/list





    //    children: [
    //        { path: '/echarts', component: echarts, name: 'echarts' }
    //    ]
    //},
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;