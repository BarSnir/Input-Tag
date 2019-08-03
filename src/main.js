import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false
Vue.config.keyCodes.comma = 188;
Vue.config.keyCodes.backspace = 8;

new Vue({
  render: h => h(App),
}).$mount('#app')
