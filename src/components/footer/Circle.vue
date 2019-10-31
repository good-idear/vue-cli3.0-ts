<template>
  <div class="cicleSvg">
    <svg height="40" width="40">
      <circle
        cx="20"
        cy="20"
        r="17"
        fill="none"
        stroke="grey"
        stroke-width="3"
        stroke-linecap="round"
      />
      <circle
        class="demo2"
        id="J_demo2"
        cx="20"
        cy="20"
        r="17"
        fill="none"
        stroke="red"
        stroke-width="3"
        stroke-dasharray="0 10000"
      />
    </svg>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

@Component({})
export default class cicleSvg extends Vue {
    demo2:any = ''
    circleLength:number = 0;
    mounted(){
        this.demo2 =  document.querySelector("#J_demo2");
        this.init()
    }
    init(){
        // 圆周长
        let circleLength = Math.floor(2 * Math.PI * this.demo2.getAttribute("r"));
        this.circleLength = circleLength
    }
    get process(){
        return this.$store.state.playSong.playProcess
    }
    @Watch('process')
    changeCircle(newVal: number, oldVal: number){
        let val:number = newVal
        this.demo2.setAttribute("stroke-dasharray","" + this.circleLength * val / 100 + ",10000");
    }
}
</script>
<style scoped lang='less'>

.demo2 {
    transform-origin: 20px 20px;
    transform: rotate(-90deg);
}

</style>