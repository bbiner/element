import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
// 样例路由
import ExampleScss from '@/components/example/Scss'
import ExampleElementUI from '@/components/example/ElementUI'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    { path: '/example/scss', component: ExampleScss },
    { path: '/example/element-ui', component: ExampleElementUI }
  ]
})
