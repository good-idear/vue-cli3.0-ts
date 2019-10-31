<template>
  <div class="Find">
    <Slider></Slider>
    <ContentType></ContentType>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Slider from '../components/Find-Slider/Slider.vue'
import ContentType from '../components/Find-Slider/Contenttype.vue'

@Component({
    components:{
        Slider,
        ContentType
    }
})
export default class Find extends Vue {
  created(){
  }
  // 登录账户
  loginUser():void{
    this.$https.get('/login/cellphone',{
      params:{
        phone:'17346628967',
        password:'17346628967'
      }
    })
      .then((res:any)=>{
        //console.log(res)
        // if(res.status === 200&& res.data.code===200){
        //   console.log(res.data.data)
        // }else{
        //   console.log('请求出错')
        // }
      })
  }
}
</script>

<style lang="less" scoped>
.Find {
  width: 94%;
  margin: 0 auto;
  height: auto;
}
</style>