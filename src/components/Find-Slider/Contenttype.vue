<template>
  <div class="contentType">
    <ul class="contentl">
      <li v-for="(item, index) in contentList" :key="index">
        <router-link :to="item.url+'/'+item.id" class="alicenter">
          <div class="licenter">
            <img :src="item.imgurl" :alt="item.name" />
            <span :class="index===0 ? 'cal' : 'none'">{{(new Date()).getDate()}}</span>
          </div>
          <span>{{item.name}}</span>
        </router-link>
      </li>
    </ul>
    <hr />
    <!-- 推荐歌单 -->
    <div class="recommendSong">
      <div class="retitle">
        <h2>推荐歌单</h2>
        <router-link to="/songSquare" class="square">
          <span>歌单广场</span>
        </router-link>
      </div>
      <ul class="recontent">
        <li v-for="(item, index) in songList" :key="index">
          <router-link class="list_a" :to="'/TodayRecommend/'+item.id">
            <div class="recontentdiv">
              <img :src="item.picUrl" :alt="item.alg" />
              <div class="recontent_right">{{parseInt(item.playCount/10000)}}万</div>
            </div>
            <span>{{item.name}}</span>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

// 这个装饰器必不可少，少了里面的函数会失效，而且不会报错
@Component({})
export default class ContentType extends Vue {
  // 内容分类
  contentList: object[] = [
    {
      name: "每日推荐",
      url: "/Todayrecommend",
      imgurl: require("../../assets/calender.svg"),
      id: "123456"
    },
    {
      name: "歌单",
      url: "/songList",
      imgurl: require("../../assets/songrecommend.svg"),
      id: "123456"
    },
    {
      name: "排行榜",
      url: "/songRank",
      imgurl: require("../../assets/rank.svg"),
      id: "123456"
    },
    {
      name: "电台",
      url: "/radioStation",
      imgurl: require("../../assets/broadcast.svg"),
      id: "123456"
    },
    {
      name: "直播",
      url: "/liveBroadcast",
      imgurl: require("../../assets/videoline.svg"),
      id: "123456"
    }
  ];
  // 歌单
  songList: object[] = [];

  // mounted
  created() {
    //this.$loading('show')
    this.$https
      .get("/personalized", {
        params: {
          limit: 6
        }
      })
      .then((res: any) => {
        if (res.status === 200 && res.data.code === 200) {
          this.songList = res.data.result;
          //this.$loading('hide')
        }
      });
  }
}
</script>

<style lang="less" scoped>
.contentType {
  width: 100%;
  height: 66px;
  margin: 20px 0px;
  position: relative;
  hr {
    width: 104%;
    position: absolute;
    left: -4%;
    height: 0px;
    top: 86px;
  }
  .contentl {
    display: flex;
    align-content: space-between;
    justify-content: space-between;
    width: 100%;
    li {
      width: 50px;
      .alicenter {
        display: block;
        width: 100%;
        height: 100%;
        .licenter {
          background-color: red;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          .cal {
            color: #fff;
            font-size: 12px;
            margin-top: -20px;
          }
          .none {
            display: none;
          }
          img {
            width: 30px;
            height: 30px;
            margin-top: 8px;
          }
        }
        span {
          font-size: 12px;
          display: block;
        }
      }
    }
  }
  .recommendSong {
    width: 100%;
    height: auto;
    margin-top: 20px;
    .retitle {
      width: 100%;
      height: 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      h2 {
        text-align: left;
        font-size: 20px;
        width: 50%;
        line-height: 20px;
        height: 20px;
      }
      .square {
        display: block;
        width: 72px;
        height: 20px;
        border-radius: 20px;
        border: 1px solid #ccc;
        span {
          font-size: 13px;
        }
      }
    }
    .recontent {
      width: 100%;
      height: 358px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-content: flex-start;
      li {
        width: 110px;
        height: 45%;
        .list_a {
          width: 100%;
          height: 100%;
          display: block;
          .recontentdiv {
            width: 100%;
            height: 110px;
            position: relative;
            border-radius: 5px;
            overflow: hidden;
            img {
              width: 100%;
              height: 100%;
              position: absolute;
              top: 0;
              left: 0;
              z-index: 9;
            }
            .recontent_right {
              position: absolute;
              right: 5px;
              top: 2px;
              z-index: 10;
              color: #fff;
            }
          }
          span {
            font-size: 13px;
            width: 100%;
            height: 35px;
            text-align: left;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box; //作为弹性伸缩盒子模型显示。
            -webkit-box-orient: vertical; //设置伸缩盒子的子元素排列方式--从上到下垂直排列
            -webkit-line-clamp: 2; //显示的行
          }
        }
      }
    }
  }
}
</style>