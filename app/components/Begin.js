import React, { Component } from 'react';
import Select from 'react-select';
import {  Redirect} from 'react-router-dom';
import Header from './Header';
//import '../vendor/bootstrap_37/css/bootstrap.css';
//import '../vendor/bootstrap_37/js/bootstrap.js';
//import '../css/app.css';

const strings= [
     '앗 아직 Heyletz 회원이 아니세요. 회원가입을 먼저 해주세요',
     '소개해주신 분의 이메일을 확인하기 위해서는 이메일을 먼저 입력해주세요',
     '입력하신 이메일을 가진 회원이 존재합니다.',
     '입력하신 이메일을 가진 회원이 존재하지 않습니다.',
     '반드시 본인의 성별을 선택하여 주세요',
     '회원가입을 환영합니다! ',
     '이미 회원가입이 되어있습니다',

     '이용 가능한 시간은 한국시간 9PM이나 미국 동부시간 11PM부터 10분간 입니다',
     '새로 저장하실 이메일을 입력해주세요',
     '새로 입력하신 이메일이 이미 저장되어 있는 이메일과 같습니다',
     '이메일이 변경되었습니다!',
     'Please allow access to the Camera and Microphone and try publishing again.',
     'Error while setting RemoteDescription InvalidStateError',
     'Your browser failed to get access to your microphone. You may need to fully quit and restart your browser to get it to work',
     '카메라가 이미 다른 디바이스에 의해 이용중입니다. 카메라 설정을 확인해 주세요.',
     '디바이스의 상태를 다시 확인해주세요',
     '이미 다른 창에서 서비스를 이용중이세요',
     '브라우저 설정에서 카메라와 마이크의 액세스를 허용해 주세요.',
     '카메라 사용을 허용해 주셔야 영상통화가 가능합니다',
     '카메라/마이크 사용을 허용해 주셔야 영상통화가 가능합니다',
     '최대한 근처의 상대를 찾기 위해 본인의 위치를 입력해 주시기 바랍니다',
     '변경된 프로필이 저장되었습니다',
     '학교 인증을 위해 본인의 학생증 사진이나 학교 이메일을 입력해 주세요',//22
     '본인이 재학 중인 학교를 선택해 주세요', //23
     '인증이 완료되면 이메일로 알려드릴게요',
     '학교 인증을 먼저 완료해 주시기 바랍니다'
]; 

class App extends Component {
  constructor(props) {
    super(props);
    const { state } = props.location;
    console.log('constructor',props,props.location.state);
    this.state = {
      isLoaded: false,
      response: state.response,
      colleges: [],
      major:[],
      college: '학교명',
      redirect:false,
      data : {
        sid: state.sid,
        gender :state.gender,
        name:state.name,
        age:state.age,
      //  promoCode : state.promoCode,
        email:state.email,
        contact:state.contact,
        test: false
      }

    };
  //  this.initAgeSelect();
  //  this.handleChange = this.handleChange.bind(this);
  //  this.checkLoginState = this.checkLoginState.bind(this);

    this.startTest = this.startTest.bind(this);
    this.startCall = this.startCall.bind(this);
    this.editProfile = this.editProfile.bind(this);
    this.confirmClickYes = this.confirmClickYes.bind(this);
    this.showAuthModal = this.showAuthModal.bind(this);
    this.handleCollgeChange = this.handleCollgeChange.bind(this);
    this.handleMajorChange = this.handleMajorChange.bind(this);
    this.requestAuth = this.requestAuth.bind(this);
  }

   myAlert(msg){
     //console.log(myAlert,msg);
     $("#modal_text_index").text(msg);
     $("#myModal_index").modal();
  }

  initPostcodify(){
    console.log('initPostcodify',$("#postcodify"),$('#start'),$('#address'));
    $('#address').val("");
    $("#postcodify").postcodify({
        // insertPostcode5 : "#postcode",
             insertAddress : "#address",
        //   insertDetails : "#details",
        //   insertExtraInfo : "#extra_info",
        //   hideOldAddresses : true,
        results:$('#result'),
        searchButtonContent:"주소 검색",
        hideSummary:true,
        afterSelect : function(){
             console.log('afterSelect');
             var add=$('#address').val();
             $('#address').val('"'+add+ '" 근처의 상대를 검색합니다');
             $('#result').hide();
           }
     });

     $("#postcodify").click(function(event){
        //   console.log('postcodify clicked');
           $('#result').show();
       });
  }

