import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'


import ElementUI from "element-ui"
import "element-ui/lib/theme-chalk/index.css";

import ZTTable from 'vue-table-with-tree-grid'

// 进行全局注册
Vue.component("tree-table", ZTTable)
  // import { Form } from "element-ui"
  // import { FormItem } from "element-ui"
  // import { Input } from "element-ui"
  // Vue.use(Form)
  // Vue.use(FormItem)
  // Vue.use(Input)
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')