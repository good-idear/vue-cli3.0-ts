<template>
  <div class="toast" v-if="isShowLoading">
    <div class="wrap">
      <i class="iconfont icon-jiazaizhong"></i>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop, Emit } from "vue-property-decorator";
@Component({})
export default class Load extends Vue {
  isShowLoading: boolean = false;
}
</script>

<style lang="less" scoped>
.toast {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.35);
  border-radius: 5px;
  color: #fff;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.wrap{
    width: 80px;
    height: 80px;
    animation: rotateAction 1.5s infinite linear;
    i{
      font-size: 75px;

    }
}
@keyframes rotateAction {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>