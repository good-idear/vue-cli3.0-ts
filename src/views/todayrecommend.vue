<template>
  <div class="todayRecommend">
    <div class="bgrecommend" v-show="curView">
      <div class="time">
        <span class="big">{{(new Date()).getDate()}}</span>
        <span>&nbsp;/&nbsp;{{new Date().getMonth()+1 &lt; 10 ? '0'+Number(new Date().getMonth()+1) : (new Date().getMonth()+1) }}</span>
      </div>
      <img src="../assets/1.jpg" alt="广告" />
    </div>
    <div class="back" v-show="curView">
      <div class="button_back" @click="goback">
        <i class="iconfont icon-fanhui"></i>
      </div>
      <span v-show="textShow">每日推荐</span>
    </div>

    <div class="songheader" ref="songheader" v-show="curView">
      <div class="headerb">
        <div class="headleft">
          <span></span>
          <span>播放全部</span>
        </div>
        <div class="select">
          <span>多选</span>
        </div>
      </div>
    </div>
    <ul class="ulsongs" v-show="curView">
      <li
        v-for="(item, index) in songlist"
        :key="index"
        class="lisong"
        :musicId="item.id"
        :mykey="index"
      >
        <div class="songImg">
          <img :src="item.imgUrl" alt="封面" />
        </div>
        <div class="textright">
          <span>{{item.songName}}</span>
          <span class="spantwo">{{item.songerName}}-{{item.albumName}}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { State, Getter, Action, namespace } from "vuex-class";
// import Footer from '../components/footer/footer.vue'
// import Play from '../views/play.vue'
const fuck = { namespace: "playSong" };
@Component({
  components: {
    // Footer,
  }
})
export default class TodayRecommend extends Vue {
  // 添加正在播放的歌曲列表
  //@fuck.Action('add_playsongs') add_playsongs:Function;
  @Action("add_playsongs", fuck) private addplaysongs!: (val: object[]) => void;
  // 添加正在播放的单曲
  //@fuck.Action('add_curSong') add_curSong:Function;
  @Action("add_curSong", fuck) private add_cursong!: (val: object) => void;
  //@fuck.Getter('getPlaySong') getPlaySong:any;
  @Getter("getPlaySong", fuck) getPlaySong!: any;
  @Getter("getIsShowPlay", fuck) getIsShowPlay!: any;
  textShow: boolean = false;
  isFixed: boolean = false;
  songlist: object[] = [];
  curView: boolean = true; // 是否展示当前页面的变量
  clickvalue: boolean = false;
  curPath: string; // 当前路由id
  // 返回上一页
  goback(): void {
    // this.$store.dispatch('playSong/cplsyStatus', false)
    this.$router.go(-1);
  }
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  }
  // 监控路由
  @Watch("$route", { immediate: true, deep: true })
  currouter(to: any, from: any) {
    this.curPath = to.params.id;
  }
  created() {
    this.$loading("show");
    this.$nextTick(() => {
      this.getSongList();
      this.handleSong();
    });
  }
  // 请求推荐歌曲
  getSongList(): void {
    if (this.curPath === "123456") {
      this.$https.get("/recommend/songs").then((res: any) => {
        if (res.status === 200 && res.data.code === 200) {
          //debugger;
          let result: any = res.data.data.dailySongs;
          //console.log(result)
          for (let i = 0; i < result.length; i++) {
            let newData: {
              id: string;
              imgUrl: string;
              songName: string;
              albumName: string;
              songerName: string;
            } = {
              id: "", // 歌曲id
              imgUrl: "", // 图片地址
              songName: "", // 歌曲名字
              songerName: "", // 歌手名字
              albumName: ""
            };

            newData.id = result[i].id;
            newData.imgUrl = result[i].album.picUrl;
            newData.songName = result[i].name;
            newData.songerName = result[i].artists[0].name;
            newData.albumName = result[i].album.name;
            this.songlist.push(newData);
          }
          //console.log(this.songlist)
          this.$loading("hide");
          // 将请求的推荐歌曲保存在 store 中
          //this.$store.dispatch('storeSongList', res.data.data.dailySongs)
          //console.log(this.songlist)
        } else {
          console.log("请求出错");
        }
      });
    } else {
      // const that = this
      // this.$https.get('/playlist/detail',{
      //   params:{
      //     id:that.curPath
      //   }
      // }).then((res:any)=>{
      //   if(res.data.code===200 && res.data.playlist){
      //     let result:any = res.data.playlist.subscribers
      //     for(let i=0;i<result.length;i++){
      //       let newData:{
      //         id:string;
      //         imgUrl:string;
      //         songName:string;
      //         albumName:string;
      //         songerName:string} ={
      //           id:'',               // 歌曲id
      //           imgUrl:'',          // 图片地址
      //           songName:'',        // 歌曲名字
      //           songerName:'',      // 歌手名字
      //           albumName:''
      //         }

      //     }
      //   }
      // })
      this.$toast("该接口未完善", 3000);
    }
  }
  handleScroll(): void {
    let bgrecommend: HTMLElement = document.querySelector(
      ".bgrecommend"
    ) as HTMLElement;
    let bgrecommendStyle: any = bgrecommend.style;
    let top: number = window.document.documentElement.scrollTop;
    if (top >= 100) {
      this.textShow = true;
      bgrecommendStyle.filter = `blur(10px)`;
    } else {
      this.textShow = false;
      bgrecommendStyle.filter = `blur(${top / 10}px)`;
    }
  }
  // 获取点击 li 元素上的歌曲 id
  handleSong(): void {
    const ulsongs = document.querySelector(".ulsongs");
    let that = this;
    ulsongs.addEventListener("click", function(ev: any) {
      that.$loading("show");
      let tar: HTMLElement = ev.target;
      let liDom: HTMLElement = getLi(tar);
      let id: string = liDom.getAttribute("musicId");
      let index: string = liDom.getAttribute("mykey");
      //console.log('id:'+id,'index:'+typeof index)
      // 通过 that 就可以直接调用 action 方法了
      // 将当前播放列表存储到 store 中
      fn1().then(() => {
        that.add_cursong({ id, index });
      });
      that.$loading("hide");
    });
    function fn1() {
      return new Promise((resolve: any, reject: any) => {
        that.addplaysongs(that.songlist);
        setTimeout(() => {
          resolve();
        }, 500);
      });
    }
    // 确保点击到 li 元素
    function getLi(tar: any): HTMLElement {
      if (tar.nodeName != "LI") {
        // 这里需要加 return ,不加return 的话返回一个空值，因为作用域改变了
        return getLi(tar.parentNode);
      } else {
        return tar;
      }
    }
  }
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll);
  }
  get isshowplay() {
    return this.getIsShowPlay;
  }
  @Watch("getIsShowPlay")
  cisshowplay(newVal: boolean, oldVal: boolean) {
    if (typeof newVal != "undefined" && newVal === true) {
      this.curView = false;
    }
    if (typeof newVal != "undefined" && newVal === false) {
      this.curView = true;
    }
  }
}
</script>

