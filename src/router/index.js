import Vue from 'vue'
import Router from 'vue-router'
// 样例路由
const Home = () => import('@/components/Home')
const Empty = () => import('@/components/Empty')
const ExampleElementUI = () => import('@/components/example/ElementUI')
const ExampleScss = () => import('@/components/example/Scss')
const ArticleCategory = () => import('@/components/community/article/ArticleCategory')

Vue.use(Router)

export default new Router({
  routes: [
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
            {
              path: '/page1',
              component: ArticleCategory,
              name: '栏目分类',
              iconCls: 'el-icon-tickets',
              children: [
                {
                  path: '/page1112',
                  component: ExampleElementUI,
                  name: '分类列表',
                  iconCls: 'el-icon-tickets'
                }
              ]
            },
            {path: '/page3', component: ExampleScss, name: '首页内容', iconCls: 'el-icon-tickets'},
            {path: '/page2', component: ExampleScss, name: 'Banner管理', iconCls: 'el-icon-picture'}
          ]
        }
      ]
    }
  ]
})
