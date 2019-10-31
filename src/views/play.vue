<template>
  <div class="Play" v-show="realshowplay">
    <div class="bgimg">
      <img :src="cursong.imgUrl" alt />
    </div>
    <header>
      <i class="iconfont icon-fanhui" @click="back"></i>
      <div class="text">
        <span class="title">{{cursong.songName}}</span>
        <span class="songer">{{cursong.songerName}}</span>
      </div>
    </header>
    <div class="content">
      <Volume :baseoptions="processOption" v-show="isShowLyric"></Volume>
      <Lyric :lyTime="lyTime2" v-show="isShowLyric" @binShow="showLyric"></Lyric>
      <div class="playanimate" @click="showLyric">
        <div :class="playstatus===true?'pointer point_in':'pointer'" v-show="!isShowLyric"></div>
        <!-- <div class="pointer" v-show="!isShowLyric"></div> -->
        <div class="videodisc" v-show="!isShowLyric">
          <!-- <div :class="playstatus===true?'inimg cicle_an':'inimg'"> -->
          <div class="inimg">
            <img :src="cursong.imgUrl" alt />
          </div>
        </div>
      </div>
      <div class="playAll">
        <div class="process">
          <span class="start">{{startTime}}</span>
          <div
            class="inprocess"
            @touchstart="proToStart"
            @touchmove="proToMove"
            @touchend="proToEnd"
          >
            <!-- 总进都条 -->
            <div class="process_wrapper"></div>
            <!-- 已经播放的进度条 -->
            <div class="process_white" ref="process_white"></div>
            <!-- 播放圆点 -->
            <div class="process_pointer" ref="process_pointer"></div>
            <!-- 缓冲进度条 -->
            <div class="process_load"></div>
          </div>
          <span class="stop">{{stopTime}}</span>
        </div>
        <div class="playControl">
          <div class="playstyle" @click="changePlayStyle">
            <span class="iconfont icon-liebiaoxunhuan" alt="列表循环" title="列表循环" id="style_play_span"></span>
          </div>
          <div class="pre" @click="preMusic">
            <span class="iconfont icon-48shangyishou"></span>
          </div>
          <div class="playB" @click="playMusic">
            <span
              :class="playstatus===true?'iconfont icon-zanting':'iconfont icon-icon-bofan'"
              id="spanDom"
            ></span>
          </div>
          <div class="next" @click="nextMusic">
            <span class="iconfont icon-48shangyishou"></span>
          </div>
          <div class="play">
            <span class="iconfont icon-daohanglanmoshi02"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop, Emit } from "vue-property-decorator";
import Lyric from "../components/Lyric/Lyric.vue";
import Volume from "../components/Lyric/volume.vue";
import { State, Getter, Action } from "vuex-class";
// import {getRotationDegrees} from '../Utils/animate'
const fuck = { namespace: "playSong" };
interface touchType {
  istouch: boolean;
  startX: number;
  touchX: number;
  parWidth: number;
}
interface baseOptionsType {
  value: number;
  isHidden_white: boolean;
  in_color: string;
  out_color: string;
}
// interface lyrucType{
//     time:number;

// }
@Component({
  components: {
    Lyric,
    Volume
  }
})
export default class Play extends Vue {
  @Getter("getDetailSong", fuck) getDetailSong!: any; // 获取当前播放歌曲详细信息
  @Getter("getIsShowPlay", fuck) getIsShowPlay!: any; // 是否展示播放页面
  @Getter("getplayStatus", fuck) getplayStatus!: any; // 播放状态
  @Getter("getcurTime", fuck) getcurTime!: any; // 播放时间
  @Getter("getsongDuration", fuck) getsongDuration!: string; // 歌曲时间
  @Getter("getplayProcess", fuck) getplayProcess!: string; // 歌曲时间
  @Getter("getplayStyle", fuck) getplayStyle!: number; // 歌曲时间
  @Action("cIsShowPlay", fuck) cIsShowPlay!: (val: boolean) => any; // 是否展示播放页面

