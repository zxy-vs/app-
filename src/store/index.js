import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    indexs: 0,
    listKey:[],
  },
  getters: {
  
  },
  actions: {
    
  },
  modules: {},
  plugins: [createPersistedState({
    storage: window.localStorage,
   })]
})