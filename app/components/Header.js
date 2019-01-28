import React, { Component } from 'react';
//import Select from 'react-select';
//import {  Redirect} from 'react-router-dom';

class App extends Component {
  constructor(props) {
    super(props);
    //console.log('constructor',props,this.props);
    this.state = {
      value: '',
    };
  }

  render() {
    return(
      <nav class="navbar navbar-default fixed-top " role="navigation"  style={{backgroundColor:'white'}}>
        <div class="navbar-header" >
          <a class="navbar-brand " href="/"> <h6>HeyLetz <small>집에서 하는 대학생 소개팅</small>
        </h6>
            </a>
        </div>
      </nav>
    );
  }
}

export default App;
