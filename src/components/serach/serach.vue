<template>
  <div class="serach">
    <div class="head_box">
      <header>
        <i class="iconfont icon-fanhui" @click="back_find"></i>
        <div class="in_search">
          <input type="text" placeholder="浪子回头-茄子蛋" v-model="msg" v-on:input="inputFn" />
        </div>
      </header>
    </div>
    <div class="search_reslut" v-show="isResult">
      <ul class="ul_res">
        <li v-for="(item, index) in searchRes" :key="index">
          <span>
            <i class="iconfont icon-sousuo"></i>
          </span>
          {{item.keyword}}
        </li>
      </ul>
    </div>
    <div class="content" v-show="showContent">
      <h4>热搜榜</h4>
      <ul class="ul_content">
        <li v-for="(item,index) in hotSongs" :key="index">
          <span>{{index+1}}</span>
          {{item.first}}
        </li>
      </ul>
    </div>
    <!-- 搜索结果页面 -->
    <serachse :searchtxt="searchtxt" v-show="!showContent" @bindIsShow="getIsShow"></serachse>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Emit, Watch } from "vue-property-decorator";
import serachse from "./search_se.vue";
@Component({
  components: {
    serachse
  }
})
export default class serach extends Vue {
  @Emit("bindSearch") send(msg: boolean) {}
  hotSongs: any = [];
  msg: string = "";
  searchRes: any = [];
  isResult: boolean = false; // 是否展示搜索结果
  searchtxt: string = ""; // 搜索的字符
  showContent: boolean = true; // 展示热搜版
  // 获取子组件传的值， 隐藏子组件
  getIsShow(msg: boolean) {
    this.showContent = true;
  }
  // 隐藏搜索页面
  back_find() {
    if (!this.showContent) {
      this.showContent = true;
      this.msg = "";
    } else {
      this.send(false);
    }
  }
  created() {
    this.$https.get("/search/hot").then((res: any) => {
      if (res.data && res.data.code === 200) {
        this.hotSongs = res.data.result.hots;
      }
    });
  }
  mounted() {
    this.getSearch_res();
  }
  // 监听点击搜索结果
  getSearch_res() {
    let ulDom: any = document.getElementsByClassName("ul_res")[0] || null;
    const that = this;
    ulDom.addEventListener("click", function(e: any) {
      if (ulDom.children.length > 0) {
        let target = e.target || e.srcElement;
        //console.log(target.innerText);
        that.isResult = false;
        that.showContent = false;
        that.searchtxt = target.innerText; // 将搜索字符传给子组件
        console.log('搜索字符：'+target.innerText)
      }
    });
  }
  // 输入框输入进行请求匹配
  getMsg() {
    let msg: string = this.msg;
    this.$https
      .get("/search/suggest", {
        params: {
          keywords: msg,
          type: "mobile"
        }
      })
      .then((res: any) => {
        this.searchRes.length = 0;
        if (res.data.code === 200 && res.data.result) {
          this.searchRes = res.data.result.allMatch;
        }
      });
  }

  // 监听输入框输入
  inputFn(e: any) {
    if (this.msg.trim().length > 0) {
      // 不知道为什么会失效
      //this.debounce(this.getMsg, 50)
      this.isResult = true;
      this.getMsg();
    }
    //
  }
}
</script>

<style lang="less" scoped>
.serach {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 96;
  background-color: #fff;
  .head_box {
    width: 100%;
    height: 40px;
    background-color: #fff;
    z-index: 96;
    header {
      width: 94%;
      height: 40px;
      margin: 0 auto;
      line-height: 40px;
      display: flex;
      i {
        font-size: 27px;
      }
      .in_search {
        width: 80%;
        margin-left: 18px;
        input {
          width: 100%;
          outline: 0;
          border-bottom: 1px solid #000;
          height: 30px;
        }
      }
    }
  }
  .search_reslut {
    position: absolute;
    top: 43px;
    width: 85%;
    height: 180px;
    left: 4%;
    background-color: #fff;
    z-index: 100;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
    border-top: 1px solid #ccc;
    box-shadow: 3px 3px 5px #ccc;
    .ul_res {
      width: 100%;
      height: 100%;
      li {
        height: 29px;
        line-height: 29px;
        text-align: left;
        border-bottom: 1px solid #ccc;
        span {
          display: inline-block;
          width: 24px;
          text-align: center;
        }
      }
    }
  }
  .content {
    width: 94%;
    height: 400px;
    margin: 0 auto;
    h4 {
      text-align: left;
      font-size: 16px;
    }
    .ul_content {
      width: 100%;
      li {
        width: 100%;
        height: 30px;
        line-height: 30px;
        text-align: left;
        span {
          display: inline-block;
          width: 24px;
          height: 30px;
          color: rgb(250, 84, 84);
          text-align: center;
        }
      }
    }
  }
}
</style>