import classes from './SearchCatalogue.module.css';

import { useEffect, useState, useCallback, useMemo } from 'react';
import SearchCatalogueHeader from './SearchCatalogueHeader';
import Cards from '../../../UI/Cards/Cards';
import Loader from '../../../UI/Loader/Loader';
import { UilAnnoyed } from '@iconscout/react-unicons'

import tmdbHelpers from '../../../Helpers/tmdbHelper';
const { searchFor } = tmdbHelpers;

const SearchCatalogue = ({ query = '' }) => {
  const types = useMemo(() => ({
    'Movies': 'movie',
    'TV Shows': 'tv',
    'People': 'person',
  }), [])
  const catalogues = useMemo(() => Object.keys(types), [types]);

  const [active, setActive] = useState(catalogues[0]);
  const [shows, setShows] = useState({ pages: 0, list: [] });
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const setInitialValues = () => {
    setShows({ pages: 0, list: [] });
    setPage(0);
  };

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const { pages, list } = await searchFor({ type: types[active], query, page: page + 1 });

      setShows(prevShows => {
        const newList = [...prevShows.list, ...list].reduce((acc, current) => {
          const arr = acc.find(item => item.id === current.id);
          if (!arr) return acc.concat([current]);
          else return acc;
        }, []);

        return {
          pages,
          list: newList
        }
      });

      setErrorMsg('');
    } catch (error) {
      setErrorMsg('Error while loading data. Try again later.');
    } finally {
      setTimeout(() => setIsLoading(false), 1000);
    }
  }, [page, active, query, types]);

  useEffect(() => {
    setInitialValues();
  }, [active, query]);
  useEffect(() => { loadData(); }, [loadData]);

  const activeHandler = (listName) => { setActive(listName); };
  const loadMore = () => {
    if (page < shows.pages)
      setPage(prevPage => prevPage + 1);
  };

  const errorTypes = {
    'Movies': ' movies',
    'TV Shows': ' TV shows',
    'People': 'one',
  }

  return (
    <>
      <SearchCatalogueHeader list={catalogues} active={active} onClick={activeHandler} />
      {!isLoading && errorMsg && <div className={classes.centralized}><h3 className={classes.error}>{errorMsg}</h3></div>}
      {isLoading && <Loader />}
      {!isLoading && shows?.list.length === 0 &&
        (<div className={classes['no-data']}>
          <UilAnnoyed size={150} />
          <h1>Sorry!</h1>
          <h2>We couldn't find any{errorTypes[active]} with <span className={classes.query}>{query}</span> in the{active === 'People' ? 'ir name' : ' title'}.</h2>
          <h2>Try again!</h2>
        </div>)}
      {!isLoading && shows?.list.length > 0 &&
        (<div className={classes.grid}>
          <Cards list={shows.list} type={types[active]} grid={true} />
          {page + 1 < shows.pages && <div className={classes.centralized}>
            <button onClick={loadMore} className={classes.button}>Load More</button>
          </div>}
        </div>)}
    </ >
  );
}

export default SearchCatalogue;