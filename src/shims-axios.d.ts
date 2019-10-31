import Vue from 'vue'
declare module 'vue/types/vue' {  
  interface Vue{
    $https:any,
    $loading:Function,
    $toast:Function
  }
}