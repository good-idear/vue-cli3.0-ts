<template>
  <div class="volume">
    <div class="involume" @touchstart="proToStart2" @touchmove="proToMove2" @touchend="proToEnd2" >
      <!-- 总进都条 -->
      <div class="volume_wrapper"></div>
      <!-- 已经播放的进度条 -->
      <div class="volume_white" ref="volume_white"></div>
      <!-- 播放圆点 -->
      <div class="volume_pointer" ref="volume_pointer"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Emit } from "vue-property-decorator";

interface baseOptionsType {
  // 父组件传参配置
  value: number;            // 音量
  isHidden_white: boolean;  // 是否隐藏白色进度条
  in_color: string;         // 进度条的原色
  out_color: string;        // 进度条已经前进的颜色
}
interface touchType {
  istouch: boolean;
  startX: number;
  touchX: number;
  parWidth: number;
}
@Component({})
export default class Volume extends Vue {
  touchobj: touchType = {
    // 进度条的配置
    istouch: false, // 是否移动
    startX: 0, // 开始的坐标
    touchX: 0, // 移动距离
    parWidth: 0 // 进度条宽度
  };
  @Prop({
    type: Object,
    required: true
  })
  baseoptions!: baseOptionsType;
  volume_white: any;
  volume_pointer: any;
  mounted() {
    this.init();
    this.offsetLeft2(this.baseoptions.value *100)
  }
  init() {
    //console.log(this.baseoptions)
    let volume_white: any = document.getElementsByClassName("volume_white")[0];
    let volume_pointer: any = document.getElementsByClassName(
      "volume_pointer"
    )[0];
    this.volume_white = volume_white;
    this.volume_pointer = volume_pointer;
  }
  // 点击进度条
  proToStart2(e: any) {
    e.preventDefault();
    this.touchobj.startX = 0
    this.touchobj.touchX = 0
    this.touchobj.istouch = true;
    // 进度条点击，计算的宽度
    this.touchobj.startX =
      e.touches[0].pageX - this.volume_white.getBoundingClientRect().left;
    // 进度条宽度
    let volume_wrapper = document.getElementsByClassName(
      "volume_wrapper"
    )[0] as HTMLElement;
    //let parDomStyle = this.$refs.volume_white.style
    this.touchobj.parWidth = parseInt(
      window.getComputedStyle(volume_wrapper).width
    );
    //this.offsetLeft2(0);
  }
  // 拖动
  proToMove2(e: any) {
    if (!this.touchobj.istouch) {
      return;
    } else {
      let X =
        e.touches[0].pageX - this.touchobj.startX - this.volume_white.getBoundingClientRect().left; // 滑动距离 + 距离左边视口的距离
      this.touchobj.touchX = X; // 移动距离
      this.offsetLeft2((X / this.touchobj.parWidth) * 100);
      // 回调函数
    }
  }
  proToEnd2(e: any) {
    let num: number = this.touchobj.touchX / this.touchobj.parWidth;
    this.touchobj.istouch = false;
    this.offsetLeft2(num * 100);
    // 回调函数
  }
  offsetLeft2(num: number) {
    let startx: number = this.touchobj.startX/this.touchobj.parWidth*100 | 0;
    let endValue: number = startx + num;
    if (endValue >= 100) {
      endValue = 100;
    } else if (endValue <= 0) {
      endValue = 0;
    }
    this.volume_pointer.style.left = `${endValue}%`;
    this.volume_white.style.width = `${endValue}%`;
    this.$store.dispatch('playSong/c_volume', endValue/100)
  }
}
</script>

<style lang="less" scoped>
.volume {
    width: 80%;
    margin: 0 auto;
    margin-top: 10px;
    margin-bottom: 10px;
  .involume {
    width: 100%;
    height: 5px;
    position: relative;
    .volume_wrapper {
      width: 100%;
      height: 5px;
      background-color: rgb(75, 73, 73);
      border-radius: 5px;
      z-index: 99;
    }
    .volume_pointer {
      background-color: #fff;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      position: absolute;
      top: -1px;
      left: 0px;
      transform: translateX(-2px);
      z-index: 88;
    }
    .volume_white {
      width: 0%;
      height: 5px;
      background-color: #fff;
      z-index: 10;
      position: absolute;
      top: 0px;
      border-radius: 5px;
      z-index: 77;
    }
    .volume_load {
      width: 0%;
      height: 5px;
      background-color: rgba(255, 255, 255, 0.3);
      z-index: 10;
      position: absolute;
      top: 0px;
      border-radius: 5px;
      z-index: 9;
    }
  }
}
</style>