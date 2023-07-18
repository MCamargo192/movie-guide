import classes from './Catalogue.module.css';

import { useEffect, useState, useCallback, useMemo } from 'react';

import CatalogueHeader from './CatalogueHeader';
import Cards from '../../../UI/Cards/Cards';
import Loader from '../../../UI/Loader/Loader';

import tmdbHelpers from '../../../Helpers/tmdbHelper';
const { getShows, getPeople } = tmdbHelpers;

const Catalogue = (props) => {
  const catalogue = useMemo(() => ({
    home: ['Home', 'Movies', 'TV Shows'],
    movie: ['Popular', 'Now playing', 'Upcoming', 'Top Rated'],
    tv: ['Popular', 'On the Air', 'Top Rated'],
    people: ['People']
  }), []);

  const [listType, setListType] = useState(props.catalogue);
  const [active, setActive] = useState(catalogue[props.catalogue][0]);
  const [shows, setShows] = useState({ pages: 0, list: [] });
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const setInitialValues = () => {
    setShows({ pages: 0, list: [] });
    setPage(0);
  };

  const loadData = useCallback(async () => {
    const show_list = active.toLowerCase().replace(/\s/g, '_');
    try {
      setIsLoading(true);
      const { pages, list } = await (listType === 'people' ? getPeople(page + 1) : getShows({ show_type: listType, show_list: show_list, page: page + 1 }));

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
  }, [page, active, listType]);

  useEffect(() => { setActive(catalogue[props.catalogue][0]) }, [props.catalogue, catalogue]);
  useEffect(() => {
    setListType(props.catalogue);
    setInitialValues();
  }, [props.catalogue]);
  useEffect(() => {
    setInitialValues();
  }, [active]);
  useEffect(() => { loadData(); }, [loadData]);

  const activeHandler = (listName) => { setActive(listName); };
  const loadMore = () => {
    if (page < shows.pages)
      setPage(prevPage => prevPage + 1);
  };

  return (
    <>
      {listType !== 'people' && <CatalogueHeader list={catalogue[props.catalogue]} active={active} onClick={activeHandler} />}
      {!isLoading && errorMsg && <div className={classes.centralized}><h3 className={classes.error}>{errorMsg}</h3></div>}
      {isLoading && <Loader />}
      {!isLoading && <div className={classes.grid}>
        <Cards list={shows.list} type={listType} grid={true} />
        {listType !== 'home' && <div className={classes.centralized}>
          <button onClick={loadMore} className={classes.button}>Load More</button>
        </div>}
      </div>}
    </>
  );
}

export default Catalogue;