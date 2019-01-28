import React, { Component } from 'react';
import Select from 'react-select';
import FacebookLogin from 'react-facebook-login';
import {  Redirect} from 'react-router-dom';

class App extends Component {
  constructor(props) {
    super(props);
    const { state } = props.location;
    console.log('constructor',props,props.location.state);

  //  this.checkLoginState = this.checkLoginState.bind(this);
    this.loginWithKakao = this.loginWithKakao.bind(this);

    this.state = {
      redirect : false,
      FBAppId : ''
      }
  }

  componentDidMount(){
    this.initFB();
    this.initKakao();
    $('[data-toggle="tooltip"]').tooltip();
  }

  initFB(){
    var current_url= window.location.host;
    var appID;
    if(current_url.includes("localhost")) {
       console.log('local',current_url,window.location.protocol);
       appID='257794311410730';
    }else if(current_url.includes("quiet-chamber")){
       console.log('staging',current_url,window.location.protocol);
       appID='258268861349318';
    }else{
       console.log('production',current_url,window.location.protocol);
       appID='1931460180439762';
    }
    this.setState({
      FBAppId: appID
   });
/*
    window.fbAsyncInit = function() {
        FB.init({
            appId      : appID,
            xfbml      : true,
            version    : 'v2.11'
        });
        FB.AppEvents.logPageView();

        var finished_rendering = function() {
          console.log("finished rendering plugins");
          var spinner = document.getElementById("spinner");
          spinner.removeAttribute("style");
          spinner.removeChild(spinner.childNodes[0]);
        }
        FB.Event.subscribe('xfbml.render', finished_rendering);

    };
    (function(d, s, id){
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
*/
  }

  initKakao(){
    Kakao.init('71cdcc100c74d63a58378236762320d9');
        // 카카오 로그인 버튼을 생성합니다.

  }

  loginWithKakao() {
      console.log('loginWithKakao');
      //const self=this;
      Kakao.Auth.login({
          success: (authObj) =>{
                //console.log(JSON.stringify(authObj));
              console.log('Kakao.Auth.login');
              Kakao.API.request({
                url: '/v1/user/me',
                success: (res) => {
                  console.log('Kakao.API.request',res.kaccount_email);
                  //window.location.href = '/user/'+res.id;

                  //var valid = this.validate();
                //  if(!valid) return;

                  var response={
                    name : res.properties.nickname,
                    email: res.kaccount_email,
                    id: res.id
                  }
                  this.redirect(response);
                },
                fail: function(error) {
                  alert(JSON.stringify(error));
                }
              });
            },
          fail: function(err) {
            //  alert(JSON.stringify(err));
            }
      });
    };
/*
  checkLoginState() {
      console.log('checkLoginState');
      FB.getLoginStatus((response) => {
          this.statusChangeCallback(response);
      });
  }

  statusChangeCallback(response){
      console.log('statusChangeCallback');
      if(response.status==='connected'){
          console.log('statusChangeCallback');
        //  console.log(JSON.stringify(response),response.authResponse.userID);
          var url = '/me?fields=id,name,email';
          FB.api(url, (response)=>{
              console.log(JSON.stringify(response));
                // window.location.href = '/user/'+response.id;  //need to switch to body parser
                 this.redirect(response);
          }, {scope: 'email'});
      }
  }
  */

  redirect(response) {
      console.log('redirect',this.props,response,window.history);
    //  this.props.history.push("/begin");
      this.setState({
        redirect: true,
        response: response
     })
  }

  renderRedirect() {
    if (this.state.redirect) {
      const { response } = this.state;

      const name=response.name,
            email=response.email,
            sid=response.id;
          //  gender = male ? 0 : 1;
      console.log('renderRedirect');
      return (
          <Redirect to={{
            pathname: '/begin' ,
            state :{
              sid: sid,
            //  gender :gender,
              name:name,
            //  age:age,
          //    promoCode : promoCode,
              email:email,
              signUp:false
          //    contact:contact
            }
          }}
         />
      );
    }
  }

  showFB(FBAppId){
   if(FBAppId ===''){
      console.log('render',FBAppId);
      return <div></div>;
    }

    const responseFacebook = (res) => {
       console.log('responseFacebook',res);
       var response={
         name : res.name,
         email: res.email,
         id: res.id
       }
       this.redirect(response);
   }

    return (

      <FacebookLogin
         appId={FBAppId}
        // size="small"
         textButton=" Log In"
         icon = "fa-facebook"
       //  autoLoad={true}
         fields="public_profile,email" //fields="name,email",
         cssClass="my-facebook-button-class"
         //onClick={componentClicked}
         // scope="public_profile,user_friends,user_actions.books"
         callback={responseFacebook} />
     );
  }

