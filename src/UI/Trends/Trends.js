import classes from './Trends.module.css';
import { useState, useEffect, useCallback } from 'react';
import Cards from '../Cards/Cards';
import Loader from '../Loader/Loader';

import tmdbHelpers from '../../Helpers/tmdbHelper';
const { getTrends } = tmdbHelpers;

const Trends = (props) => {
  const [trends, setTrends] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      let list = await getTrends();
      setTrends(list);
      setErrorMsg('');
    } catch (error) {
      setErrorMsg('Error while loading data. Try again later.');
    } finally {
      setTimeout(() => setIsLoading(false), 1000);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const trendsValues = {
    movie: 'Movies',
    tv: 'TV Shows',
    person: 'People'
  }

  return (<div className={classes.container}>
    {!isLoading && errorMsg && <div className={classes.centralized}><h3 className={classes.error}>{errorMsg}</h3></div>}
    {isLoading && <Loader />}
    {!isLoading && trends && (<div className={classes.container}>
      <h1>Trending Today</h1>
      {Object.keys(trends).map(type => (trends[type] && <div className={classes.box}>
        <h3 className={classes['sub-title']}>{trendsValues[type]}</h3>
        <Cards list={trends[type]} type={type === 'person' ? 'people' : type} grid={true} scroll={false} />
      </div>))}
    </div>)}
  </div>
  );
}

export default Trends;