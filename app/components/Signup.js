import React, { Component } from 'react';
import Select from 'react-select';
import {  Redirect} from 'react-router-dom';
import Header from './Header';
//import '../vendor/bootstrap_37/css/bootstrap.css';
//import '../vendor/bootstrap_37/js/bootstrap.js';


//import '../vendor/bootstrap/css/bootstrap.css';
//import '../vendor/bootstrap/js/bootstrap.js';

//import logo from './logo.svg';
//import '../css/font-awesome-4.7.0/css/font-awesome.min.css';
//import Customers from './Customers'
//import '../vendor/bootstrap_37/css/bootstrap.css';
//import 'bootstrap'; //const bootstrap = require('bootstrap');

const strings= {
    s1: '앗 아직 Heyletz 회원이 아니세요. 회원가입을 먼저 해주세요',
    s2: '소개해주신 분의 이메일을 확인하기 위해서는 이메일을 먼저 입력해주세요',
    s3: '입력하신 이메일을 가진 회원이 존재합니다.',
    s4: '입력하신 이메일을 가진 회원이 존재하지 않습니다.',
    s5: '반드시 본인의 성별을 선택하여 주세요',
    s6: '회원가입을 환영합니다! ',
    s7: '이미 회원가입이 되어있습니다'
}; 

class App extends Component {
  constructor(props) {
    super(props);
    console.log('constructor',props,this.props);
    this.state = {
      value: '',
      redirec:false,
      isLoaded: true
    };
    this.initAgeSelect();
    this.handleChange = this.handleChange.bind(this);
    this.handleAgeChange = this.handleAgeChange.bind(this);
    this.checkLoginState = this.checkLoginState.bind(this);
  }

  componentDidMount(){
    // console.log('componentDidMount');
/*
    this.setState({
      isLoaded:true
   });*/
   this.initFB();
   this.initKakao();
  }

