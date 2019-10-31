# 网易云移动端实践

- 技术栈：`ts+vue-cli3.0+vuex-class+vue-property-decorator`
- 后端是一位大佬用node写的。<https://binaryify.github.io/NeteaseCloudMusicApi/#/?id=neteasecloudmusicapi>
- 使用方式：点击左边导航栏，进行登录，点击每日推荐模块（只实现了这一个板块，这个板块只能登录才能获取接口数据），里面的歌曲可以播放。

使用方式：先下载后端大佬的项目，启动服务。然后下载本项目，执行yarn，然后执行yarn serve，用浏览器打开localhost:8080即可

## 一. 遇到的问题

### 1.0 vue-cli3.0+ts的基本使用

- 引入vue文件需要加文件后缀名，否则无法正确引用，并且不会报错。
- 项目需要安装vue-class-component插件，了解该插件的用法

### 2.0 组件传值

- 父组件=> 子组件

```js
// 父组件
<Play :myvalue="clickvalue"></Play>
export default class TodayRecommend extends Vue{
    // 这个就是传的初始值
    clickvalue:boolean = false;
	// 传修改之后的值
	changecurView(msg:boolean){
        this.curView = false;
        this.clickvalue =true 
      }
}
```

```js
// 子组件
<div class="Play" v-show="myvalue"></div>
import { Component, Vue, Watch, Prop } from "vue-property-decorator";
Component({})
export default class Play extends Vue{
    @Prop({}) myvalue!:any;
}
```

- 子组件 => 父组件

```js
// 子组件
import { Component, Vue, Watch, Prop, Emit } from "vue-property-decorator";

// 这个参数是在父组件中绑定的
@Emit('binsend2') send(msg:boolean){}
back():void{
    this.send(true);
}
```

```js
// 父组件
<Play :myvalue="clickvalue" @binsend2="changecurview2"></Play>

changecurview2(msg:boolean){
    this.curView = msg;
  }
```

### 3.0 监听vuex数据变动

```js
import {State, Getter, Action} from 'vuex-class'
const fuck = { namespace: 'playSong' }
export default class Footer extends Vue{
    @Getter('getvolume',fuck) getvolume!:boolean;                      // 是否监听 update 函数
	get newvolume(){	// 相当于computed
        return this.getvolume
    }
    @Watch('newvolume',{deep:true})
    change_volume(newVal:number,oldVal:number){
        if(newVal){
            this.audio.volume = newVal
        }
    }
}
```

### 4.0 vuex文件的设置

在src 文件夹中新建一个store，里面分为`index.ts`和`playSong.ts`。

`index.ts`

```js
import Vue from 'vue'
import Vuex from 'vuex'

import playSong from './playSong'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: { playSong }
})
```

`playSong.ts`

```js
import { Commit, Dispatch, GetterTree, ActionTree, MutationTree } from "vuex";
import service from "../Utils/https";

export interface RootState {
  version: string;
}
interface PlaySongType {	// playSong 的state数据类型
  volune:number;
}
const dataSource:playSongType{}		// 初始化state
interface Context {
  commit: Commit;
  dispatch: Dispatch;
}
const getters: GetterTree<PlaySongType, RootState> = {
    getPlaySong(state: PlaySongType): any {
        return state.playSong;
    }
}
const mutations: MutationTree<PlaySongType> = {
    ADD_PLAYSONGS: (state: PlaySongType, item: object[]) => {
        state.playSong = item;
    }
}
const actions: ActionTree<PlaySongType, RootState> = {
    add_playsongs: async ({ commit }: Context, item: string) => {
        await Promise.resolve(
          setTimeout(() => {
            commit("ADD_PLAYSONGS", item);
          }, 100)
        );
    }
}
export default {
  namespaced: true,
  state: dataSource,
  getters,
  mutations,
  actions
};
```

在vue文件中使用，dispatch =>action

- 直接使用：`this.$store.dispatch('playSong/cplayprocess', proNum)`
- 通过vuex-class使用：

