import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Login = () => { return import ('../views/Login') }
const Home = () => { return import ('../views/Home') }

const routes = [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home
  }
]


const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
  })
  //路由的导航首位
router.beforeEach((to, from, next) => {
  //to 将要访问的路径 to.path将要访问的页面  from 代表从这个路径跳转而来 
  //next（）表示放行 next('/login)强制放行到那个页面
  if (to.path == '/login') { return next() }
  if (to.path == '/home') {
    const tokenStr = sessionStorage.getItem('token')
    if (tokenStr) { return next() } else { return next('/login') }
  }

})


export default router