  initKakao(){
    Kakao.init('71cdcc100c74d63a58378236762320d9');
    Kakao.Auth.createLoginButton({
      container: '#custom-login-btn',
      size: 'small',
      success:  (authObj) => {
          console.log('createLoginButton success');
          Kakao.API.request({
            url: '/v1/user/me',
            success: (res) => {
              console.log(JSON.stringify(res),res.properties.nickname,res.kaccount_email);

              var valid = this.validate();
              if(!valid) return;

              var response={
                name : res.properties.nickname,
                email: res.kaccount_email,
                id: res.id
              }
              this.redirect(response);
            },
            fail: function(error) {
            //  alert(JSON.stringify(error));
            }
          });
      },
      fail: ()=>{
        console.log('createLoginButton fail');
      }
    });
  }
  initFB(){
    var current_url= window.location.host;
    var appID;
    var local = false;

    if(current_url.includes("localhost")) {
       console.log('local',current_url,window.location.protocol);
       appID='257794311410730';
       local=true;
    }else if(current_url.includes("quiet-chamber")){
       console.log('staging',current_url,window.location.protocol);
       appID='258268861349318';
    }else{
       console.log('production',current_url,window.location.protocol);
       appID='1931460180439762';
    }

    window.fbAsyncInit = function() {
        FB.init({
            appId      : appID,
            xfbml      : true,
            version    : 'v2.11'
        });
        FB.AppEvents.logPageView();
    };
    (function(d, s, id){
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }

  initAgeSelect(){
    var max = 2003;
    var min = max-20;
    //var select = document.getElementById('admission');
    //var select = document.getElementById('age');
    this.ages = [];
    for (var i = min; i<=max; i++){
      this.ages.push({
        label: i,
        value: i
      });
    }
    this.setState({
      age: min
   });
   console.log('initAgeSelect',this.state.age);
    //select.value = 2018;//new Date().getFullYear();
  }

  myAlert(msg,data){
      $('#modal_text').text(msg);
      $('#myModal').modal('show');
      console.log('myAlert',data,$('#myModal')[0]);

      if(data){
        $("#myModal").on("hide.bs.modal", function () {
           window.location = data.redirect;
        });
      }
  }

  validate(){
      var male=$('#male_radio').is(':checked');
      var female=$('#female_radio').is(':checked');
      console.log('validate',male,female);

      if(!male&&!female){
          this.myAlert(strings.s5);
          return false;
      }
      return true;
  }

   checkLoginState() {
      var valid = this.validate();
      if(!valid) return;

      console.log('checkLoginState',this);
      FB.login((response) =>{
          //this.statusChangeCallback(response);
          if(response.status!=='connected')
              return;

          console.log('statusChangeCallback',JSON.stringify(response));
          var url = '/me?fields=id,name,email';
          FB.api(url, (response) => {
              this.redirect(response);
           }, {scope: 'email'});
      }, {scope: 'email'});
   }
/*
   statusChangeCallback(response){

  }*/

  redirect(response) {
      console.log('redirect',this.props,response,window.history);
    //  this.props.history.push("/begin");
      this.setState({
        redirect: true,
        response: response
     })
  }

  redirect2(response){
      var   male = $('#male_radio').is(':checked'),
            female = $('#female_radio').is(':checked'),
            age = $('#age :selected').val(),
            contact = $('#contact').val(),
            promoCode = $('#promoCode').val(),
            name=response.name,
            email=response.email,
            sid=response.id,
            gender = male ? 0 : 1;

      console.log('sign up button clicked',name,email,sid,contact);//JSON.stringify(response));
      //return;
      $.post( "/user/create", {
          sid: sid,
          gender :gender,
          name:name,
          age:age,
          promoCode : promoCode,
          email:email,
          contact:contact
      },(data, status)=>{
        if(data.found==false){
              //alert("Data: " + data + "\nStatus: " + status);
            this.myAlert(strings.s6+name+'님',data);
        }else {
            this.myAlert(strings.s7,data);
        }
      });
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  //  console.log('handleChange',event.target.value,this.state.value);
  }

  handleAgeChange(event){
  //  console.log('handleAgeChange')
     this.setState({age: event.value});
  }

  renderRedirect() {
    if (this.state.redirect) {
      const { response ,age} = this.state;

      var   male = $('#male_radio').is(':checked'),
            female = $('#female_radio').is(':checked'),
          //  age = $('#age :selected').val(),
            contact = $('#contact').val(),
          //  promoCode = $('#promoCode').val(),
            name=response.name,
            email=response.email,
            sid=response.id,
            gender = male ? 0 : 1;
          console.log('renderRedirect',age,gender);
      return (
          <Redirect to={{
            pathname: '/begin' ,
            state :{
              sid: sid,
              gender :gender,
              name:name,
              age:age,
          //    promoCode : promoCode,
              email:email,
              contact:contact,
              signUp:true
            }
          }}
         />
      );
    }
  }

  render() {
  //  console.log("Host URL"+process.env.PUBLIC_URL);
    //  <img src={logo} className="App-logo" alt="logo" />
    //<!--<Route exact path='/customerlist' component={Customers} />-->
    const { isLoaded} = this.state;
    if(!isLoaded)
      return <div></div>;

    return (
      <div>
      <Header/>
      <small>
      <div class="container bump-me">
        <div class="body-content">
          <div class="row">
             {this.renderRedirect()}
              <div class="col-md-8 col-offset-1">
                  <div class="card">
                      <div class="card-header"> 아래 사항들을 입력해 주시고 아래에 'Start With Facebook' 이나 '로그인(카카오)'버튼을 눌러주세요</div>
                      <div class="card-body">
                        <div class="form-horizontal">
                          <div class="form-group form-group-sm">
                            <label for="" class="col-md-2 control-label">성별</label>
                            <div class="col-md-5 ">
                                <label class="radio-inline">
                                  <input type="radio" name="gender" id="male_radio" value="male"/> 남
                                </label>
                                <label class="radio-inline">
                                  <input type="radio" name="gender" id="female_radio" value="female"/> 녀
                                </label>
                            </div>
                          </div>
                          <div class="form-group form-group-sm">
                            <label for="" class="col-md-2 control-label">생년</label>
                             <div class="col-md-2">
                                   <Select class="form-control" options={this.ages} onChange={this.handleAgeChange} id="age"/>
                             </div>
                          </div>
                          <div class="form-group form-group-sm">
                            <label for="" class="col-md-2 control-label">카톡 아이디</label>
                             <div class="col-md-5">
                               <input class="form-control input-sm" onChange={this.handleChange} type="text" id="contact"  data-toggle="tooltip" data-placement="bottom" title="영상통화를 마치고 서로가 마음에 들 경우 상대방에게 전해질 본인의 카톡아이디를 적어주세요" />
                             </div>
                          </div>
                        {/*}
                         <div class="form-group form-group-sm">
                           <label for="" class="col-md-2 control-label">Promo Code</label>
                            <div class="col-md-5">
                              <div class="input-group">
                                <input type="text" class="form-control"  id="promoCode" placeholder="" aria-label="Search for..." data-toggle="tooltip" data-placement="bottom" title="프로모션 코드를 입력해 주시면 무료이용 포인트를 추가해 드려요"/>
                              </div>
                            </div>
                          </div>*/}
                       </div>
                      <hr/>
                        <center>
                         <div>
                           <button class="btn btn-primary btn-lg btn-social btn-facebook" scope="public_profile,email" onClick={this.checkLoginState}>
                                <span class="fa fa-facebook"></span> Start With Facebook
                           </button>
                           <div class="modal fade" id="myModal" role="dialog">
                             <div class="modal-dialog">
                               <div class="modal-content">
                                 <div class="modal-header">
                                   <button type="button" class="close" data-dismiss="modal">&times;</button>
                                   <h4 class="modal-title">Heyletz!</h4>
                                 </div>
                                 <div class="modal-body">
                                   <div id="modal_text"></div>
                                 </div>
                                 <div class="modal-footer">
                                   <button type="button" class="btn btn-default" data-dismiss="modal">닫기</button>
                                 </div>
                               </div>
                             </div>
                           </div>
                         </div>
                         <hr class="divider"/>
                         <a id="custom-login-btn" href="javascript:loginWithKakao()"></a>
                     </center>
                   </div>
                   <div class="card-footer"></div>
                </div>
             </div>

          </div>
              </div>
                  </div>
                  </small>
                  </div>
    );
  }
}

export default App;
