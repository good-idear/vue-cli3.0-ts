<template>
  <div id="app">
    <Nav @bindSend="propType" v-show="curpath"></Nav>
    <!-- 遮罩层 -->
    <div class="mask" v-show="isShow" @click="changeShow(false)"></div>
    <transition name="nav_left">
      <HomeNav v-show="isShow"></HomeNav>
    </transition>
    <transition name="nav_right">
      <Search v-show="isShowSearch" @bindSearch="showsearch"></Search>
    </transition>
    <router-view></router-view>
    <Footer></Footer>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { State, Getter, Action } from "vuex-class";
const fuck = { namespace: "playSong" };
//引用组件必须要加后缀
import Nav from "./components/Nav.vue";
import HomeNav from "./components/Home_nav/Home_nav.vue";
import Search from "./components/serach/serach.vue";
import Footer from "./components/footer/footer.vue"
@Component({
  components: {
    Nav,
    HomeNav,
    Search,
    Footer,
  }
})
export default class App extends Vue {
  @Getter("getsearchPlay", fuck) getsearchPlay!: boolean;
  isShow: boolean = false; //  是否展示左边的页面
  curpath: boolean = false; // 是否展示Nav
  isShowSearch: boolean = false; // 是否展示右边的页面
  mounted() {
    //this.$loading('hide')
  }
  @Watch("$route",{immediate: true})
  currouter(to: any, from: any) {
    if (this.$route.path === "/Find") {
      this.curpath = true;
      this.$loading('hide')
    } else {
      this.curpath = false;
    }
    if (this.$route.path === "/todayrecommend") {
      this.isShowSearch = false;
    }
  }
  changeShow(type?: boolean): void {
    this.isShow = false;
  }
  // 接收子组件传值
  propType(type: string): void {
    //console.log(type)
    if (type === "left") {
      this.isShow = true;
    } else if (type === "right") {
      this.isShowSearch = true;
    }
  }
  // 是否展示搜索页面
  showsearch(type: boolean): void {
    this.isShowSearch = type;
  }
}
</script>

<style lang="less">
* {
  padding: 0;
  margin: 0;
  border: none;
}
a {
  list-style: none;
  text-decoration: none;
  color: black;
}
li {
  list-style: none;
}
body {
  width: 100%;
  height: 100%;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
  position: relative;
  .mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 98;
    background-color: rgba(51, 51, 51, 0.8);
  }
  // 左边动画页面
  .nav_left-enter-active {
    transition: all 0.8s ease;
    transform: translateX(0px);
  }
  .nav_left-enter {
    transform: translateX(-300px);
  }

  .nav_left-leave-active {
    transition: all 0.4s ease;
    transform: translateX(-300px);
  }
  .nav_left-leave {
    transform: translateX(0px);
  }
  // 搜索页面动画
  .nav_right-enter-active {
    transition: all 0.4s ease;
    transform: translateX(0px);
  }
  .nav_right-enter {
    transform: translateX(375px);
  }
  .nav_right-leave-active {
    transition: all 0.4s ease;
    transform: translateX(375px);
    opacity: 0;
  }
  .nav_right-leave {
    transform: translateX(0px);
  }
}
</style>
