import classes from './Home.module.css'
import Trends from '../../../UI/Trends/Trends';

const Home = () => (
  <div className={classes.container}>
    <Trends />
  </div>
);

export default Home;