  cursong: any = {}; // 当前播放歌曲的详细信息
  startTime: string = "00:00";
  stopTime: string = "00:00";
  realshowplay: boolean = true;
  process_white: any = ""; // 已经播放的进度条
  process_pointer: any = ""; // 播放圆点
  //playSongs:any = ''      // 播放列表
  pointAnimateDom: any = ""; // 碟片指针节点
  circleAnimateDom: any = ""; // 圆形碟片
  playStyle: number; // 播放方式 1 == 列表循环  2 == 随机播放 3== 单曲循环
  spanDom: any = ""; // 播放样式
  isShowLyric: boolean = false; // 是否展示歌词页面
  touchobj: touchType = {
    istouch: false, // 是否移动
    startX: 0, // 开始的坐标
    touchX: 0, // 移动距离
    parWidth: 0 // 进度条宽度
  };
  processOption: baseOptionsType = {
    // 子组件的参数
    value: 0.3, // 音量
    isHidden_white: false, // 是否隐藏白色进度条
    in_color: "#ccc", // 进度条的原色
    out_color: "#fff" // 进度条已经前进的颜色
  };
  lyTime2: number = 0; // 歌词显示时间
  get songDuration() {
    return this.getsongDuration;
  }
  @Watch("songDuration", { immediate: true, deep: true }) // 获取总时间
  get_songDuration(newVal: string, oldVal: string) {
    if (newVal) {
      this.stopTime = newVal;
    }
  }
  get playProcess() {
    return this.getplayProcess;
  }
  @Watch("playProcess")
  changeProcess(newVal: number, oldVal: number) {
    if (newVal) {
      this.startTime = this.formatTime(
        ((newVal / 100) * this.backTime(this.stopTime)) ^ 0
      );
      this.lyTime2 = ((newVal / 100) * this.backTime(this.stopTime) * 1000) ^ 0;
      this.process_pointer.style.left = `${newVal}%`;
      this.process_white.style.width = `${newVal}%`;
    }
  }
  mounted() {
    //this.isShowPlay = this.getValue
    this.init();
    //console.log(this.$store)
  }
  init() {
    let process_white: any = document.getElementsByClassName(
      "process_white"
    )[0];
    let process_pointer: any = document.getElementsByClassName(
      "process_pointer"
    )[0];
    this.process_white = process_white;
    this.process_pointer = process_pointer;
    this.pointAnimateDom = document.getElementsByClassName("pointer")[0];
    this.circleAnimateDom = document.getElementsByClassName("inimg")[0];
    this.spanDom = document.getElementById("spanDom");
  }
  back(): void {
    // 返回按钮
    this.realshowplay = false;
    this.$router.go(-1);
  }
  showLyric() {
    // 是否展示歌词页面
    if (this.isShowLyric) {
      this.isShowLyric = false;
    } else {
      this.isShowLyric = true;
    }
  }
  // 上一首
  preMusic() {
    // 获取播放列表
    let playSongs = this.$store.state.playSong.playSong;
    //console.log(this.playSongs)
    let index = this.getDetailSong.index;
    let id: string | number = "";
    if (index > 0) {
      id = playSongs[index - 1].id;
      index--;
    } else {
      id = playSongs[playSongs.length - 1].id;
      index = playSongs.length;
    }
    this.$store.dispatch("playSong/add_curSong", {
      id,
      index
    });
  }
  // 下一首
  nextMusic() {
    // 获取播放列表
    let playSongs = this.$store.state.playSong.playSong;
    let index = this.getDetailSong.index;
    let id: string | number = "";
    if (index >= playSongs.length - 1) {
      index = 0;
      id = playSongs[index].id;
    } else {
      index++;
      id = playSongs[index].id;
    }
    this.$store.dispatch("playSong/add_curSong", {
      id,
      index
    });
  }
  // 播放音乐
  playMusic(): void {
    let pointAnimateDomStyle = this.pointAnimateDom.style;
    if (this.getplayStatus) {
      this.$store.dispatch("playSong/cplsyStatus", false);
      this.pointAnimateDom.className = "pointer";
    } else {
      this.$store.dispatch("playSong/cplsyStatus", true);
      this.pointAnimateDom.className = "pointer point_in";
    }
  }
  // 获取播放歌曲信息
  get detailSong() {
    return this.getDetailSong;
  }
  @Watch("detailSong", { immediate: true, deep: true })
  onchangeValue(newVal: any, oldVal: string) {
    if (JSON.stringify(newVal) === "{}" && typeof oldVal === "undefined") {
      console.log("没有之前的播放歌曲");
    } else {
      this.cursong = newVal;
    }
  }
  // 是否展示播放页面
  get showplay() {
    return this.getIsShowPlay;
  }
  @Watch("showplay")
  showplayFn(newVal: boolean, oldVal: boolean) {
    if (newVal === true && JSON.stringify(this.cursong) != "{}") {
      this.realshowplay = newVal;
    } else {
      console.log(typeof newVal);
    }
  }
  // 如果 store 的isplay 为 true,则可以播放
  // 获取播放状态
  get playstatus() {
    return this.getplayStatus;
  }
  @Watch("playstatus")
  getplayStatusFn(newVal: any, oldVal: any) {
    if (newVal === true) {
      this.circleAnimateDom.style.animationPlayState = "running";
    } else {
      this.circleAnimateDom.style.animationPlayState = "paused";
    }
  }
  // 点击进度条
  proToStart(e: any) {
    e.preventDefault();
    // 重置
    this.touchobj.startX = 0;
    this.touchobj.touchX = 0;
    //console.log(1)
    this.touchobj.istouch = true;
    // 进度条点击，计算的宽度
    this.touchobj.startX =
      e.touches[0].pageX - this.process_white.getBoundingClientRect().left;
    // 进度条宽度
    let process_wrapper = document.getElementsByClassName(
      "process_wrapper"
    )[0] as HTMLElement;
    this.touchobj.parWidth = parseInt(
      window.getComputedStyle(process_wrapper).width
    );
    // 鼠标鼠标距离为 0
    this.offsetLeft(0);
  }
  // 拖动
  proToMove(e: any) {
    if (!this.touchobj.istouch) {
      return;
    } else {
      this.$store.dispatch("playSong/clistenFn", false);
      let X =
        e.touches[0].pageX -
        this.touchobj.startX -
        this.process_white.getBoundingClientRect().left; // 滑动距离 + 距离左边视口的距离
      this.touchobj.touchX = X; // 移动距离
      this.offsetLeft((X / this.touchobj.parWidth) * 100);
    }
  }
  proToEnd(e: any) {
    let num: number = this.touchobj.touchX / this.touchobj.parWidth;
    this.touchobj.istouch = false;
    this.offsetLeft(num * 100);
    this.$store.dispatch("playSong/clistenFn", true);
  }
  // 进度条样式改变  num == 鼠标移动的距离
  offsetLeft(num: number) {
    // 第一次点击位置到元素左边的距离
    let start = (this.touchobj.startX / this.touchobj.parWidth) * 100;
    //
    let endValue: number = start + num;
    if (endValue <= 0) {
      endValue = 0;
    } else if (endValue >= 100) {
      endValue = 100;
    }
    if (this.touchobj.istouch) {
      this.process_pointer.style.left = `${endValue}%`;
      this.process_white.style.width = `${endValue}%`;
      this.startTime = this.formatTime(
        Math.floor((endValue / 100) * this.backTime(this.stopTime))
      );
    } else {
      this.process_pointer.style.left = `${endValue}%`;
      this.process_white.style.width = `${endValue}%`;
      this.$store.dispatch("playSong/cplayprocess", endValue);
      this.$store.dispatch(
        "playSong/changecurtime",
        ((endValue / 100) * this.backTime(this.stopTime)) ^ 0
      );
      this.startTime = this.formatTime(
        Math.floor((endValue / 100) * this.backTime(this.stopTime))
      );
    }
  }
  // 切换播放方式
  changePlayStyle(): void {
    let dom: any = document.getElementById("style_play_span");
    let num = this.getplayStyle;
    switch (num) {
      case 1: // 点击变成 2 随机播放
        num++;
        dom.className = "iconfont icon-suijibofang";
        this.$store.dispatch("playSong/cplayStyle", num);
        this.$toast("随机播放", 1000);
        //dom.setAttribute('src', require('../assets/随机播放.svg'))
        dom.setAttribute("alt", "随机播放");
        dom.setAttribute("title", "随机播放");
        break;
      case 2: // 变成 3  单曲循环  在 end 函数中传递参数
        num++;
        dom.className = "iconfont icon-danquxunhuan";
        this.$store.dispatch("playSong/cplayStyle", num);
        this.$toast("单曲循环", 1000);
        dom.setAttribute("alt", "单曲循环");
        dom.setAttribute("title", "单曲循环");
        break;
      case 3: // 变成 1 列表循环
        num = 1;
        dom.className = "iconfont icon-liebiaoxunhuan";
        this.$store.dispatch("playSong/cplayStyle", num);
        this.$toast("列表循环", 1000);
        dom.setAttribute("alt", "列表循环");
        dom.setAttribute("title", "列表循环");
      default:
        break;
    }
  }
  // 格式化时间为 82 => 01:22
  formatTime(num: number): string {
    if (num < 10) {
      return "00:0" + num;
    } else if (num >= 10 && num < 60) {
      return "00:" + num;
    } else if (num >= 60) {
      let min = Math.floor(num / 60);
      let s = num - 60 * min;
      if (min < 10) {
        if (s < 10) {
          return "0" + min + ":" + "0" + s;
        } else {
          return "0" + min + ":" + s;
        }
      } else {
        if (s < 10) {
          return min + ":" + "0" + s;
        } else {
          return min + ":" + s;
        }
      }
    }
  }
  // 格式化时间为 01:22 => 82
  backTime(time: string): number {
    // 字符串必须要使用单引号
    const timeArr: string[] = time.split(":");
    let min: number = parseInt(timeArr[0]);
    let s: number = parseInt(timeArr[1]);
    return min * 60 + s;
  }
}
</script>

