import classes from './Person.module.css';

import { useParams } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';

import Links from '../../../UI/Links/Links';
import Loader from '../../../UI/Loader/Loader';
import Slider from '../../../UI/Slider/Slider';

import tmdbHelpers from '../../../Helpers/tmdbHelper';
import Gallery from '../../../UI/Gallery/Gallery';
const { getPersonDetails, getAge, getName, getPersonCredits, getFormatedDate } = tmdbHelpers;

const Person = () => {
  const props = useParams();
  const id = props.id.substring(0, props.id.indexOf('_'));
  const name = getName(props.id);
  const [person, setPerson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [showGallery, setShowGallery] = useState(false);

  const loadPerson = useCallback(async () => {
    try {
      setIsLoading(true);
      const fetchedPerson = await getPersonDetails(id);
      if (fetchedPerson === null)
        throw new Error();

      if (fetchedPerson.birthday) {
        fetchedPerson.age = getAge(fetchedPerson.birthday, fetchedPerson.deathday);
        fetchedPerson.birthday = getFormatedDate(fetchedPerson.birthday);
      }
      if (fetchedPerson.deathday)
        fetchedPerson.deathday = getFormatedDate(fetchedPerson.deathday);
      const shows = await getPersonCredits(fetchedPerson.id);
      fetchedPerson.shows = shows[`${fetchedPerson.knownFor === 'Acting' ? 'cast' : 'crew'}`].slice(0, 15);
      console.log(fetchedPerson);
      setPerson(fetchedPerson);
      setErrorMsg('');
    } catch (error) {
      setErrorMsg(`Sorry! We don't have more information about ${name}.`);
    } finally {
      setIsLoading(false);
    }
  }, [id, name]);

  useEffect(() => { loadPerson(); }, [loadPerson]);

  const showMoreHandler = () => { setShowMore(prevShowMore => !prevShowMore) };
  const showGalleryHandler = () => { setShowGallery(prevShowGallery => !prevShowGallery) };

  return (
    <>
      {showGallery && <Gallery type={person.type} onClose={showGalleryHandler} images={person.gallery} />}
      {!isLoading && errorMsg && <div className={classes.centralized}>
        <h3 className={classes.error}>{errorMsg}</h3>
      </div>}
      {isLoading && <Loader />}
      {!isLoading && <div className={classes.container}>
        <div className={classes.header}>
          <div className={classes['photo-container']}>
            <img className={classes.photo} src={person.photo} alt={person.name} style={{ '--width': '15rem' }} />
            <Links item={person} hasGallery={person.gallery.length > 0} onClose={showGalleryHandler} />
          </div>
          <div className={classes.info}>
            <h1 className={classes.title}>{person.name}</h1>
            <h3>Info</h3>
            <h4>Age</h4>
            <p>{person.age ? `${person.age} years old` : '---'}</p>
            <h4>Born</h4>
            <p>{person.birthday ? person.birthday : '---'}</p>
            {person.deathday && <h4>Death</h4>}
            {person.deathday && <p>{person.deathday}</p>}
            <h4>Born in</h4>
            <p>{person.birthPlace ? person.birthPlace : '---'}</p>
            <h4>Known for</h4>
            <p>{person.knownFor ? person.knownFor : '---'}</p>
          </div>
        </div>
        <div>
          {person.bio.length > 0 && <h3>Bio</h3>}
          {person.bio.length > 0 && <div className={classes.bio}>
            {!showMore && <p>{person.bio[0]}</p>}
            {showMore && person.bio.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            {person.bio.length > 1 && <span className={classes['show-more']} onClick={showMoreHandler}>{!showMore ? 'More' : 'Less'}</span>}
          </div>}
          {person.shows.length > 0 && <h3>Movies</h3>}
          {person.shows.length > 0 && <Slider items={person.shows} />}
        </div>
      </div>}
    </ >
  );
}

export default Person;