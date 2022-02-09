/* ~global document, module */

import { App } from './components';
import { HomePage } from './pages';
import packageJson from '../package.json';
import React from 'react';
import ReactDOM from 'react-dom';

const routes = {
  admin: [],
  main: [
    {
      component: HomePage,
      hidden: true,
      title: 'Home',
      url: '/',
    },
  ],
};

if (module.hot) {
  module.hot.accept();
}

ReactDOM.render(
  <App routes={routes} title={packageJson.name} version={packageJson.version} />,
  document.getElementById('root'),
);
