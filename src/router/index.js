import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Homes from '../views/Homes.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component:Home,
    redirect: '/home',
    children:[
      {
        path: '/home',
        component: Homes,
      },{
        path: '/question',
        component: ()=>import('../views/question.vue')
      },{
        path: '/me',
        component: ()=>import('../views/me.vue')
      },{
        path: '/video',
        component: ()=>import('../views/video.vue')
      },
    ]
  },{
    path: '/login',
    name: 'login',
    component: ()=>import('../views/Login.vue'),
    beforeEnter: (to, from, next) => {
      if(!JSON.parse(localStorage.getItem("toutiao"))){
        next()
      }else{
        next('/me')
      }
    }
  },{
    path:'/article/:id',
    component:()=>import('../components/article.vue'),
    props:true
  },{
    path:'/searchs/:id',
    component:()=>import('../components/Searchs.vue'),
  },{
    path:'/edit',
    component:()=>import('../views/Edit.vue'),  
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
 
})

export default router
