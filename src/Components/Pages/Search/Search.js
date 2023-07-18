import classes from './Search.module.css'

import { useRef, useState } from 'react';
import { UilSearch } from '@iconscout/react-unicons'
import SearchCatalogue from './SearchCatalogue';

const Search = () => {
  const inputRef = useRef(null)
  const [query, setQuery] = useState('');
  const [submit, setSubmit] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const submitHandler = (event) => {
    event.preventDefault();
    setQuery(inputRef.current.value.trim())
    setSubmit(true);
  };

  const disableHandler = () => {
    if (inputRef.current.value) setDisabled(false)
    else setDisabled(true);
  };

  return (
    <div className={classes['search-container']}>
      <form
        className={classes['search-form']}
        onSubmit={submitHandler}
      >
        <div className={classes['input-div']}>
          <div className={classes['input-div-left']}>
            <input
              className={classes.input}
              ref={inputRef}
              type="text"
              name="query"
              placeholder='Search for a movie, tv show or person'
              onChange={disableHandler}
            />
          </div>
          <div className={classes['input-div-right']}>
            <button className={classes['input-btn']} type="submit" disabled={disabled}>
              <UilSearch />
            </button>

          </div>
        </div>
      </form >
      {submit && <SearchCatalogue query={query} />}
    </div >
  )
}

export default Search;