<style lang="less" scoped>
.todayRecommend {
  width: 100%;
  height: 500px;
  z-index: 100;
  .bgrecommend {
    width: 100%;
    height: 160px;
    position: sticky;
    top: -100px;
    img {
      position: absolute;
      width: 100%;
      height: 160px;
      top: 0;
      left: 0;
    }
    .time {
      width: 94%;
      color: #fff;
      text-align: left;
      margin: 0 auto;
      padding-top: 80px;
      .big {
        font-size: 30px;
      }
    }
  }

  .back {
    position: fixed;
    top: 15px;
    left: 4%;
    width: 94%;
    height: 24px;
    display: flex;
    z-index: 222;
    .button_back {
      width: 24px;
      height: 24px;
      display: inline-block;
      i {
        font-size: 32px;
        color: #fff;
      }
    }
    span {
      color: #fff;
      padding-left: 20px;
      height: 24px;
      display: inline-block;
      line-height: 24px;
    }
  }
  .songheader {
    height: 50px;
    width: 100%;
    position: sticky;
    top: 70px;
    transform: translateY(-20px);
    .headerb {
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      height: 100%;
      background-color: #fff;
      display: flex;
      justify-content: space-between;
      .headleft {
        padding-left: 15px;
        height: 100%;
        line-height: 50px;
        text-align: left;
        width: 200px;
      }
      .select {
        padding-right: 15px;
        height: 100%;
        line-height: 50px;
        text-align: right;
      }
    }
  }
  .ulsongs {
    height: 521px;
    width: 100%;
    overflow: scroll;
    margin-top: -20px;
    .lisong {
      height: 50px;
      width: 94%;
      margin: 0 auto;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .songImg {
        height: 40px;
        width: 40px;
        img {
          width: 100%;
          height: 100%;
          border-radius: 8px;
        }
      }
      .textright {
        height: 40px;
        text-align: left;
        width: 240px;
        padding-left: 15px;
        span {
          width: 100%;
          display: block;
          height: 25px;
          line-height: 25px;
          font-size: 16px;
          word-break: keep-all;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .spantwo {
          height: 15px;
          line-height: 15px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>