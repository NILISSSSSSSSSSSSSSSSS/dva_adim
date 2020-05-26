import React from 'react';
import { Router, Route, Switch } from 'dva/router';
 
 import AuthRouter from './AuthRouter'
 import login from '../pages/login/index';
 import main from '../pages/main/index';
function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
      <Route path="/login" exact component={login} />
      <AuthRouter path="/" component={main} />
      </Switch>
    </Router>
  );
}
export default RouterConfig;
