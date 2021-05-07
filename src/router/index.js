import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Login = () => { return import ('views/login/Login') }
const Home = () => { return import ('views/home/Home') }

//子路由
const Welcome = () => { return import ('views/welcome/Welcome') }
const Users = () => { return import ("../components/users/Users") }
const Rights = () => { return import ("../components/power/Rights") }
const Roles = () => { return import ("../components/power/Roles") }

//子路由的配置
const homechildren = [{
    path: '/welcome',
    component: Welcome
  }, {
    path: '/users',
    component: Users
  }, {
    path: "/rights",
    component: Rights
  },
  {
    path: "/roles",
    component: Roles
  }
]

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
    component: Home,
    redirect: '/welcome',
    children: homechildren
  }
]


const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
  })
  // 路由的导航首位
router.beforeEach((to, from, next) => {
  //to 将要访问的路径 to.path将要访问的页面  from 代表从这个路径跳转而来 
  //next（）表示放行 next('/login)强制放行到那个页面
  const tokenStr = sessionStorage.getItem('token')

  if (to.path == '/login') { return next() } else {
    if (tokenStr) { return next() } else { return next('/login') }
  }
})


export default router