  render(){
    const {FBAppId} = this.state;

    return (
     <div>
      {this.renderRedirect()}
      <nav class="navbar navbar-expand-lg navbar-light fixed-top" id="mainNav">
        <div class="container">
          <a class="navbar-brand js-scroll-trigger" href="#page-top">HeyLetz</a>
          <span style={{
            color:'beige',
            whiteSpace: 'nowrap',
            fontSize:7+'pt',
            fontFamily: 'Lato,Helvetica,Arial,sans-serif',
             textTransform: 'uppercase'}} >
             집에서 하는 대학생 소개팅</span>
          <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
            Menu
            <i class="fa fa-bars"></i>
          </button>
          <div class="collapse navbar-collapse" id="navbarResponsive">
            <ul class="navbar-nav ml-auto">
              <li class="nav-item">
                <a class="nav-link js-scroll-trigger" href="#download">사용법</a>
              </li>
              <li class="nav-item">
                <a class="nav-link js-scroll-trigger" href="#features">특징</a>
              </li>
              <li class="nav-item">
                <a class="nav-link js-scroll-trigger" href="#FAQ">FAQ</a>
              </li>
              <li class="nav-item">
                <a class="nav-link js-scroll-trigger" href="/arrange">주선
                <span class="badge badge-warning">Beta</span></a>
              </li>
              <li class="nav-item dropdown" style={{background: 'transparent'}} >

                    <a class="nav-link" style={{borderStyle:'none',
                       cursor: 'pointer'}}  id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      로그인
                    </a>
                    <div class="dropdown-menu" style={{backgroundColor: 'transparent', borderSyle:'none'}}  aria-labelledby="dropdownMenu2">
                      <a class="dropdown-item" onmouseover="this.style.background='transparent';"id="custom-login-btn" onClick={this.loginWithKakao} >
                        <img src="img/kakao_login_btn_small.png" width="60" height="23"/>
                      </a>
                      {/*<div id="spinner"
                       style={{
                          color:'white !important',
                          fontSize: 13+'px',
                          background: 'transparent',
                          borderRadius: 5+'px',
                          color: 'white',
                          height: 20+'px',
                          textAlign: 'center',
                          width: 50+'px'}}>
                          로딩중
                       <div class="fb-login-button dropdown-item"
                        onmouseover="this.style.background='transparent';"
                        data-max-rows="1"
                        data-size="small"
                        data-button-type="login_with"
                        scope="public_profile,email"
                        onlogin="checkLoginState();"
                      ></div>*/}
                      <div class="dropdown-item"
                          onmouseover="this.style.background='transparent';">
                        {this.showFB(FBAppId)}
                      </div>
                   </div>
             </li>
          </ul>
         </div>
        </div>
      </nav>

      <header class="masthead">
        <div class="container h-100">
          <div class="row h-100">
            <div class="col-lg-7 my-auto">
              <div class="header-content mx-auto">
                <h1 class="mb-5"> 소개팅 나가자마자 주선자가 원망스러웠던 적은?</h1> <h3> 소개팅, 아직도 나가서 해요?</h3>
                <a href="/signup" class="btn btn-outline btn-xl js-scroll-trigger">Start Now for Free!</a>
              </div>
            </div>
            <div class="col-lg-5 my-auto">
              <div class="device-container">
                <div class="device-mockup macbook_2015 portrait silver">
                  <div class="device">
                    <div class="screen">
                      <img src="img/Woman-Relaxing-On-Bed.jpg" class="img-fluid" alt=""/>
                    </div>
                    <div class="button">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section class="download text-center" id="download">
        <div class="container border border-warning  rounded" style={{padding:5+'%'}}>
            <div class="section-heading text-center">
              <h2>어떻게 사용하죠<i class="fa fa-question" aria-hidden="true"></i></h2>
            <hr/><br/>
            </div>

          <div class="row">
            <div class="col-md-8 mx-auto" >
              <div class="list-group" >

                <a class="list-group-item_ text-left_" style={{backgroundColor:'transparent' ,borderStyle: 'none'}} >
                  <span class="badge badge-light"><i class="fa fa-play-circle" aria-hidden="true"></i></span> 회원가입후 프로필 작성 및 본인 학교 인증</a>
      <i class="fa fa-angle-down"></i>

                 <a class="list-group-item_ text-left_" style={{backgroundColor:'transparent' ,borderStyle: 'none'}} >
                   <span class="badge badge-light"><i class="fa fa-play-circle" aria-hidden="true"></i></span> 매일 밤 9시 로그인후 본인의 지역을 선택</a>
      <i class="fa fa-angle-down"></i>
                 <a class="list-group-item_ text-left_" style={{backgroundColor:'transparent' ,borderStyle: 'none'}}>
                   <span class="badge badge-light"><i class="fa fa-television" aria-hidden="true"></i></span> 알고리즘이 찾아준 인연의 프로필 확인
                 </a><i class="fa fa-angle-down"></i>
                <a class="list-group-item_ text-left_" style={{backgroundColor:'transparent' ,borderStyle: 'none'}}>
                  <span class="badge badge-light"><i class="fa fa-television" aria-hidden="true"></i></span> 서로의 프로필이 마음에 들 경우 음성통화
                (3분) 시작</a><i class="fa fa-angle-down"></i>

                 <a  class="list-group-item_ text-left_" style={{backgroundColor:'transparent' ,borderStyle: 'none'}}>
                   <span class="badge badge-light"><i class="fa fa-television" aria-hidden="true"></i></span> 음성통화 후 서로가 마음에 들 경우 영상통화
      (6분) 시작</a><i class="fa fa-angle-down"></i>

                 <a   class="list-group-item_ text-left_" style={{backgroundColor:'transparent' ,borderStyle: 'none'}}>
                   <span class="badge badge-light"><i class="fa fa-envelope-o" aria-hidden="true"></i></span>  영상통화 후에 서로가 마음에 드는 경우 서로의 연락처 자동 교환</a>
               </div>

            </div>
          </div>

        </div>
      </section>

      <section class="features " id="features">
        <div class="container border border-warning rounded" style={{padding:5+'%'}}>
          <div style={{marginBottom:0+'px'}} class="section-heading text-center">
            <h2>내가 선택하는 나의 인연</h2>
            <p class="text-muted">인터넷 되는 어디서나 3~9분 간의 무료 음성/영상 통화</p>
            <hr/>
          </div>
          <div class="row">
            <div class="col-lg-4 my-auto">
              <div class="device-container">
                <div class="device-mockup macbook_2015 portrait gold">
                  <div class="device">
                    <div class="screen">
                      <img src="img/man-laptop.jpg" class="img-fluid" alt=""/>
                    </div>
                    <div class="button">
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-8 my-auto">
              <div class="container-fluid">
                <div class="row">
                  <div class="col-lg-6">
                    <div class="feature-item border border-secondary rounded" style={{padding:5+'%', margin:5+'%'}}>
                      <i class="fa fa-clock-o text-primary"></i>
                      <h3>시간 낭비는 최소화</h3>
                      <p class="text-muted">부담스럽지 않은 첫 3분의 음성 통화와 6분 간의 영상 통화</p>
                    </div>
                  </div>
                  <div class="col-lg-6">
                    <div class="feature-item border border-secondary rounded" style={{padding:5+'%', margin:5+'%'}}>
                      <i class="fa fa-laptop text-primary"></i>
                      <h3>초간단 영상통화 </h3>
                      <p class="text-muted">프로그램 설치없이 웹브라우저에서 바로 음성 및 영상통화</p>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-6">
                    <div class="feature-item border border-secondary rounded" style={{padding:5+'%', margin:5+'%'}}>
                      <i class="fa fa-coffee text-primary"></i>
                      <h3>울렁증 없는 소개팅</h3>
                      <p class="text-muted">처음 보는 사람과 밥이 코로 넘어가는지 입으로 넘어가는지 모르는 부담스러운 시추에이션은 그만!</p>
                    </div>
                  </div>
                  <div class="col-lg-6">
                    <div class="feature-item border border-secondary rounded" style={{padding:5+'%', margin:5+'%'}}>
                      <i class="fa fa-shield" text-primary></i>

                      <h3>소중한 나의 연락처는 마지막에</h3>
                      <p class="text-muted">충분한 대화를 통해 서로가 마음에 들 경우에만 연락처 공개</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="cta">
        <div class="cta-content">
          <div class="container">
            <h3 style={{color:'white'}}>맞아 이 사람이야 싶을 때...<br/>그때 만나보세요</h3>
            <a href="/signup" class="btn btn-outline btn-xl js-scroll-trigger">Lets Get Started!</a>
          </div>
        </div>
        <div class="overlay"></div>
      </section>

      <section class="contact" id="FAQ">
        <div class="container border border-warning rounded" style={{padding:5+'%'}}>
          <div class="section-heading text-center">
            <h2>자주 묻는 질문</h2><hr/>
          </div>
          <div class="panel-group text-left" id="accordion">
            <div class="panel panel-default">
              <div class="panel-heading ">
                <h4 class="panel-title ">
                  <a style={{color:'brown'}} data-toggle="collapse" data-parent="#accordion" href="#collapse1">
                    헤일렛즈를 이용하려면 어떤 프로그램이나 장비가 필요한가요?</a>
                </h4>
              </div>
              <div id="collapse1" class="panel-collapse collapse in">
                <div class="panel-body text-danger" > 웹 브라우저만으로(현재 크롬/파이어폭스/사파리 지원) 이용이 가능하고 Active X를 포함하여 추가적인 소프트웨어의 설치가 전혀 필요 없어요. 컴퓨터에 웹캠이 설치되어있지 않다면 웹캠은 필요하구요.</div><br/>
              </div>
            </div>
            <div class="panel panel-default">
              <div class="panel-heading">
                <h4 class="panel-title ">
                  <a style={{color:'brown'}} data-toggle="collapse" data-parent="#accordion" href="#collapse2">무료인가요?</a>
                </h4>
              </div>
              <div id="collapse2" class="panel-collapse collapse">
                <div class="panel-body text-danger">네 처음부터 끝까지 100%무료이고 어떠한 숨겨진 요금도 없어요.</div><br/>
              </div>
            </div>

            <div class="panel panel-default">
              <div class="panel-heading">
                <h4 class="panel-title ">
                  <a style={{color:'brown'}} data-toggle="collapse" data-parent="#accordion" href="#collapse4">웹캠이 없는데 스마트폰으로도 사용가능한가요?</a>
                </h4>
              </div>
              <div id="collapse4" class="panel-collapse collapse">
                <div class="panel-body text-danger">네 가능합니다. 안드로이드 폰을 사용하실 경우, 최신 버전의 크롬/파이어폭스를, 아이폰인 경우 사파리 브라우저를 사용해 주세요</div><br/>
              </div>
            </div>
            <div class="panel panel-default">
              <div class="panel-heading">
                <h4 class="panel-title ">
                  <a style={{color:'brown'}} data-toggle="collapse" data-parent="#accordion" href="#collapse5">지난번에 연결된 분과 다시 연결될 수도 있나요?</a>
                </h4>
              </div>
              <div id="collapse5" class="panel-collapse collapse">
                <div class="panel-body text-danger">아니요 서로 연결된 적 없는 분끼리만 연결이 되어요</div><br/>
              </div>
            </div>

            <div class="panel panel-default">
              <div class="panel-heading">
                <h4 class="panel-title ">
                  <a style={{color:'brown'}} data-toggle="collapse" data-parent="#accordion" href="#collapse6">아무하고도 연결이 안될 수도 있나요?</a>
                </h4>
              </div>
              <div id="collapse6" class="panel-collapse collapse">
                <div class="panel-body text-danger">네 성비가 맞지 않거나 알고리즘이 입력하신 프로필에 최적의 상대를 찾지 못할 경우에는 연결이 되지 않을 수도 있어요</div><br/>
              </div>
            </div>
      </div>
      </div>

      </section>

      <footer>
        <div class="container">
          <p>&copy; 2018 HeyLetz. All Rights Reserved.</p>
          <ul class="list-inline">
            <li class="list-inline-item">
              <a href="#">Privacy</a>
            </li>
            <li class="list-inline-item">
              <a href="#">Terms</a>
            </li>
            <li class="list-inline-item">
               <a target="_blank" href="https://open.kakao.com/o/sUg85Hm"><img style={{padding:'0'}} width="11" height="11" src="img/kakao.png"/> 1:1오픈채팅상담</a>
            </li>
          </ul>
        </div>
      </footer>
      </div>

      )
    }
}

export default App;
