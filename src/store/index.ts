import Vue from 'vue'
import Vuex from 'vuex'

import playSong from './playSong'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: { playSong }
})