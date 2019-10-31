<template>
  <div class="home_nav">
    <div class="navcontent">
      <div class="person">
        <div class="portrait"></div>
      </div>
    </div>
    <div class="login_form">
      <div class="input_box">
        <label for="phone">手机号码：</label>
        <input type="text" name="phone" v-model="phone"/>
      </div>
      <div class="input_box">
        <label for="password">密&nbsp;&nbsp;&nbsp;&nbsp;码：</label>
        <input type="password" name="password" v-model="password"/>
      </div>

      <button class="login" @click="login">登录</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class HomeNav extends Vue {
  phone:string = ''
  password:string=''
  mounted() {
    //this.login()
  }
  login() {
    const that:any = this
    if(this.phone&&this.password){
      this.$https
      .get("/login/cellphone", {
        params: {
          phone: that.phone,
          password: that.password
        }
      })
      .then((res: any) => {
        //console.log('登录成功')
        if (res.data.code === 200) {
          this.$toast('登录成功', 1000)
        } else {
          this.$toast('登录失败', 1000)
        }
      },(err:any)=>{
        this.$toast('登录失败', 1000)
      })
      
      
    }else{
      this.$toast('密码或账号未填')
    }
    
  }
}
</script>

<style lang="less">
.home_nav {
  width: 300px;
  background-color: #fff;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  .login_form {
    width: 90%;
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    margin: 0 auto;
    .input_box {
      height: 40px;
      text-align: left;
      label {
        font-size: 16px;
      }
      input {
        border: 1px solid #000;
        height: 20px;
      }
      #password {
        margin-left: 14px;
      }
    }
  }
  .login {
    height: 32px;
    line-height: 32px;
    font-size: 16px;
    background-color: yellow;
  }
  // transform: translateX(-300px);
}
</style>
