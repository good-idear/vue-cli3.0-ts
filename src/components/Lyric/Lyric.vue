<template>
  <div class="lyric" @click="back" v-show="isshow">
    <div class="content">
      <div class="innerBox" ref="innerBox">
        <p
          v-for="(item, index) in lyrics"
          :key="index"
          :onkey="index"
          :class="{'heighlight':index===line}"
        >{{item.txt}}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Emit } from "vue-property-decorator";
import { State, Getter, Action } from "vuex-class";
const fuck = { namespace: "playSong" };
interface lyricsType {
  time: number;
  txt: string;
}
@Component({})
export default class Lyric extends Vue {
  @Getter("getDetailSong", fuck) getDetailSong!: any; // 获取当前播放歌曲详细信息
  @Prop({}) lyTime!: any;
  // 声明一个json数组对象
  lyrics: { time: number; txt: string }[] = [];
  curPre: number = 0;
  isshow: boolean = false;
  timeArr: any[] = []; // 时间数组
  line: number = 0; // 歌词高亮的行数
  innerBoxStyle: any; //内部盒子样式
  len:number;         // 总共有多少句
  content:any;
  mounted() {
    let innerBox: any = document.getElementsByClassName("innerBox")[0];
    this.innerBoxStyle = innerBox.style;
    let content:any = document.querySelector('.content')
    this.content = content
    let id = this.datailSong.id
    this.getData(id)
  }
  // 获取歌词并且格式化
  getData(id: string) {
    const that = this;
    this.$https
      .get("/lyric", {
        params: {
          id: id
        }
      })
      .then((res: any) => {
        // 这个就是歌词
        let allLyric: any = res.data.lrc.lyric;
        let LyricArr: any = (allLyric || "").split(/\[\d{2}:\d{2}\.\d{2,3}\]/); // 歌词数组
        let timeArr: any = allLyric.match(/\d{2}:\d{2}\.\d{2,3}/g); // 时间数组
        timeArr = timeArr.map((item: any) => {
          let min = parseInt((item || "").split(":")[0]);
          let sendArr = parseInt(
            ((item || "").split(":")[1] || "").split(".")[0]
          );
          let ms = parseInt(((item || "").split(":")[1] || "").split(".")[1]);
          return min * 60 * 1000 + sendArr * 1000 + ms;
        });
        this.timeArr = timeArr;
        for (let i = 0; i < LyricArr.length; i++) {
          let item = {
            time: timeArr[i],
            txt: LyricArr[i]
          };
          this.lyrics.push(item);
        }
        this.len = timeArr.length
        this.innerBoxStyle.transform = `translateY(0px)`;
      });
    //this.lyrics.splice(0, 1);
  }
  // 监视播放时间
  @Watch("lyTime",{deep:true})
  changelyTime(newVal: number, oldVal: number) {
    if (newVal) {
      this.lyTime = newVal;
      for (let i = 0; i < this.timeArr.length; i++) {
        if (newVal >= this.timeArr[i] && newVal < this.timeArr[i + 1]) {
          this.line = i + 1;
          if (i > 5 && i < this.len-5) {
            this.innerBoxStyle.transform = `translateY(-${32 *
              (this.line - 5)}px)`;
            // document.querySelector('.content').scrollTop = 32*(this.line-5)
            // console.log(document.querySelector('.content').scrollTop)
          }
        }
      }
    }
  }
  get datailSong(){
    return this.getDetailSong
  }
  @Watch("datailSong",{deep:true})
  changesongid(newVal: any, oldVal: any) {
    this.lyrics.length = 0;
    if (newVal) {
      this.getData(newVal.id);
    }
  }
  // 隐藏歌词页面
  @Emit("binShow") send(msg: boolean) {}
  back() {
    this.isshow = false;
    this.send(true);
  }
}
</script>

<style lang="less" scoped>
.lyric {
  width: 100%;
  height: auto;
  margin: 0 auto;
  .content {
    width: 100%;
    height: 330px;
    overflow: hidden;
    .innerBox {
      width: 100%;
      height: 330px;
      p {
        width: 100%;
        height: 32px;
        line-height: 32px;
      }
      .heighlight {
        color: #fff;
      }
    }
  }
}
</style>