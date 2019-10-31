<template>
  <div class="nav">
    <header>
      <div class="left" @click="propMsg">
        <i class="iconfont icon-nav"></i>
      </div>
      <div class="search" @click="showSearch">
        <i class="iconfont icon-sousuo"></i>
      </div>
      <div class="ulDiv">
        <ul class="ulList">
          <li v-for="item in navList" :key="item.key">
            <router-link :to="item.router" class="alink">{{item.name}}</router-link>
          </li>
        </ul>
      </div>
    </header>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Emit } from "vue-property-decorator";

@Component
export default class Nav extends Vue {
  navList: object[] = [
    {
      name: "我的",
      router: "/Myown"
    },
    {
      name: "发现",
      router: "/Find"
    },
    {
      name: "云村",
      router: "/CloudVillage"
    },
    {
      name: "视频",
      router: "/Video"
    }
  ];
  // bindSend 为父组件引用子组件上 绑定的事件名称
  @Emit("bindSend") send(type: string) {}
  propMsg() {
    this.send("left");
  }
  showSearch() {
    this.send("right");
  }
}
</script>
<style lang="less" scoped>
.nav {
  width: 100%;
  height: 40px;
  position: fixed;
  top: 0;
  z-index: 95;
  background-color: #fff;
  header {
    width: 94%;
    height: 40px;
    margin: 0 auto;
    overflow: hidden;
    .ulDiv {
      width: 100%;
      .ulList {
        display: flex;
        justify-content: space-between;
        width: 68%;
        margin: 0 auto;
        height: 40px;
        line-height: 40px;
        .alink {
          display: block;
          width: 100%;
          height: 100%;
        }
        .router-link-exact-active {
          font-size: 20px;
          font-weight: 600;
          transform: scale(1.2);
        }
      }
    }
    .left {
      width: 32px;
      height: 100%;
      float: left;
      i {
        font-size: 32px;
      }
    }
    .search {
      width: 32px;
      height: 100%;
      float: right;
      line-height: 40px;
      i {
        font-size: 24px;
      }
    }
  }
}
</style>