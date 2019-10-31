import Vue from "vue";
import LoadComponent from "../components/load/load.vue";

const Loading:any = {}
let showLoading:boolean = false // 是否显示loading组件
const LoadingConstructor = Vue.extend(LoadComponent)

Loading.install = function (Vue:any) {
  let loadingNode:any = null
  Vue.prototype.$loading = function (type:string) {
    if(type === 'hide'){
      loadingNode.isShowLoading = false
    }else{
      if(showLoading){
        return
      }
      loadingNode = new LoadingConstructor({
        data:{
          isShowLoading:true,
        }
      })
      // 需要先挂载才能修改data数据
      loadingNode.$mount()
      document.body.appendChild(loadingNode.$el)
      loadingNode.isShowLoading = true
    }
  };
  ['show','hide'].forEach((type:string) => {
    Vue.prototype.$loading[type] = function () {
      return Vue.prototype.$loading(type);
    }
  });
}

export default Loading