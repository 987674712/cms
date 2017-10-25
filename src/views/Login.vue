<template>
  <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h3 class="title">系统登录</h3>
    <el-form-item prop="account">
      <el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>

    <el-form-item prop="captcha">
      <el-input class="a1" type="text" v-model="ruleForm2.captcha" auto-complete="off" placeholder="验证码">
        <div slot="append" @click="getCode" style="padding: 0!important;"><img :src="image" alt=""></div>
      </el-input>
    </el-form-item>
    <!--<el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>-->
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2" :loading="logining">登录</el-button>
      <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
    </el-form-item>
  </el-form>
</template>

<script type="text/ecmascript-6">
  import { requestLogin } from '../api/api';
  //import NProgress from 'nprogress'
  export default {
    data() {
      return {
        logining: false,
        ruleForm2: {
          account: '',
          checkPass: '',
          captcha:'',
          sessionId:''
        },
        rules2: {
          account: [
            { required: true, message: '请输入账号', trigger: 'blur' }
            //{ validator: validaePass }
          ],
          checkPass: [
            { required: true, message: '请输入密码', trigger: 'blur' }
            //{ validator: validaePass2 }
          ],
          captcha: [
            { required: true, message: '请输入验证码', trigger: 'blur' }
            //{ validator: validaePass2 }
          ]
        },
        image:''
//        checked: true
      };
    },
    methods: {
      handleReset2() {
        this.$refs.ruleForm2.resetFields();
      },
      handleSubmit2(ev) {
        var _this = this;
        this.$refs.ruleForm2.validate((valid) => {
          if (valid) {
            //_this.$router.replace('/table');
            this.logining = true;
            //NProgress.start();
            var loginParams = { username: this.ruleForm2.account, password: this.ruleForm2.checkPass, captcha:this.ruleForm2.captcha ,sessionId: this.ruleForm2.sessionId};
            sessionStorage.setItem('user', JSON.stringify({
              id: 1,
              username: 'admin',
              password: '123456',
              avatar: 'https://raw.githubusercontent.com/taylorchen709/markdown-images/master/vueadmin/user.png',
              name: '馬先豐'
            }));
            var that = this
            this.$axios({
                      method: 'post',
                      url: 'http://' + location.host + '/cmsapi/v1/'+'login',
                      params: loginParams,
                      headers: {'Content-Type':'multipart/form-data; boundary=----WebKitFormBoundaryrGKCBY7qhFd3TrwA'}
                    })
                    .then(function(response){
                      that.logining = false;
                      var data = response.data
                      if(data.code == 1000){
                        sessionStorage.setItem('token', JSON.stringify(data.data.token));
                        sessionStorage.setItem('refreshToken', JSON.stringify(data.data.refreshToken));
                        sessionStorage.setItem('tokenTime',new Date().getTime())
                        that.$router.push({ path: '/table' });
                      }else {
                        that.logining = false;
                        that.$message({
                          message: data.msg,
                          type: 'error'
                        });
                      }
                    })
                    .catch(function(err){
                      that.logining = false;
                      console.log(err)
                    });
          } else {
            console.log('登陆失败!!!');
            return false;
          }
        });
      },
      getCode:function(){
        var that = this
        this.$get('captcha',{},function(data){
          that.ruleForm2.sessionId = data.data.sessionId
          that.image = data.data.image
        })
      }
    },
    mounted() {
      this.getCode();
    }
  }

</script>

<style lang="scss" scoped>
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
  .a1 img{margin-bottom: -3px;height: 30px}

</style>