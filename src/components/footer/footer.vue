<template>
    <div class="footer" v-show="isCursong">
        <div class="playImg" @click="goPlay">
            <img :src="getDetailSongFn.imgUrl" :alt="getDetailSongFn.songName">
        </div>
        <div class="textRight" @click="goPlay">
            <span class="songtitle">{{getDetailSongFn.songName}}</span>
            <span class="lyric">{{getDetailSongFn.songerName}}</span>
        </div>
        <div class="playRight">
            <span>
                <div class="rightPlayImg" @click="playMusic">
                    <cicleSvg></cicleSvg>
                    <span :class="isplay?'iconfont icon-zanting':'iconfont icon-icon-bofan'" id="spanDom" ref="spanDom"></span>
                </div>
            </span>
            <span>
                <div class="rightnav">
                    <i class="iconfont icon-daohanglanmoshi02"></i>
                </div>
            </span>
        </div>
        <audio :src="getDetailSongFn.mp3Url" id="myaudio" @canplay="canplay($event)" @ended="endSong"></audio>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Emit } from "vue-property-decorator";
import {State, Getter, Action} from 'vuex-class'
import cicleSvg from './Circle.vue'
const fuck = { namespace: 'playSong' }

@Component({
    components:{
        cicleSvg,
    }
})
export default class Footer extends Vue{
@Getter('getDetailSong', fuck) getDetailSong!:any;                      // 获取当前播放歌曲详细信息
@Action('cIsShowPlay', fuck)private cIsShowPlay!:(val:boolean)=>any;    // 是否展示播放页面
@Getter('getplayStatus',fuck) getplayStatus!:any;                       // 播放状态
@Getter('getplayStyle',fuck) getplayStyle!:any;                         // 播放方式 
@Getter('getcurTime',fuck) getcurTime!:any;                         // 当前播放时间
@Getter('getlistenFn',fuck) getlistenFn!:boolean;                      // 是否监听 update 函数
@Getter('getvolume',fuck) getvolume!:boolean;                      // 是否监听 update 函数

    isCursong:boolean = false;      // 当前页面是否显示 
    detail:any = {};
    spanDom:any = ''
    playStyle:number = 1       // 播放方式
    audio:any = ''                 // audio 元素
    isplay:boolean  = false           // 是否在播放状态