<style lang="less" scoped>
.Play {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 999;
  background-color: #fff;
  overflow: hidden;
  header {
    width: 94%;
    margin: 0 auto;
    height: 40px;
    display: flex;
    .text {
      width: 50%;
      height: 100%;
      text-align: left;
      color: #fff;
      margin-left: 15px;
      .title {
        display: block;
        width: 100%;
        height: 25px;
        line-height: 25px;
        font-size: 15px;
      }
      .songer {
        display: block;
        width: 100%;
        height: 15px;
        line-height: 15px;
        font-size: 12px;
      }
    }
    i {
      font-size: 32px;
      color: #fff;
    }
  }
  .bgimg {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -99;
    background-color: rgba(15, 15, 15, 0.7);
    img {
      width: 100%;
      height: 100%;
      filter: blur(50px);
      z-index: -999;
    }
  }
  .content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .playanimate {
      width: 100%;
      height: 400px;
      position: relative;
      .pointer {
        width: 150px;
        height: 150px;
        background: url("../assets/swith.png") no-repeat;
        background-size: 100% 100%;
        position: absolute;
        top: 0;
        left: 50%;
        z-index: 10;
        transform-origin: 10px 10px;
        transition: all 1s;
      }
      .point_in {
        transform: rotate(18deg);
      }
      @keyframes cicle_animate {
        from {
          transform: rotate(0);
        }
        to {
          transform: rotate(360deg);
        }
      }
      .videodisc {
        width: 250px;
        height: 250px;
        position: absolute;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        .inimg {
          width: 100%;
          height: 100%;
          background: url("../assets/cd-mine.png") no-repeat;
          background-size: 100% 100%;
          z-index: 10;
          animation: 8s cicle_animate infinite linear;
          img {
            width: 160px;
            height: 160px;
            transform: translateY(47px);
            border-radius: 50%;
          }
        }
      }
    }
    .playAll {
      height: 80px;
      width: 100%;
      position: absolute;
      bottom: 0;
      .process {
        height: 10px;
        width: 94%;
        margin: 0 auto;
        display: flex;
        align-items: center;
        color: #fff;
        font-size: 12px;
        .start {
          padding-right: 15px;
        }
        .stop {
          padding-left: 15px;
        }
        .inprocess {
          width: 100%;
          height: 5px;
          position: relative;
          .process_wrapper {
            width: 100%;
            height: 5px;
            background-color: rgb(75, 73, 73);
            border-radius: 5px;
            z-index: 99;
          }
          .process_pointer {
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
          .process_white {
            width: 0%;
            height: 5px;
            background-color: #fff;
            z-index: 10;
            position: absolute;
            top: 0px;
            border-radius: 5px;
            z-index: 77;
          }
          .process_load {
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
      .playControl {
        height: 70px;
        width: 80%;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        div {
          width: 34px;
          height: 34px;
          span {
            padding-left: 2px;
            color: #fff;
            font-size: 27px;
          }
        }
        .next {
          transform: rotate(180deg);
          transform-origin: center;
        }
        .playB {
          border: 2px solid #fff;
          border-radius: 50%;
          width: 32px;
          height: 32px;
        }
      }
    }
  }
}
</style>
