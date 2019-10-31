import Vue from "vue";
import Router from "vue-router";


import Find from "../src/views/Find.vue";
import TodayRecommend from "../src/views/todayrecommend.vue";
import PlaySong from '../src/views/play.vue'
Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "/",
      redirect:'/Find',
    },
    {
      path:'/Find',
      name:'Find',
      component:Find
    },
    {
      path:'/TodayRecommend/:id',
      name:'TodayRecommend',
      component:TodayRecommend
    },
    {
      path:'/playSong',
      name:'playSong',
      component:PlaySong
    }
  ]
});
