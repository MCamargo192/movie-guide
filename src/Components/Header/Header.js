import classes from './Header.module.css';
// import { useState } from 'react';
import Nav from './Nav';

const Header = () => {
  // const [logged, setLogged] = useState(false);

  // const loginHandler = () => setLogged(prevLogin => !prevLogin);
  return (
    <>
      <header className={classes.header}>
        <h1 className={classes.logo}>The Guide</h1>
        {/* {!logged && <button className={classes.login} onClick={loginHandler}>Log In</button>}
        {logged && (
          <div className={classes.avatar} onClick={loginHandler}>
            <span>
              MC
            </span>
          </div>
        )} */}
      </header>
      <Nav />
    </>
  );
}

export default Header;