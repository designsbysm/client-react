import { apiRequest, errorHandler } from '../tools/http';
import { getToken, removeToken } from '../tools/appToken';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';

// components
import { Footer, Header } from './index';
import { LoginPage } from '../pages';

// assets
import '../styles/components/app.scss';

const getRoutes = (isAuthenticated, base, routes) =>
  routes.map(route => {
    const path = base + route.url;
    const children = route.children || [];
    if (children.length > 0) {
      return getRoutes(isAuthenticated, path, children);
    }

    const Page = route.component;
    const component = props =>
      isAuthenticated ? (
        <Page {...props} route={route} />
      ) : (
        <Redirect
          to={{
            pathname: '/login',
            state: { from: props.location },
          }}
        />
      );

    return <Route exact key={path} path={path} component={component} />;
  });

const App = ({ routes, title, version }) => {
  const [
    config,
    setConfig,
  ] = useState({});

  const [
    isAuthenticated,
    setAuthenticated,
  ] = useState(!!getToken());

  useEffect(() => {
    apiRequest('/api/v1/server')
      .then(res => {
        setConfig(res);

        // if (isAuthenticated && !res.user) {
        //   removeToken();
        //   setAuthenticated(false);
        // }
      })
      .catch(errorHandler);
  }, [
    isAuthenticated,
    setConfig,
  ]);

  return (
    <Router>
      <Header config={config} logoutCB={() => setAuthenticated(false)} routes={routes} />
      <Switch>
        {getRoutes(isAuthenticated, '', routes.admin)}
        {getRoutes(isAuthenticated, '', routes.main)}
        <Route
          path="/login"
          component={props => (
            <LoginPage
              loginCB={() => {
                const { from } = props.location.state || {
                  from: { pathname: '/' },
                };

                setAuthenticated(true);
                props.history.push(from.pathname || '/');
              }}
            />
          )}
        />
        <Route
          render={props => {
            const isHome = props.location.pathname === '/';

            if (!isHome) {
              return <Redirect to="/" />;
            }
          }}
        />
      </Switch>
      <Footer title={title} version={version} />
    </Router>
  );
};

export default App;
