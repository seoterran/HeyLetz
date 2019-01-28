import React from 'react';
import ReactDOM from 'react-dom';

import Signup from './components/SignUp';
import Begin from './components/Begin';
import Home from './components/Home';

import 'bootstrap/dist/css/bootstrap.css';
import './css/new-age.css';
import './css/font-awesome-4.7.0/css/font-awesome.min.css';
import './device-mockups/device-mockups.min.css';
import './css/sample.css';

import 'bootstrap'; //import 'bootstrap/dist/js/bootstrap.js';
import './js/postSearch.min.js';;
import './js/new-age.min.js';


import { BrowserRouter as Router, Switch, Route, Redirect,withRouter} from 'react-router-dom';
//import registerServiceWorker from './registerServiceWorker';
function WillMatch() {
  return <h3>Matched!</h3>;
}
$(document).ready(function () {
  ReactDOM.render(
      <Router basename="/">
          <Switch>
              <Route exact path= "/" component={Home}/>
              <Route exact path= "/signup" component={Signup}/>
              <Route exact path= "/begin" component={Begin}/>
            //  <Route exact path="/will-match" component={WillMatch} />
          </Switch>
      </Router>
          , document.getElementById('root'));
});
//registerServiceWorker();
