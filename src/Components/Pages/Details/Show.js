import classes from './Show.module.css';

import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';

import Links from '../../../UI/Links/Links';
import Loader from '../../../UI/Loader/Loader';
import Slider from '../../../UI/Slider/Slider';
import Gallery from '../../../UI/Gallery/Gallery';

import tmdbHelpers from '../../../Helpers/tmdbHelper';
const { getShows, getShowDetails, getCredits, getPath } = tmdbHelpers;

const Show = () => {
  const navigate = useNavigate();
  const props = useParams();
  const id = props.id.substring(0, props.id.indexOf('_'));
  const type = props.type;
  const [show, setShow] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(false);
  const [showGallery, setShowGallery] = useState(false);

  const loadMovie = useCallback(async () => {
    try {
      setIsLoading(true);
      const fetchedShow = await getShowDetails(type, id);
      const { list } = await getShows({ show_type: type, recommendations: true, show_id: id });
      const { crew, cast } = await getCredits(type, id);

      fetchedShow.recommendations = list;
      fetchedShow.cast = cast.slice(0, 21);
      fetchedShow.crew = crew.filter(person => person.job === 'Director' || person.job === 'Writer' || person.job === 'Creator' || person.job === 'Characters')
        .reduce((acc, current) => {
          const arr = acc.find(item => item.id === current.id);
          if (!arr) return acc.concat([current]);
          else {
            acc[acc.indexOf(arr)] = { ...arr, job: `${arr.job}, ${current.job}` };
            return acc;
          };
        }, []);

      setShow(fetchedShow);
      setErrorMsg('');
    } catch (error) {
      setErrorMsg('Error while loading data. Try again later.');
    } finally {
      setTimeout(() => setIsLoading(false), 1000);
    }
  }, [type, id]);

  const getFormattedDate = () => {
    const date = show.releaseDate.split('-');
    return date[1] + '/' + date[2] + '/' + date[0];
  };

  const getCountries = () => {
    let countries = '';
    if (show.country.length > 0) {
      countries = '(';
      show.country.forEach((country, index) => {
        countries += country;
        countries += (index + 1 < show.country.length ? ',' : ')');
      });
    }
    return countries;
  }

  const getGenres = () => {
    let genres = '';
    show.genres.forEach((genre, index) => {
      genres += genre;
      if (index + 1 < show.genres.length)
        genres += ', ';
    });
    return genres;
  }

  const getFormattedDuration = () => {
    let duration = show.duration;
    if (show.type === 'tv') duration = show.episodeTime[0];
    const durationHours = Math.floor(duration / 60);
    const durationMinutes = duration % 60;
    let fullDuration = (durationHours > 0 ? durationHours + 'h' : '') + (durationMinutes > 0 ? durationMinutes + 'm' : '');
    if (durationHours === 1 && durationMinutes === 0) fullDuration = duration + 'm';

    return fullDuration;
  }

  const showGalleryHandler = () => { setShowGallery(prevShowGallery => !prevShowGallery); }

  useEffect(() => { loadMovie(); }, [loadMovie]);

  return (
    <>
      {showGallery && <Gallery type={show.type} onClose={showGalleryHandler} images={show.images} />}
      {!isLoading && errorMsg && <div className={classes.centralized}><h3 className={classes.error}>{errorMsg}</h3></div>}
      {isLoading && <Loader />}
      {!isLoading && <div>
        <div className={classes['movie-img']}>
          <img src={show.backdrop} alt={show.title} />
        </div>
        <div className={classes.container}>
          <div className={classes['overview-container']}>
            <div className={classes['poster-container']}>
              <img className={classes['poster-img']} src={show.poster} alt={show.title} style={{ '--width': '15rem' }} />
            </div>
            <div className={classes.overview}>
              <h1 className={classes.title}>
                {show.title}
              </h1>
              <h3 className={classes.tagline}>
                {show.tagline}
              </h3>
              <span className={classes.details}>{getFormattedDate()} {getCountries()} - {getGenres()}</span><br />
              <span>{show.seasons && `${show.seasons} season${show.seasons > 1 ? 's' : ''}`}{show.seasons && show.duration ? ' - ' : ''}{show.duration ? `${getFormattedDuration()}` : ''}</span>
              <Links item={show} hasGallery={show.images.length > 0} onClose={showGalleryHandler} />
              <div>
                <h4>Overview</h4>
                <p className={classes.synopses}>{show.overview}</p>
                <ul className={classes.list}>
                  {show.crew.length > 0 && show.crew.map((person, index) => (
                    <li key={index} className={classes['credits-list']}>
                      <span className={classes['credits-name']} onClick={e => { navigate(getPath(person, person.type)) }}>{person.name}</span>
                      <br />
                      <span>{person.job}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div>
            {show.streamingOn.length > 0 && <h4>Watch on</h4>}
            {show.streamingOn.length > 0 && <div className={classes.streaming}>
              <ul className={classes.streamlist}>
                {show.streamingOn.length > 0 && show.streamingOn.map((streamer, index) => (
                  <li key={index} className={classes['list-item']}>
                    <img className={classes.streamer} src={streamer.logo} alt={streamer.name} title={streamer.name} />
                  </li>
                ))}
              </ul>
            </div>}
          </div>
          {show.cast.length > 0 && <div className={classes['related-list']}>
            <h4>Cast</h4>
            <Slider items={show.cast} />
          </div>}
          {show.recommendations.length > 0 && <div className={classes['related-list']}>
            <h4>Also watch</h4>
            <Slider items={show.recommendations} />
          </div>}
        </div>
      </div>}
    </ >
  );
}

export default Show;