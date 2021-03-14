
<template>
<div>
  <div>登陆</div>
   账号： <input type="text" v-model="userinfo.UserName" id=“UserName” name="UserName" > 
   <br>
   密码： <input type="password" v-model="userinfo.PassWord" id=“Login_password” name="Login_password" >
   <br>
   验证码 <input type="text" v-model="userinfo.VerificationCode"  id=“VerificationCode” name="VerificationCode">
   <div v-on:click="getVierificationCode">
     <img :src="imgurl"  alt="">
   </div>
   <br>

   <input type="hidden" v-model="uuid" name="UUID"  id="UUID">
   <input type="hidden" v-model="token" name="tt"  id="tt">
   <input type="button" v-on:click="dologin"  value="登陆">
   <input type="button" v-on:click="chkAuth"  value="验证权限">
</div>
</template>
    <script>

export default {
   data(){
     return {
       imgurl:"",
       uuid:"",
       token:"",
       userinfo:{
         UserName:"kaadmin",
         PassWord:"ka123456",
         VerificationCode:""
       }
     }
   },
   created(){
      this.getVierificationCode();
   },
   methods:{
     getVierificationCode(){
     this.$http.get('/api/vcode')
      .then(response => {
this.imgurl ="data:image/png;base64,"+ response.data.img;
        this.uuid=response.data.uuid
      }
        )
      .catch(function (error) { // 请求失败处理
        console.log(error);
      });
     },

     dologin()
     {
         this.$http.post('/api/Login',{
     UserName:this.userinfo.UserName,
    Login_password:this.userinfo.PassWord,
    VerificationCode :this.userinfo.VerificationCode,
     UUID:this.uuid 
}).then(response=>{
 if(response.data.statu!="1")
 {
   alert(response.data.message);
 }
 else
 {
   this.$com.setToken(response.data.data.token);
   alert(response.data.message);
 }
  
})
     },
    chkAuth()
    {
       this.$http.get('/api/admin')
      .then(response => {
        if(response.data.Statu=="4")
        {
           alert(response.data.Message);
        }
        else{
           alert("恭喜："+response.data);
        }
        
      }
        )
      .catch(function (error) { // 请求失败处理
        console.log(error);
      });
    }


   }
};

</script>