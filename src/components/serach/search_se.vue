<template>
  <div class="search_se">
    <div class="final_res">
      <ul class="ul_res2">
        <li
          v-for="(item, index) in searchSongs"
          :key="index"
          class="lisong"
          :musicId="item.id"
          :mykey="index"
        >
          <div class="textright">
            <span>{{item.name}}</span>
            <span class="spantwo">{{item.artists[0].name}}-{{item.album.name}}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Emit, Watch, Prop } from "vue-property-decorator";

@Component
export default class serachse extends Vue {
  @Emit('bindIsShow') send(msg:boolean){}

  showself: boolean = false;
  searchSongs: any = [];
  Songdetail: {
    id: string;         // 歌曲id
    imgUrl: string;     // 图片地址
    songName: string;   // 歌曲名字
    songerName: string; // 歌手名字
    albumName: string;
  } = {
    id:'',
    imgUrl: '',     // 图片地址
    songName: '',   // 歌曲名字
    songerName: '', // 歌手名字
    albumName: '',
  };
  @Prop({}) searchtxt!: string;
  @Watch("searchtxt")
  getsearchtxt(newVal: string, oldVal: string) {
    //console.log(newVal);
    if (newVal) {
      this.getSongs(newVal);
    }
  }
  getSongs(val: string) {
    this.$https
      .get("/search", {
        params: {
          keywords: val
        }
      })
      .then((res: any) => {
        if (res.data.result && res.data.result.songs) {
          this.searchSongs = res.data.result.songs;
        }
      });
  }
  mounted() {
    this.listenClick();
  }
  listenClick() {
    let ulDom: any = document.querySelector(".ul_res2");
    const that = this;
    ulDom.addEventListener("click", function(e: any) {
     
      if (ulDom.children.length > 0) {
        let target = e.target || e.srcElement;
        let liDom: any = getLi(target);
        let id: string = liDom.getAttribute("musicId");
        // let index: string = liDom.getAttribute("mykey");
        //console.log("{id:" + id + ",index:" + index);
        that.getDetail(id);
        //console.log(that.searchSongs[index])
        that.$store.dispatch('playSong/add_playsong', that.Songdetail)
        
        that.$store.dispatch('playSong/add_curSong', {id:id,index:0})
        that.send(true)
        //that.$store.dispatch('playSong/csearchplay', false)
        that.$router.push({path:'/playSong'})
       
      }
    });
    // 获取Li元素
    function getLi(tar: any): HTMLElement {
      if (tar.nodeName != "LI") {
        // 这里需要加 return ,不加return 的话返回一个空值，因为作用域改变了
        return getLi(tar.parentNode);
      } else {
        return tar;
      }
    }
  }
  // 获取歌曲详细信息
  getDetail(ids: string) {
    const that:any = this
    this.$https
      .get("/song/detail", {
        params: {
          ids: ids
        }
      })
      .then((res: any) => {
        if (res.data && res.data.code === 200) {
          that.Songdetail.id = ids;
          that.Songdetail.imgUrl = res.data.songs[0].al.picUrl;
          that.Songdetail.songName = res.data.songs[0].name;
          that.Songdetail.songerName = res.data.songs[0].ar[0].name;
          that.Songdetail.albumName = res.data.songs[0].al.name
        }
      });
  }
}
</script>

<style lang="less" scoped>
.search_se {
  width: 100%;
  height: 300px;
  position: absolute;
  top: 40px;
  left: 0;
  z-index: 96;
  .final_res {
    height: 521px;
    width: 100%;
    overflow: scroll;
    .ul_res2 {
      width: 100%;
      height: auto;
      .lisong {
        height: 50px;
        width: 94%;
        margin: 0 auto;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        border-bottom: 1px solid #000;
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
}
</style>