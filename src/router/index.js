import Vue from 'vue'
import Router from 'vue-router'
// 样例路由
const Home = () => import('@/components/Home')
const Empty = () => import('@/components/Empty')
const ExampleElementUI = () => import('@/components/example/ElementUI')
const ExampleScss = () => import('@/components/example/Scss')
const ArticleCategoryList = () => import('@/components/community/article/category/ArticleCategoryList')
const BannerList = () => import('@/components/common/Banner/BannerList')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      component: ExampleElementUI,
      name: '登录',
      hidden: true
    },
    {
      path: '/',
      component: Home,
      name: '',
      iconCls: 'el-icon-news',
      leaf: true,
      children: [
        {
          path: '/dashboard',
          component: ExampleElementUI,
          name: '仪表盘',
          iconCls: 'el-icon-tickets'
        }
      ]
    },
    {
      path: '/',
      component: Home,
      name: '商学院',
      iconCls: 'el-icon-news',
      children: [
        {
          path: '/article',
          component: Empty,
          name: '文章管理',
          iconCls: 'el-icon-news',
          children: [
            {
              path: '/page111',
              component: ExampleElementUI,
              name: '文章列表',
              iconCls: 'el-icon-tickets'
            }
          ]
        },
        {
          path: '/article',
          component: Empty,
          name: '首页管理',
          iconCls: 'el-icon-mobile-phone',
          children: [
            {path: '/category', component: ArticleCategoryList, name: '栏目分类', iconCls: 'el-icon-tickets'},
            {path: '/page3', component: ExampleScss, name: '首页内容', iconCls: 'el-icon-tickets'},
            {path: '/banner', component: BannerList, name: 'Banner管理', iconCls: 'el-icon-picture'}
          ]
        }
      ]
    }
  ]
})
