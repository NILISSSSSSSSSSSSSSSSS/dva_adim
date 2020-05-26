

import React from 'react';
import { withRouter, Route, Switch } from 'react-router-dom';
// import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { routes } from '../../../routes/routerMap';
import { connect } from 'dva'
import { Layout } from 'antd';
const { Content } = Layout;

const MainContent = ({ location }) => {

	return (
		<Content style={{ padding: '15px' }}>
			<Switch>
				{routes.map(ele => <Route render={() => <ele.component />} key={ele.path} path={ele.path} />)}

			</Switch>
		</Content>
	);
};

export default withRouter(connect()(MainContent));