```js
import {State, Getter, Action} from 'vuex-class'
const fuck = { namespace: 'playSong' }

@Component({
    components:{
        cicleSvg,
    }
})
export default class Footer extends Vue{
@Getter('getDetailSong', fuck) getDetailSong!:any;                      // 获取当前播放歌曲详细信息
@Action('cIsShowPlay', fuck)private cIsShowPlay!:(val:boolean)=>any;    // 是否展示播放页面

// 通过this.cIsShowPlay()调用action函数
}
```

### 5.0 轮播图的实现

原理:如果要展示5张图片，则要先复制dom,将第一张和最后一张复制，设置定时器进行定时向左移动（设置一个标志位，为true表示可以移动，为false表示不可移动），当鼠标点击该图片，flag=true,取消定时器，判断是否移动，然后进行移动，移动完之后将flag设置为false。开启定时器。

具体代码参考：本项目的`Slider.vue`组件

### 6.0 全局的toast组件

toast.vue代码

```vue
<template>
  <div class="toast" v-if="isShowLoading">
      <span>{{txt}}</span>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop, Emit } from "vue-property-decorator";
@Component({})
export default class Toast extends Vue {
  isShowLoading: boolean = false;    // 是否展示
  txt:string = ''                   // 消息文字
}
</script>
```

再写一个工具函数，将该函数注册到vue的prototype上面去，就可以全局调用了。

`toast.ts`

```tsx
import Vue from "vue";
import ToastComponent from "../components/load/toast.vue";

const ToastConstructor = Vue.extend(ToastComponent);
function showToast (txt:string, duration = 2000) {
  const toastDom = new ToastConstructor({
    el: document.createElement('div'),
    data () {
      return {
        txt,
        isShowLoading: true,
      }
    }
  })

  document.body.appendChild(toastDom.$el)

  setTimeout(() => {
    toastDom.isShowLoading = false
  }, duration)
}

function registerToast () {
  Vue.prototype.$toast = showToast
}
export default registerToast
```

最后`mian.ts`

```ts
import registerToast from './Utils/toast'
Vue.use(registerToast)
// 通过this.$toast('加载中。。。',1500)使用
```

### 7.0 转发请求实现跨域

原理：使用axios拦截器，修改请求源地址，达到跨域的效果。

```ts
import axios from "axios";

// 创建axios实例
let service: any = {};
if(process.env.NODE_ENV === 'development'){
    service = axios.create({
        baseURL:'localhost:3000',
        timeout:1000*60,
        withCredentials:true    // 允许携带cookie
    })
}else{
    service = axios.create({
        baseURL:'localhost:3000',
        timeout:1000*60,
        withCredentials:true    // 允许携带cookie
    })
}
console.log("process.env.BASE_URL", process.env.BASE_URL);
//request拦截器 axios的一些配置
service.interceptors.request.use(
  (config: any) => {
    return config;
  },
  (error: any) => {
    // Do something with request error
    console.error("error:", error); // for debug
    Promise.reject(error);
  }
);

// respone拦截器 axios的一些配置
service.interceptors.response.use(
  (response: any) => {
    return response;
  },
  (error: any) => {
    console.error("error:" + error); // for debug
    return Promise.reject(error);
  }
);

export default service;
```

在main.ts中注册

```js
import service from './Utils/https'   
Vue.prototype.$https = service
```

但是在vue文件中使用会报错，所以在项目根目录下建立一个`shims-axios.d.ts`文件

```js
import Vue from 'vue'
declare module 'vue/types/vue' {  
  interface Vue{
    $https:any,
  }
}
```

## 二. 小结

- 开发之前一定要先确定那些模块需要全局数据的，这些全局数据一定要经过筛选（必要）的数据。

比如：播放列表的功能：点击一个模块，那么播放列表就是切换成那个模块的所有歌曲，但是你不能直接将该接口api的所有数据都保留到vuex的state中。我就只保留：

```js
playSong: {
    id: 0,			// 歌曲id
    imgUrl: "",		// 图片地址
    songName: "",	// 歌曲名字
    songerName: "",	// 歌手名字
    albumName: "",	// 专辑名字
  }
```

其余的杂乱信息不需要保留。播放进度变量，全局都需要使用，所以在state中存储信息。

