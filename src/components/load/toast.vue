<template>
  <div class="toast" v-if="isShowLoading">
      <span>{{txt}}</span>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop, Emit } from "vue-property-decorator";
@Component({})
export default class Toast extends Vue {
  isShowLoading: boolean = false;    // 是否展示
  txt:string = ''                   // 消息文字
//   duration:number = 1500;                  // 显示时间
//   timer:any = null

}
</script>

<style lang="less" scoped>
.toast{
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 200px;
    height: 50px;
    z-index: 10000;
    background-color: rgba(10, 10, 10, 0.8);
    border-radius: 10px;
    span{
        font-size: 16px;
        text-align: center;
        display: inline-block;
        width: 100%;
        height: 50px;
        line-height: 50px;
        color: #fff;
    }
}
</style>>

