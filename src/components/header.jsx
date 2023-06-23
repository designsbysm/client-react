import '../styles/components/header.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOut } from '@fortawesome/pro-regular-svg-icons';
import { faUser, faCaretDown } from '@fortawesome/pro-solid-svg-icons';
import { Link, NavLink } from 'react-router-dom';
import { removeToken } from '../tools/appToken';
import logo from '../images/logo.svg';
import React, { useState } from 'react';

const getGreeting = user => {
  if (!user) {
    return 'Unknown';
  }

  const { name, username } = user;

  if (name) {
    return name.first;
  } else if (username) {
    return username;
  }
};

const Dropdown = (base, route) => {
  const [
    visible,
    setVisible,
  ] = useState(false);

  return (
    <div
      className="header-menu-item"
      key={route.title}
      onClick={() => {
        setVisible(!visible);
      }}
      onMouseEnter={() => {
        setVisible(true);
      }}
      onMouseLeave={() => {
        setVisible(false);
      }}>
      <span className="link">
        {route.icon ? <FontAwesomeIcon
          className="icon"
          fixedWidth
          icon={route.icon}
        /> : null}
        {route.title}
        <FontAwesomeIcon
          className="caret"
          icon={faCaretDown}
        />
      </span>
      <div className={`header-menu-dropdown ${visible ? 'show' : 'hide'}`}>
        {generateMenu(route.url, route.children)}
      </div>
    </div>
  );
};

const generateMenu = (base, menu) =>
  menu.map(route => {
    if (route.hidden) {
      return null;
    }

    const hasChildren = route.children && route.children.length > 0;
    if (hasChildren) {
      return Dropdown(base, route);
    } else {
      return MenuItem(base, route);
    }
  });

const Logo = ({ image }) => (
  <Link
    className="header-logo"
    to="/">
    <img
      alt="SM Logo"
      src={image}
    />
  </Link>
);

const MenuItem = (base, route) => {
  const path = base + route.url;

  return route.title === 'seperator' ? (
    <div
      className="seperator"
      key={'seperator' + Math.random()}
    />
  ) : (
    <div
      className="header-menu-item"
      key={route.title + route.url}>
      {route.onClick ? (
        <span
          className="link"
          onClick={route.onClick}>
          {route.icon ? <FontAwesomeIcon
            className="icon"
            fixedWidth
            icon={route.icon}
          /> : null}
          Logout
        </span>
      ) : (
        <NavLink
          activeClassName="current"
          exact
          key={route.url}
          to={path}>
          {route.icon ? <FontAwesomeIcon
            className="icon"
            fixedWidth
            icon={route.icon}
          /> : null}
          {route.title}
        </NavLink>
      )}
    </div>
  );
};

const Nav = ({ logoutCB, routes, user }) => {
  const { admin, main } = routes;

  const hasLogout = admin
    .filter(item => item.title === 'Logout')
    .reduce(() => {
      return true;
    }, false);

  if (!hasLogout) {
    // setup admin menu
    const logoutItem = {
      icon: faSignOut,
      onClick: () => {
        removeToken();
        logoutCB();
      },
      title: 'Logout',
    };
    admin.push(logoutItem);
  }

  const userItem = {
    children: admin,
    icon: faUser,
    title: getGreeting(user),
  };

  return (
    <nav className="header-nav">
      <div
        className="header-nav-menu main"
        key="main">
        {generateMenu('', main)}
      </div>
      <div
        className="header-nav-menu admin"
        key="admin">
        {generateMenu('', [userItem])}
      </div>
    </nav>
  );
};

const Header = ({ config, logoutCB, routes }) => {
  const { user } = config || {};

  return (
    <header className="site-header">
      <Logo image={logo} />
      {user ? <Nav
        logoutCB={logoutCB}
        routes={routes}
        user={user}
      /> : null}
    </header>
  );
};

export default Header;
