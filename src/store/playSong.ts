import { Commit, Dispatch, GetterTree, ActionTree, MutationTree } from "vuex";
import service from "../Utils/https";

export interface RootState {
  version: string;
}

interface Payload {
  [propName: string]: any;
}
interface detailSongType {
  id?: number;
  index?: number;
  imgUrl?: string;
  mp3Url?: string;
  songName?: string;
  songerName?: string;
  length?: number;
  albumName?: string;
}
interface PlaySongType {
  playSong: any[];
  curSong: any;
  detailSong: detailSongType;
  isShowPlay: boolean;
  playStatus: boolean;
  playProcess: number;
  searchPlay: boolean;
  songDuration:string;
  curTime:number;
  playStyle:number;
  listenFn:boolean;
  volume:number;
}

interface Context {
  commit: Commit;
  dispatch: Dispatch;
}
// 中间的数据存储
const dataSource: PlaySongType = {
  playSong: [], // 正在播放的列表
  curSong: {}, // 当前播放的歌曲大概信息
  detailSong: {
    // 当前播放的歌曲详细信息
    id: 0,
    index: 0,
    imgUrl: "",
    mp3Url: "",
    songName: "",
    songerName: "",
    albumName: "",
    // length: 0
  }, // 当前播放歌曲详细信息
  isShowPlay: false, // 是否展示play页面
  playStatus: false, // 播放状态 是否正在播放，
  playProcess: 0, //已经播放的进度 %
  searchPlay: false,   // 
  songDuration:'00:00',     // 歌曲时长
  curTime:0,          // 播放的时长
  playStyle:1,         // 播放方式 1 == 列表循环  2 == 随机播放 3== 单曲循环
  listenFn:false,     // 是否对播放进度条执行监听函数
  volume:0.3
};

const getters: GetterTree<PlaySongType, RootState> = {
  // 获取将要播放的歌曲列表
  getPlaySong(state: PlaySongType): any {
    return state.playSong;
  },
  // 从播放列表里面获取的歌曲节点
  getCursong(state: PlaySongType): any {
    return state.curSong;
  },
  // 获取当前播放歌曲详细信息
  getDetailSong(state: PlaySongType): any {
    return state.detailSong;
  },
  getIsShowPlay(state: PlaySongType): any {
    return state.isShowPlay;
  },
  getplayStatus(state: PlaySongType): any {
    return state.playStatus;
  },
  getplayProcess(state: PlaySongType): any {
    return state.playProcess;
  },
  getsearchPlay(state: PlaySongType): any {
    return state.searchPlay;
  },
  getsongDuration(state: PlaySongType): any {
    return state.songDuration;
  },
  getcurTime(state: PlaySongType): any {
    return state.curTime;
  },
  getplayStyle(state: PlaySongType): any {
    return state.playStyle;
  },
  getlistenFn(state: PlaySongType): any {
    return state.listenFn;
  },
  getvolume(state: PlaySongType): any {
    return state.volume;
  },
};
interface playidAndindex {
  id: number;
  index: number;
}
const mutations: MutationTree<PlaySongType> = {
  // 添加播放歌曲数组
  ADD_PLAYSONGS: (state: PlaySongType, item: object[]) => {
    state.playSong = item;
  },
  // 给播放数组添加歌曲
  ADD_PLAYSONG: (state: PlaySongType, item: any) => {
    state.playSong.unshift(item)
    console.log(state.playSong)
  },
  ADD_CURSONG: (state: PlaySongType, obj: playidAndindex) => {
    console.log(state.playSong)
    state.curSong = state.playSong[obj.index];
    service
      .get("/song/url", {
        params: {
          id: obj.id
        }
      })
      .then((res: any) => {
        if (res.data.code === 200 && res.data.data) {
          state.detailSong.mp3Url = res.data.data[0].url;
          state.detailSong.id = res.data.data[0].id;
          //state.playSong[obj.index].imgUrl||
          state.detailSong.imgUrl =state.playSong[obj.index].imgUrl //: state.curSong.imgUrl;
          console.log(state.playSong[obj.index].imgUrl)
          //state.playSong[obj.index].songerName ||
          state.detailSong.songerName = state.playSong[obj.index].songerName//:state.curSong.songerName;
          console.log(state.playSong[obj.index].songerName)
          //state.playSong[obj.index].songName||
          state.detailSong.songName =state.playSong[obj.index].songName //: state.curSong.songName;
          console.log(state.playSong[obj.index].songName)
          // state.detailSong.length = state.playSong.length;
          state.detailSong.index = obj.index;
          state.playStatus = true;
          //console.log(state.detailSong)
        } else {
          console.log("请求MP3地址错误");
        }
      });
  },
  ADD_DETAILSONG: (state: PlaySongType, item: object) => {
    //state.detailSong = item
  },
  CISSHOWPLAY: (state: PlaySongType, msg: boolean) => {
    state.isShowPlay = msg;
  },
  CPLSYSTATUS: (state: PlaySongType, msg: boolean) => {
    state.playStatus = msg;
  },
  CPLAYPROCESS: (state: PlaySongType, msg: number) => {
    state.playProcess = msg;
  },
  CSEARCHPLAY: (state: PlaySongType, msg: boolean) => {
    state.searchPlay = msg;
  },
  CSONGDURATION:(state: PlaySongType, msg: string) => {
    state.songDuration = msg;
  },
  CCURTIME:(state: PlaySongType, msg: number) => {
    state.curTime = msg;
  },
  CPLAYStyle:(state: PlaySongType, msg: number) => {
    state.playStyle = msg;
  },
  CLISTENFN:(state: PlaySongType, msg: boolean) => {
    state.listenFn = msg;
  },
  CVOLUME:(state: PlaySongType, msg: number) => {
    state.volume = msg;
  },
};