  componentDidMount(){
  //  const { state } = this.props.location;

    console.log('componentDidMount',this.state.data);
    this.initCollege();
    this.initPostcodify();

    fetch("/user/create", {
        method: 'POST',
        body: JSON.stringify(this.state.data),
        headers: {
          //  'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
      }
    ).then(res => res.json())
     .then(
        (result) => {
          console.log('fetched',result);/*
          if(result.found==false){
                //alert("Data: " + data + "\nStatus: " + status);
              this.myAlert(strings.s6+name+'님',data);
          }else {
              this.myAlert(strings.s7,data);
          }*/
          if(!this.state.data.signUp && !result.found){
            this.setState({
              redirect: true
            });
            return;
          }
          this.setState({
            isLoaded: true,
            data:{
                ...this.state.data,
                credit: result.credit,
                gender: result.gender,
                test: result.test,
                auth: result.auth
            }
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      );

  }
  showDevConfig(data){
    if(data.test){
      return(
        <div>
          <hr/>
          <div>For dev, purpose</div>
          <form action="">
            <input type="radio" name="gender"  id="male_radio" value="male"  /> Male<br/>
            <input type="radio" name="gender"  id="female_radio" value="female" /> Female<br/>
          </form>
        </div>
      );
   }
  }

  showAuth(data){
    if(!data.auth){
       return <span class="badge badge-primary" style={{cursor:'pointer'}} id='auth' data-toggle="tooltip" data-placement="bottom" title="" onClick={this.showAuthModal}>학교 인증</span>
      }
  }

  showGender(data , isLoaded){
    //const { data , isLoaded} = this.state;
    if(!isLoaded){
      return <div></div>;
    }

    let str = <i class="fa fa-female" aria-hidden="true"></i>;
    if(data.gender==0){
        str = <i class="fa fa-male" aria-hidden="true"></i>;
    }

    return str;
  }

  editProfile(){
    console.log('editProfile',$("#emailInput"));
    const { data} = this.state;
    var url = '/user/info/'+data.sid;
    $.ajax({
        url : url,
        type : 'GET',
        success :  (result) =>{
             console.log('editProfile success',result);
             $("#emailInput").val(result.newEmail);
             $("#selfIntroInput").val(result.selfIntro);
             $("#idealTypeInput").val(result.idealType);
             $("#hobbyInput").val(result.hobby);
             this.myConfirm();
          },
        error: function(jqXHR, textStatus, errorThrown) {
         //   console.log('checkTimeFromServer');
            alert("Error, status = " + textStatus + ", " +
                    "error thrown: " + errorThrown
              );
          }
    });
  }

  myConfirm(msg){
    if(msg)
      $("#confirm_text").text(msg);
    $("#myConfirm").modal();
  }

  resetSelect(){
    var select = document.getElementById('major');
    select.selectedIndex = -1;
  }

  setMajor(arr){
    console.log('setMajor',arr);

    this.setState({
      majors: arr.map((major)=>{
        return {
          label: major,
          value: major
        };
       })
    });
    //this.resetSelect();
  }

  handleMajorChange(event){
    this.setState({major: event.value});
  }

  handleCollgeChange(event){
  //  var college = $( "#college option:selected" ).val();
    const college = event.value;

    this.setState({college: college});
    console.log('handleCollgeChange',college,this.state.college);
    //  console.log('selected',$( "#college option:selected" ).val());
  //  setCollegeDomain(college);
    var url = '/college/major/'+college;

    $.ajax({
            url: url,
            type: 'GET',
          //  data: {'refEmail': refEmail}, // An object with the key 'submit' and value 'true;
            success:  (result) =>{
            //  console.log(result);
              this.setMajor(result);
              return;
              /*
              var msg= result.found?
                  strings.s3:
                  strings.s4;
              myAlert(msg);*/
            },
            error:   function(jqXHR, textStatus, errorThrown) {
                alert("Error, status = " + textStatus + ", " +
                      "error thrown: " + errorThrown
                );
            }
        });
  }
  confirmClickYes(){
    const { data} = this.state;
    const newEmail=$("#emailInput").val();
    const hobby=$("#hobbyInput").val();
    const selfIntro=$("#selfIntroInput").val();
    const idealType=$("#idealTypeInput").val();
    console.log('yes clicked',data.email,newEmail);

    $.post( "/user/email", {
          sid: data.sid,
          newEmail :newEmail,
          hobby :hobby,
          selfIntro :selfIntro,
          idealType :idealType
       },(output, status)=>{
          console.log('saved',output.newEmail);
          data.email=output.newEmail;
          this.myAlert(strings[22]);
        //  myAlert(strings.s4+' ('+obj.email+')');//   이메일이 '+user.email+'로 변경되었습니다!'
      });
  }

  initCollege(){
    var url = '/college/names';
    $.ajax({
            url: url,
            type: 'GET',
            success: (result) => {
              this.setState({
                colleges: result.map((college)=>{
                  return {
                    label: college,
                    value: college
                  };
                }),
                college: '학교명'
              });
              console.log('initCollege',this.state.college);

            },
            error:   function(jqXHR, textStatus, errorThrown) {
                alert("Error, status = " + textStatus + ", " +
                      "error thrown: " + errorThrown
                );
            }
        });
    }
  /*
     Function to carry out the actual PUT request to S3 using the signed request from the app.
   */
    uploadFile(){
     console.log('uploadFile',this.s3File);
     if(this.s3File==null)
        return;
     const xhr = new XMLHttpRequest();

     console.log('uploadFile',this.s3File,this.s3Response.signedRequest, this.s3Response.url);
     xhr.open('PUT', this.s3Response.signedRequest);

     xhr.onreadystatechange = () => {

       if(xhr.readyState === 4){
         if(xhr.status === 200){
      //     document.getElementById('preview').src = url;
        //   document.getElementById('avatar-url').value = url;
         }
         else{
           alert('사진 업로드 실패');
         }
       }
     };
     xhr.send(this.s3File);
   }
   /*
     Function to get the temporary signed request from the app.
     If request successful, continue to upload the file using this signed
     request.
   */
    getSignedRequest(file){
     //console.log('getSignedRequest');
     const xhr = new XMLHttpRequest();
     var filename = file.name;
     var filetype = file.type;
     // xhr.open('GET', `/upload/sign-s3?file-name=${file.name}&file-type=${file.type}`);
     xhr.open('GET', `/upload/sign-s3?file-name=${filename}&file-type=${filetype}`);

     xhr.onreadystatechange = () => {
       if(xhr.readyState === 4){
         console.log('onreadystatechange',xhr.status ,file);
         if(xhr.status === 200){
           this.s3Response = JSON.parse(xhr.responseText);
           this.s3File = file;
           console.log('response',this.s3Response);
          // uploadFile(file, response.signedRequest, response.url);
         }
         else{
           alert('Could not get signed URL.:'+xhr.status);
         }
       }
     };
     xhr.send();
   }
   /*
    Function called when file input updated. If there is a file selected, then
    start upload procedure by asking for a signed request from the app.
   */
  initUpload(){
    // console.log('initUpload');
     const files = document.getElementById('file-input').files;
     const file = files[0];
    // var albumPhotosKey = encodeURIComponent(albumName) + '//';
  //   var photoKey = albumPhotosKey + fileName;
     if(file == null){
       return alert('No file selected.');
     }
     this.getSignedRequest(file);

   }

  showAuthModal(){
      document.getElementById('file-input').onchange = this.initUpload.bind(this);
      $("#authConfirm").modal();
  }

  redirect(){
     const { data} = this.state;
     console.log('redirect',data);
     if(data.test) {
        console.log('index.js test');
        var male = $('#male_radio').is(':checked');
        var btn_gender = male ? 0 : 1;
       //checkTimeFromServer(sid);
        window.location.href= '/new/' + data.sid + '/' + btn_gender;
     }else{
       if(data.auth==='false'){
           this.myAlert(strings[26]);
           return;
         }

       var url = '/new/checkTime/'+data.sid;
       $.ajax({
            url: url,
            type: 'GET',
            success:  (result)=>{
              //  alert("Your bookmark has been saved");
                console.log('checkTimeFromServer',data.sid,result.auth,result.valid);
                result.valid = true; //일시적으로 테스팅을 위해
                if(result.valid){
                //   if(result.auth)
                       window.location.href = '/new/' + data.sid  + '/-1';
                  //  else {
                    //   myAlert(strings.s19);
                    //}
                }else {
                   this.myAlert(strings[8]);
                }
              },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log('checkTimeFromServer');
                alert("Error, status = " + textStatus + ", " +
                        "error thrown: " + errorThrown
                  );
              }
          });
      //  checkTime(obj.sid);
    //    checkTimeFromServer(obj.sid);
      /*  var timeUp=checkTime(sid);

        if(timeUp){
            window.location.href = '/new/' + sid;
         }else{
            console.log('not yet');
            event.stopPropagation();
            myAlert('소개팅 가능한 시간은 10시~10시분 까지 입니다');
        }*/

      }
  }

  startCall(){
    const { data} = this.state;
    console.log('startCall',data);
/*
    if(!data.test){
        var address = $('#address').val();
        if(address===""){
          this.myAlert(strings[21]);
          return;
        }
    }
    */
  //  var session = OT.initSession(apiKey, sessionId);
    var publisher= OT.initPublisher({
        //  insertMode: "after",
      //  insertDefaultUI:false,
        height: "0px",
        width: "0px",
        publishVideo:false,
        publishAudio:false,
        showControls:false
    },(error)=>{
      if (error) {
          // The client cannot publish.
          // You may want to notify the user.
          console.log('initPublisher error',error.name);

          if(error.name==='OT_USER_MEDIA_ACCESS_DENIED')
              this.myAlert(string[12]);
          else if(error.name==='OT_SET_REMOTE_DESCRIPTION_FAILED')
              this.myAlert(strings[13]);
          else if (error.name==='OT_CHROME_MICROPHONE_ACQUISITION_ERROR')
              this.myAlert(strings[14]);
          else if (error.name==='OT_MEDIA_ERR_ABORTED')
              this.myAlert(strings[20]);
          else if(error.code==1500)
              this.myAlert(strings[15]);
          else
              this.myAlert(strings[16]);
      }else{
          console.log('initPublisher done');
        //  alert('  publisher.publishVideo(false)');
      }
    });

    publisher.on({
        VideoElementCreatedEvent: (event)=>{
          alert('VideoElementCreatedEvent');
          publisher.element='publisher';
        },
        accessAllowed:  (event) => {
          console.log('accessAllowed');
          /*
          if(typeof(Storage) !== "undefined") {
            //  sessionStorage.publisher = publisher;
              sessionStoragepublisher=publisher;
              console.log('sessionStorage',publisher,sessionStorage.publisher);
           }
           */
        //  var myJSON = JSON.parse(JSON.stringify(publisher));
        //  console.log('index.js',myJSON,'--------',publisher);
          publisher.destroy();
          this.redirect();
          // The user has granted access to the camera and mic.
        //  alert('accessAllowed');
        },
        accessDenied: (event) =>{
           this.myAlert(strings[18]);
          // The user has denied access to the camera and mic.
        },
        accessDialogOpened:  (event) =>{
           //myAlert(strings.s12);
          // The Allow/Deny dialog box is opened.
        },
        accessDialogClosed:  (event) =>{
          // The Allow/Deny dialog box is closed.
        }
      });
  }

  startTest(e){
     console.log('startTest',e);
     window.open('/chat/test/','_blank');
  }

 validate(){
    const collegeEmail =  $('#collegeEmail').val();
  /*  var collegeDomain =   'fda'; //$('#collegeDomain').text();

    if(!collegeDomain){
        myAlert(strings.s17);
        return false;
    }
    */

    const college = this.state.college;//$('#college').val();
    console.log('validate',this.state,college,this.s3File);

    if(college === '학교명'){
        this.myAlert(strings[23]);
        return false;
    }

    if(!collegeEmail && !this.s3File){
        this.myAlert(strings[22]);
        return false;
    }

    return true;
  }

   submitToServer(){
    const { data } = this.state;
    const school = data.college;//$('#college').val();
    const major = data.major;//$('#major').val();
    const collegeEmail = $('#collegeEmail').val();

    console.log('submitToServer',school,major);

    $.post( "/user/auth", {
          sid: data.sid,
          school:school,
          major:major,
          collegeEmail:collegeEmail
       },(output, status)=>{
          console.log('saved',output.done);
        //  obj.email=output.newEmail;
           this.myAlert(strings[25]);
        //  myAlert(strings.s4+' ('+obj.email+')');//   이메일이 '+user.email+'로 변경되었습니다!'
      });
  }

  requestAuth(){
    if(!this.validate()) return;

    this.submitToServer();
    this.uploadFile();
  }

  renderRedirect() {
    if (this.state.redirect) {
        console.log('renderRedirect');
        return (
          <Redirect to={{
            pathname: '/signup'
          }}
         />
      );
    }
  }

  showPostCodify() {
    const styles = {
      backgroundColor: 'white',
      border:'none'
    };

    return (
      <div class="col-sm-7">
       <h6>
          <div id="postcodify" data-toggle="tooltip" data-placement="bottom" title="주소를 세글자 이상 입력해 주세요 예)원천동"></div>
       </h6>
       <input type="text" class="form-control" style={styles} placeholder="" id="address"  aria-label="Username" aria-describedby="basic-addon1" />
       <div id="result"></div>
     </div>
   );
  }

  showHeader(){
     const { isLoaded, data ,test} = this.state;
  //   console.log('render',isLoaded);
     if (!isLoaded) {
       return <p>Loading ...</p>;
     }
  //   console.log('render 2')
     return (
         <div class="card-header">
           {this.showGender(data,isLoaded)}
           {data.name}님
           <span class="badge badge-warning" style={{cursor:'pointer'}} id='myEmail' data-toggle="tooltip" data-placement="bottom" title={data.email} onClick={this.editProfile}>프로필 수정</span>
           {this.showAuth(data)}
           <span data-toggle="tooltip" data-placement="bottom" title="포인트">[<i class="fa fa-diamond" aria-hidden="true"></i>{data.credit}]</span>
         </div>
       );
  }

  render(){
      const { isLoaded, data ,test} = this.state;

      return (
        <div>
        {this.renderRedirect()}
        <Header/>
        <small>
        <div class="container bump-me">
          <div class="body-content">
        <div class="row" >
          <div class="col-md-8 ">
            <div class="card panel-default" >
              {this.showHeader()}
              <div class="card-body" style={{padding:0+'px'}}>
                <div class="card" >
                <img class="card-img-top col-md-8" src="/img/aaa.png" alt="Card image cap"/>
                <div class="card-body">
                  <br/>
                  <button class="btn btn-success btn-lg" type="button" id="start" onClick={this.startCall} >소개팅 시작</button>
                  <a class="btn btn-outline-secondary btn-lg" target="_blank" id="testCall" onClick={this.startTest} >통화 테스트</a>
                    <br/>  <br/>  <br/>
                  <h5 class="card-title"><span class="badge badge-info">잠시만요!</span></h5>
                  <p class="card-text text-info">
                    <i class="fa fa-check" aria-hidden="true"></i> 매일 한국시간 9PM와 미국 동부시간 11PM에 10분간 이용할 수 있어요<br/>
                    <i class="fa fa-check" aria-hidden="true"></i> 첫 음성통화 3분 동안 서로 마음에 드는 경우에만 추가로 6분의 영상통화를 하게 되어요<br/>
                    <i class="fa fa-check" aria-hidden="true"></i> 소개팅 중간에 창을 닫는 행동은 절대 삼가해 주세요 차후에 이용이 제한될 수 있습니다<br/>
                    <i class="fa fa-check" aria-hidden="true"></i>본인과 최대한 근처의 분과 연결해 드리기 위해 아래에 위치를 입력해 주시기 바랍니다<br/>
                    <br/>
                    {this.showPostCodify()}
                  </p>
                 </div>
               </div>
            </div>
                {this.showDevConfig(data)}
              <div class="card-footer"></div>
            </div>

          </div>


      <div class="modal fade" id="myModal_index" role="dialog">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal">&times;</button>
              <h4 class="modal-title">Heyletz!</h4>
            </div>
            <div class="modal-body">
              <div id="modal_text_index"></div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default" data-dismiss="modal">닫기</button>
            </div>
          </div>
        </div>
      </div>
      <div class="modal fade" id="myModal_index2" role="dialog">
       <div class="modal-dialog">
         <div class="modal-content">
           <div class="modal-header">
             <button type="button" class="close" data-dismiss="modal">&times;</button>
             <h4 class="modal-title">Heyletz!</h4>
           </div>
           <div class="modal-body">
             <div id="modal_text_index2"></div>
           </div>
           <div class="modal-footer">
             <button type="button" class="btn btn-default" onclick="myOnclick()" data-dismiss="modal">닫기</button>
           </div>
         </div>
       </div>
      </div>
      <div class="modal fade" id="myConfirm" role="dialog">
         <div class="modal-dialog">
           <div class="modal-content">
             <div class="modal-header">
               <h4 class="modal-title">프로필 수정</h4>
               <button type="button" class="close" data-dismiss="modal" > <span aria-hidden="true">&times;</span></button>
             </div>
             <div class="modal-body">
               <div class="col-sm-12">
                  <label for="emailInput" id="confirm_text">이메일</label><br/>
                  <input class="form-control input-sm" id="emailInput" type="text"/>
                </div>
                <br/><br/>
                <div class="col-sm-12">
                   <label for="selfIntroInput" >내소개 </label> <br/>
                   <textarea class="form-control" id="selfIntroInput" type="text" data-toggle="tooltip" data-placement="bottom" title="음성 통화로 연결 되기 전에 상대에게 보여집니다."></textarea>
                 </div>
                 <br/><br/>
                 <div class="col-sm-12">
                    <label for="idealTypeInput" >나의 이상형</label>  <br/>
                    <textarea class="form-control " id="idealTypeInput" type="text" data-toggle="tooltip" data-placement="bottom" title="음성 통화로 연결 되기 전에 상대에게 보여집니다."></textarea>
                  </div>
                  <br/><br/>
                  <div class="col-sm-12">
                     <label for="hobbyInput" >취미</label>     <br/>
                     <input class="form-control input-sm" id="hobbyInput" type="text" data-toggle="tooltip" data-placement="bottom" title="음성 통화로 연결 되기 전에 상대에게 보여집니다."/>
                   </div>
                    <br/><br/>
                   <div class="form-check col-sm-12">
                      <input type="checkbox" class="form-check-input" id="avoid"/>
                      <label class="form-check-label" for="avoid">같은 학교/전공은 피하고 싶어요</label>
                   </div>
                   <br/>
             </div>
             <div class="modal-footer">
               <button type="button" class="btn btn-success" id="confirm_btn_yes" onClick={this.confirmClickYes} data-dismiss="modal">저장</button>
               <button type="button" class="btn btn-default" id="confirm_btn_no"  data-dismiss="modal">취소</button>
             </div>
           </div>

         </div>
      </div>
      <div class="modal fade" id="authConfirm" role="dialog">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h4 class="modal-title">학교 인증</h4>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
              </div>
              <div class="modal-body">
                <div class="form-group form-group-sm">
                  <label for="" class="col-md-2 control-label">학교</label>
                   <div class="col-md-5">
                      <Select class="form-control input-sm" id="college" options={this.state.colleges} onChange={this.handleCollgeChange} />
                   </div>
               </div>
      <br/><br/>
               <div class="form-group form-group-sm">
                 <label for="" class="col-md-2 control-label">전공</label>
                  <div class="col-md-5">
                      <Select class="form-control input-sm" options={this.state.majors} onChange={this.handleMajorChange} id="major"/>
                  </div>
              </div>
              <br/>
              <hr/>
              <br/>
                  <div class="form-group form-group-sm">
                    <label for="" class="col-md-3 control-label">학생증 업로드</label>
                     <div class="col-md-5">
                          <input type="file" id="file-input"  data-toggle="tooltip"  title="학교 인증을 위해 본인의 학생증 사진을 학번을 가리고 업로드해 주세요"/>
                     </div>
                 </div>
                 <br/>
                   <div class="">
                   <div class="col-md-3 "></div>
                   <div class="col-md-5">OR</div>
              </div>
              <br/><br/>

                  <div class="form-group form-group-sm">
                    <label for="" class="col-md-3 control-label">학교 이메일</label>
                    <div class="col-md-5">
                        <div class="input-group">
                            <input type="text" class="form-control" id="collegeEmail" aria-label="Recipient's username"  aria-describedby="collegeDomain" data-toggle="tooltip" data-placement="bottom" title="학생증을 업로드 하기 원하지 않으시면 학교 메일로 인증을 받을수 있어요. "/>
                            <div class="input-group-append ">
                              <span class="input-group-text" id="collegeDomain"></span>
                            </div>
                        </div>
                    </div>
                 </div>
                  <br/>
           </div>
           <div class="modal-footer">
             <button type="button" class="btn btn-success" data-dismiss="modal" onClick={this.requestAuth}>인증 요청</button>
             <button type="button" class="btn btn-default"  data-dismiss="modal">취소</button>
           </div>
          </div>

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
