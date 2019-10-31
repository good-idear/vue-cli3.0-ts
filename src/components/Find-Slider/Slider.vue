<template>
  <div class="silder">
    <div
      class="carousel-wrap"
      id="carousel"
      @touchstart="handleStart"
      @touchmove="hanleMove"
      @touchend = "handleend"
      ref="carousel"
    >
      <ul class="slide-ul">
        <li v-for="(list,index) in imgList" :key="index" class="liimg">
          <a :href="list.aurl" class="aimg">
            <img :src="list.url" />
          </a>
        </li>
      </ul>
      <!-- 图片中心的圆点 -->
      <div class="carousel-items">
        <span
          v-for="(item,index) in imgList.length"
          :key="index"
          :class="{'active':(index+1)===currentIndex}"
          @mouseover="change(index)"
        ></span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
interface Distance{
  nowx:number;
  startx:number;
  movex:number;
}
@Component({})
export default class Slider extends Vue {
  imgList: object[] = [
    {
      url: require("../../assets/1.jpg"),
      aurl: "#"
    },
    {
      url: require("../../assets/2.jpg"),
      aurl: "#"
    },
    {
      url: require("../../assets/3.jpg"),
      aurl: "#"
    },
    {
      url: require("../../assets/4.jpg"),
      aurl: "#"
    },
    {
      url: require("../../assets/5.jpg"),
      aurl: "#"
    },
    {
      url: require("../../assets/6.jpg"),
      aurl: "#"
    },
    {
      url: require("../../assets/7.jpg"),
      aurl: "#"
    },
    {
      url: require("../../assets/8.jpg"),
      aurl: "#"
    }
  ];
  currentIndex: number = 1;
  timer: any = "";
  startX: number = 0;
  domWidth: number = 0; // 父盒子的宽度
  domStyle: any = ""; // 父盒子的样式   然后直接修改相应 css 属性
  autoPlayTime: number = 3000; // 自动播放时间间隔
  sliding: boolean = false; // 是否正在滑动
  auto: boolean = true; // 是否正在播放
  timeDuration: number = 500; //移动一张图片的时间
  
  istouchstart:boolean = false
  istouchmove:boolean = false
  distance:Distance = {
    nowx:0,   // 轮播图的父盒子已经移动的距离
    startx:0,    // 点击的起始点
    movex:0     // 鼠标移动的距离  正数-左移  
  }
  // computed
  mounted() {
    this.$nextTick(() => {
      this.cloneDom();
      this.domStyle.transform = `translate3d(${this.domWidth *
        -1}px, 0px, 0px)`;
      this.setTime();
    });
  }
  created() {}
  // methdos
  // 设置移动图片间隔时间
  setTime(): void {
    this.timer = setTimeout(() => {
      if (this.auto) {
        this.currentIndex++;
        this.sliderGo();
      } else {
        clearTimeout(this.timer);
      }
    }, this.autoPlayTime);
  }
  // 进行移动图片
  setTransform(num: number): void {
    this.domStyle.transform = `translate3d(${num}px, 0px, 0px)`;
  }
  // 进行移动图片轮播
  sliderGo(type?: string): void {
    this.sliding = false;
    this.domStyle.transition =
      type === "touch" ? "250ms" : this.timeDuration + "ms";
    this.setTransform(this.currentIndex * -1 * this.domWidth);
    if (this.auto) {
      this.setTime();
    }
    setTimeout(() => {
      this.domStyle.transition = "0s";
      if (this.currentIndex >= this.imgList.length + 1) {
        this.currentIndex = 1;
        this.setTransform(this.currentIndex * -1 * this.domWidth);
      }
      if (this.currentIndex <= 0) {
        this.currentIndex = this.imgList.length;
        this.setTransform(this.currentIndex * -1 * this.domWidth);
      }
    }, this.timeDuration);
  }
  // 复制dom
  cloneDom(): void {
    let dom: any = document.getElementsByClassName("liimg");
    let firstDom: HTMLElement = dom[dom.length - 1].cloneNode(true);
    let lastDom: HTMLElement = dom[0].cloneNode(true);
    let pardom: any = dom[0].parentNode;
    pardom.appendChild(lastDom);
    pardom.insertBefore(firstDom, dom[0]);
    this.domStyle = pardom.style;
    this.domWidth = pardom.offsetWidth;
  }
  handleStart(event: any): void {
    this.sliding = true
    if(this.sliding){
      clearTimeout(this.timer)
      this.distance.nowx = this.getTransform()
      this.distance.startx = event.touches[0].clientX;
    }
  }
  getTransform():number{
    let x:string = this.domStyle.transform
    x = x.substring(12)
    x = x.match(/(\S*)px/)[1]
    return Number(x)
  }
  hanleMove(event: any): void {
    if(this.sliding){
      clearTimeout(this.timer)
      this.distance.movex = event.touches[0].clientX - this.distance.startx
     
      this.setTransform(this.distance.movex + this.distance.nowx)
    }
  }
  // 鼠标弹起事件
  handleend():void{
    if(this.sliding){
      clearTimeout(this.timer)
      if(this.distance.movex < 0){  // 右移
        // 移动大于1/3
        if(-this.distance.movex >= this.domWidth/3){
          this.currentIndex++
          this.domStyle.transform = `translate3d(${this.currentIndex * -this.domWidth}px, 0px, 0px)`;
          this.domStyle.transition = '50ms'
        }else{
          this.domStyle.transform = `translate3d(${this.currentIndex * -this.domWidth}px, 0px, 0px)`;
          this.domStyle.transition = '50ms'
        }
        this.sliderGo()
      }
      if(this.distance.movex > 0){  // 左移
        // 移动大于1/3
        if(this.distance.movex >= this.domWidth/3){
          this.currentIndex--
          this.domStyle.transform = `translate3d(${this.currentIndex * -this.domWidth}px, 0px, 0px)`;
          this.domStyle.transition = '50ms'
        }else{
          this.domStyle.transform = `translate3d(${this.currentIndex * -this.domWidth}px, 0px, 0px)`;
          this.domStyle.transition = '50ms'
        }
        this.sliderGo()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.silder {
  width: 100%;
  height: 200px;
  margin-top: 40px;
  .carousel-wrap {
    position: relative;
    height: 200px;
    width: 100%;
    overflow: hidden;
    background-color: #fff;
    .slide-ul {
      height: 100%;
      width: 100%;
      display: flex;
      li {
        width: 100%;
        height: 100%;
        z-index: 99;
        flex-shrink: 0;
        .aimg {
          display: block;
          height: 100%;
          width: 100%;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
  .carousel-items {
    position: absolute;
    z-index: 10;
    top: 180px;
    width: 100%;
    margin: 0 auto;
    text-align: center;
    font-size: 0;
    span {
      display: inline-block;
      height: 8px;
      width: 8px;
      margin: 0 3px;
      background-color: #fff;
      cursor: pointer;
      border-radius: 50%;
    }
    .active {
      background-color: red;
    }
  }
}
</style>