const actions: ActionTree<PlaySongType, RootState> = {
  add_playsongs: async ({ commit }: Context, item: string) => {
    await Promise.resolve(
      setTimeout(() => {
        commit("ADD_PLAYSONGS", item);
      }, 100)
    );
  },
  add_playsong: async ({ commit }: Context, obj: object) => {
    commit("ADD_PLAYSONG", obj);
  },
  add_curSong: async ({ commit }: Context, obj: object) => {
    commit("ADD_CURSONG", obj);
  },
  add_detailsong: async ({ commit }: Context, item: object) => {
    await Promise.resolve(
      setTimeout(() => {
        commit("ADD_DETAILSONG", item);
      }, 100)
    );
  },
  cIsShowPlay: async ({ commit }: Context, msg: boolean) => {
    commit("CISSHOWPLAY", msg);
  },
  cplsyStatus: async ({ commit }: Context, msg: object) => {
    commit("CPLSYSTATUS", msg);
  },
  // 该函数只能由 footer 组件 的 update 调用
  cplayprocess: async ({ commit }: Context, msg: number) => {
    commit("CPLAYPROCESS", msg);
  },
  csearchplay: async ({ commit }: Context, msg: boolean) => {
    commit("CSEARCHPLAY", msg);
  },
  csongDuration:async ({ commit }: Context, msg: string) => {
    commit("CSONGDURATION", msg);
  },
  // 该 mutation 只能在滑动进度条之后调用，在滑动进度条时，需要注销进度条的监听事件
  changecurtime:async ({ commit }: Context, msg: number) => {
    commit("CCURTIME", msg);
  },
  cplayStyle:async ({ commit }: Context, msg: number) => {
    commit("CPLAYStyle", msg);
  },
  clistenFn:async ({ commit }: Context, msg: boolean) => {
    commit("CLISTENFN", msg);
  },
  c_volume:async ({ commit }: Context, msg: number) => {
    commit("CVOLUME", msg);
  },
};

export default {
  namespaced: true,
  state: dataSource,
  getters,
  mutations,
  actions
};
