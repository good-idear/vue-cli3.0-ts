import Vue from "vue";
import ToastComponent from "../components/load/toast.vue";

const ToastConstructor = Vue.extend(ToastComponent);


function showToast (txt:string, duration = 2000) {
  const toastDom = new ToastConstructor({
    el: document.createElement('div'),
    data () {
      return {
        txt,
        isShowLoading: true,
      }
    }
  })

  document.body.appendChild(toastDom.$el)

  setTimeout(() => {
    toastDom.isShowLoading = false
  }, duration)
}

function registerToast () {
  Vue.prototype.$toast = showToast
}

export default registerToast
