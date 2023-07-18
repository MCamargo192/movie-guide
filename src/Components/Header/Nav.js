import classes from './Nav.module.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UilEstate, UilTvRetro, UilStar, UilSearch, /*UilUser,*/ UilTicket } from '@iconscout/react-unicons'

const Nav = () => {
  const menu_btns = [
    { name: 'home', icon: UilEstate, link: '/' },
    { name: 'movies', icon: UilTicket, link: '/movies' },
    { name: 'tv', icon: UilTvRetro, link: '/tv' },
    { name: 'people', icon: UilStar, link: '/people' },
    { name: 'search', icon: UilSearch, link: '/search' },
    // { name: 'profile', icon: UilUser, link: '/profile' },
  ];

  const [active, setActive] = useState('home');

  const activeHandler = (name) => {
    setActive(name);
  }

  return (
    <>
      <nav classes={`${classes.nav__bar} container`} >
        <ul className={classes.nav__list}>
          {menu_btns.map((btn, index) => <li key={index}>
            <Link className={`${classes.nav__link} ${active === btn.name ? classes.active_link : ''}`} to={btn.link} onClick={() => activeHandler(btn.name)}>
              {<btn.icon className={`${classes.nav__icon} ${active === btn.name ? classes.active_link : ''}`} size='24' />}
              {btn.name}
            </Link>
          </li>)}
        </ul>
      </nav>
    </>
  );
}

export default Nav;