    get listenFn(){
        return this.getlistenFn
    }
    @Watch('listenFn')      // 是否监听进度条
    change_listenFn(newVal:number, oldVal:number){
        if(!newVal){
            this.audio.removeEventListener("timeupdate", this.update, false);
        }else{
            this.audio.removeEventListener("timeupdate", this.update, false);
            this.audio.addEventListener("timeupdate", this.update, false)
        }
    }
    get curTime(){          // 获取当前的时间
        return this.getcurTime
    }
    @Watch('curTime')
    change_curTime(newVal:number, oldVal:number){
        if(newVal){
            this.audio.currentTime = newVal
        }
    }
    get newvolume(){
        return this.getvolume
    }
    @Watch('newvolume',{deep:true})
    change_volume(newVal:number,oldVal:number){
        if(newVal){
            this.audio.volume = newVal
        }
    }
    mounted(){
        this.spanDom = document.getElementById('spanDom')
        this.init()
    }
    // 音乐初始化
    init():void{
        let myaudio:any = document.getElementById('myaudio')
        this.audio = myaudio
        if(myaudio){
            // 随着播放进度，刷新
            myaudio.addEventListener('timeupdate', this.update, false);
            // 音量的初始值
            myaudio.volume = 0.3
            //this.playMusic()
        }
    }
    // 获取总时长 向下取整  向 store 发送时长
    canplay(ev:any):void{
        let duration:number = Math.floor(ev.target.duration) 
        let min:number = 0
        let s:number = 0
        min = Math.floor(duration/60)
        s = duration-60 * min
        let stopTime:string = ''
        if(min<10){
            if(s<10){
               stopTime = '0'+min+':'+'0'+s 
            }else{
                stopTime = '0'+min+':'+s 
            } 
        }else{
            if(s<10){
               stopTime = min+':'+'0'+s 
            }else{
                stopTime = min+':'+s 
            } 
        }
        this.$store.dispatch('playSong/csongDuration', stopTime)
        //console.log(this.stopTime)
        if(this.audio){
            this.audio.play()
        }
    }
    // 歌曲进度更新
    update(){
        let duration =  this.audio.duration;
        if (duration > 0) {
            let proNum = (this.audio.currentTime / duration*100).toFixed(3)
            this.$store.dispatch('playSong/cplayprocess', proNum)
        }
        //this.$store.dispatch('playSong/ccurtime', this.audio.currentTime^0)
        // this.lyTime2 = this.audio.currentTime*1000^0
    }
    //  当前播放歌曲完毕 执行函数
    endSong(){
        let playSongs:any = this.$store.state.playSong.playSong
        this.$store.dispatch('playSong/cplsyStatus', false)
        // this.pointAnimateDom.className='pointer'
        let index:number, id:string;
        console.log('当前播放方式：'+this.getplayStyle)
        // 判断播放方式
        switch (this.getplayStyle) {
            case 1: // 列表循环
                if(parseInt(this.detail.index) >= playSongs.length - 1){
                   index = 0
                }else{
                    index = parseInt(this.detail.index)  + 1
                }
                id = playSongs[index].id
                this.$store.dispatch('playSong/add_curSong', {id, index})
                break;
            case 2: // 随机循环
                index = Math.floor(Math.random() * (playSongs.length + 1))
                id = playSongs[index].id
                this.$store.dispatch('playSong/add_curSong', {id, index})
                break;
            case 3: // 单曲循环
                id = this.detail.id
                index = this.detail.index 
                console.log({id, index})
                this.$store.dispatch('playSong/add_curSong', {id, index})
                break;
            default:
                break;
        }
    }
    // 播放音乐
    playMusic(e:any){
        //console.log(e.target)
        if(this.isplay){
            this.$store.dispatch('playSong/cplsyStatus', false)
        }else{
            this.$store.dispatch('playSong/cplsyStatus', true)
        }
    }
    // 验证音乐url是否可用
    checkUrl(id:string){
        this.$https.get('/check/music',{
            params:{
                id:id
            }
        }).then((res:any)=>{
            if(res.data.success){
                return
            }else{
                this.$toast('此音乐地址无效')
                this.$store.dispatch('playSong/cplsyStatus', false)
            }
        })

    }
    goPlay(){   // 跳转到歌曲播放页面
        this.$router.push('/playSong')
    }
    // 监测 store 中的 歌曲详细信息是否改变
    get getDetailSongFn(){
        return this.getDetailSong
    }
    @Watch('getDetailSongFn',{deep:true})
    change_Detail(newVal:any, oldVal:any){
        if(newVal){
            this.isCursong = true
            this.detail = newVal
        }else{
            this.isCursong = false
        }
    }
    get playstatus(){
        return this.getplayStatus
    }
    @Watch('playstatus',{deep:true})
    getplayStatusFn(newVal: any, oldVal: any){
        this.isplay = newVal
        if(this.isplay){
            this.audio.play()
        }else{
            this.audio.pause()
        }
    }
    
    beforeDestroy(){
        window.removeEventListener('click', this.goPlay)
    }
}
</script>

<style lang="less" scoped>
.footer{
    width: 100%;
    height: 50px;
    position: fixed;
    z-index: 100;
    bottom: 0;
    left: 0;
    background-color: #fff;
    display: flex;
    align-items: center;
    border-top: 1px solid #ccc;
    .playImg{
        width: 40px;
        height: 40px;
        padding-left: 10px;
        img{
            width: 100%;
            height: 100%;
            border-radius: 50%;
        }
    }
    .textRight{
        width: 60%;
        height: 40px;
        padding-left: 15px;
        span{
            display: block;
            width: 100%;
            text-align: left;
        }
        .songtitle{
            height: 25px;
            line-height: 25px;
            font-size: 16px;
        }
        .lyric{
            height: 14px;
            line-height: 14px;
            font-size: 14px;
        }
    }
    .playRight{
        align-self:flex-end; 
        width: 90px;
        display: flex;
        justify-content: space-between;
        height: 50px;
        align-items: center;
        span{
            width: 40px;
            height: 40px;
            display: inline-block;
            .rightPlayImg{
                height: 40px;
                overflow: hidden;
                span{
                    position: relative;
                    top: -37px;
                    left: 0px;
                    font-size: 24px;
                }
            }
            .rightnav{
                padding-top:5px;
                i{
                    color: #000;
                    font-size: 32px;
                }
            }
        }
    }
    
}
</style>