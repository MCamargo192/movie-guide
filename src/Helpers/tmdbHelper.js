const API_MAIN_URL = 'https://api.themoviedb.org/3/';
const API_KEY = '?api_key=a395cd002a1dee61cd68a48ce0ff2b42';
const NO_POSTER = 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.216_NZYqMrB3reOVidJ7rAHaG7%26pid%3DApi&f=1';
const NO_PHOTO = 'https://live.staticflickr.com/2428/3887066231_56e5876522.jpg';

const tmdbHelpers = {
  getAge: (birth, death) => {
    const bDay = birth.split('-');
    const dDay = death ? death.split('-') : [];
    const birthday = new Date(bDay[0], bDay[1] - 1, bDay[2]);
    const today = dDay.length > 0 ? new Date(dDay[0], dDay[1] - 1, dDay[2]) : new Date();

    let age = today.getFullYear() - birthday.getFullYear();
    if ((today.getMonth() < birthday.getMonth()) || (today.getMonth() === birthday.getMonth() && today.getDate() < birthday.getDate()))
      age--;

    return age;
  },
    /* WORKING OK*/ getGender: (gender) => {
    if (gender === 1) return 'Female';
    if (gender === 2) return 'Male';
    return '-';
  },
    /* WORKING OK*/ getGallery: async (person_id) => {
    try {
      // https://api.themoviedb.org/3/person/{person_id}/images?api_key=a395cd002a1dee61cd68a48ce0ff2b42
      const response = await fetch(`${API_MAIN_URL}person/${person_id}/images${API_KEY}&language=en-US`);
      if (!response.ok)
        throw new Error('Impossible to get PERSON PHOTOS from server.');
      const person = await response.json();
      return person.profiles.map(photo => photo.file_path ? `https://image.tmdb.org/t/p/original${photo.file_path}` : NO_PHOTO)
    } catch (error) {
      console.log(error.message);
    }
  },
  getSocialMedia: async (item) => {
    // https://api.themoviedb.org/3/person/{person_id}/external_ids?api_key=a395cd002a1dee61cd68a48ce0ff2b42&language=en-US
    // https://api.themoviedb.org/3/movie/{movie_id}/external_ids?api_key=a395cd002a1dee61cd68a48ce0ff2b42&language=en-US
    try {
      const response = await fetch(`${API_MAIN_URL}${item.type}/${item.id}/external_ids${API_KEY}&language=en-US`);
      if (!response.ok)
        throw new Error('Impossible to get SOCIAL MEDIA from server.');
      const data = await response.json();
      const { facebook_id, instagram_id, twitter_id } = data;
      const social = {};
      if (facebook_id) social.facebook = `https://www.facebook.com/${facebook_id}`;
      if (instagram_id) social.instagram = `https://www.instagram.com/${instagram_id}`;
      if (twitter_id) social.twitter = `https://twitter.com/${twitter_id}`;

      return social;
    } catch (error) {
      console.log(error.message);
    }
  },
  getPersonCredits: async (person_id) => {
    const sortAndfilter = list => {
      let shows = list.reduce((acc, current) => {
        const arr = acc.find(item => item.id === current.id);
        if (!arr) return acc.concat([current]);
        else return acc;
      }, []);
      shows = shows.sort((a, b) => a.popularity < b.popularity);
      shows = shows.filter(show => show.poster_path);
      shows = shows.map(show => ({
        id: show.id,
        type: show.media_type,
        title: show.media_type === 'tv' ? show.name : show.title,
        poster: `https://image.tmdb.org/t/p/original${show.poster_path}`
      }));

      return shows;
    };

    try {
      // https://api.themoviedb.org/3/person/18918/movie_credits?api_key=a395cd002a1dee61cd68a48ce0ff2b42&language=en-US
      // https://api.themoviedb.org/3/find/{imdb_id}?api_key=a395cd002a1dee61cd68a48ce0ff2b42&language=en-US&external_source=imdb_id
      const response = await fetch(`${API_MAIN_URL}person/${person_id}/combined_credits${API_KEY}&language=en-US`);
      // const response = await fetch(`${API_MAIN_URL}find/${person_id}${API_KEY}&language=en-US&external_source=imdb_id`);
      if (!response.ok)
        throw new Error('Impossible to get PERSON CREDITS from server.');
      const data = await response.json();
      const cast = sortAndfilter(data.cast);
      const crew = sortAndfilter(data.crew);
      const shows = { cast, crew };
      return shows;
    } catch (error) {
      console.log(error.message);
    }
  },
    /* WORKING OK*/ getPersonDetails: async (person_id, type = 'person') => {
    try {
      // https://api.themoviedb.org/3/person/1245?api_key=a395cd002a1dee61cd68a48ce0ff2b42&language=en-US
      // https://api.themoviedb.org/3/person/{person_id}?api_key=a395cd002a1dee61cd68a48ce0ff2b42&language=en-US
      const response = await fetch(`${API_MAIN_URL}${type}/${person_id}${API_KEY}&language=en-US`);
      if (!response.ok)
        throw new Error('Impossible to get PERSON DETAILS from server.');
      const data = await response.json();
      const person = {
        id: data.id,
        type: type,
        gender: tmdbHelpers.getGender(data.gender),
        name: data.name,
        photo: data.profile_path ? `https://image.tmdb.org/t/p/original${data.profile_path}` : NO_PHOTO,
        gallery: await tmdbHelpers.getGallery(data.id),
        bio: data.biography.split('\n').filter(p => p.length > 0),
        birthday: data.birthday,
        deathday: data.deathday,
        homepage: data.homepage,
        imdb: data.imdb_id && `https://www.imdb.com/name/${data.imdb_id}`,
        knownFor: data.known_for_department,
        birthPlace: data.place_of_birth,
        popularity: data.popularity,
      };

      person.socialMedia = await tmdbHelpers.getSocialMedia(person);

      return person;
    } catch (error) {
      console.log(error.message);
    }
  },
    /* WORKING OK*/ getPeople: async (page = 1) => {
    try {
      // https://api.themoviedb.org/3/person/popular?api_key=a395cd002a1dee61cd68a48ce0ff2b42&language=en-US&page={page}
      const response = await fetch(`${API_MAIN_URL}person/popular${API_KEY}&language=en-US&page=${page}`);
      if (!response.ok)
        throw new Error('Impossible to get PEOPLE from server.');
      const data = await response.json();
      let people = data.results.map(item => ({
        id: item.id,
        name: item.name,
        photo: item.profile_path ? `https://image.tmdb.org/t/p/original${item.profile_path}` : NO_PHOTO,
      }));

      // let detailedPeople = await Promise.all(data.results.map(async person => await tmdbHelpers.getPersonDetails(person.id)));

      people = people.reduce((acc, current) => {
        const arr = acc.find(item => item.id === current.id);
        if (!arr) return acc.concat([current]);
        else return acc;
      }, []);
      const pages = data.total_pages;

      return { pages, list: people, listType: "people" };
    } catch (error) {
      console.log(error.message);
    }
  },
    /* WORKING OK*/ getCredits: async (show_type, show_id) => {
    try {
      // https://api.themoviedb.org/3/movie/{movie_id}/credits?api_key=a395cd002a1dee61cd68a48ce0ff2b42&language=en-US
      const response = await fetch(`${API_MAIN_URL}${show_type}/${show_id}/credits${API_KEY}&language=en-US`);
      if (!response.ok)
        throw new Error('Impossible to get CREDITS from server.');
      const data = await response.json();
      const cast = data.cast.map(person => ({
        id: person.id,
        character: person.character,
        name: person.original_name,
        photo: person.profile_path ? `https://image.tmdb.org/t/p/original${person.profile_path}` : NO_PHOTO,
        type: 'person'
      }));
      const crew = data.crew.map(person => ({
        id: person.id,
        job: person.job,
        name: person.original_name,
        photo: person.profile_path ? `https://image.tmdb.org/t/p/original${person.profile_path}` : NO_PHOTO,
        type: 'person'
      }));
      // const filterCrew = crew.

      return { cast, crew };
    } catch (error) {
      console.log(error.message);
    }
  },
    /* WORKING OK*/ getTrailer: async (show_type, show_id) => {
    try {
      // https://api.themoviedb.org/3/movie/{movie_id}/videos?api_key=a395cd002a1dee61cd68a48ce0ff2b42&language=en-US
      const response = await fetch(`${API_MAIN_URL}${show_type}/${show_id}/videos${API_KEY}&language=en-US`);
      if (!response.ok)
        throw new Error('Impossible to get TRAILER from server.');
      const data = await response.json();
      const trailer = data.results.find(item => item.name === "Official Trailer");
      return (trailer) ? {
        link: `https://www.youtube.com/embed/${trailer.key}`,
        name: trailer.name
      } : {
        link: '',
        name: ''
      }
    } catch (error) {
      console.log(error.message);
    }
  },
    /* WORKING OK*/ getImages: async (show_type, show_id) => {
    try {
      // https://api.themoviedb.org/3/movie/{movie_id}/images?api_key=a395cd002a1dee61cd68a48ce0ff2b42&language=en-US
      const response = await fetch(`${API_MAIN_URL}${show_type}/${show_id}/images${API_KEY}`);
      if (!response.ok)
        throw new Error('Impossible to get IMAGES from server.');
      const data = await response.json();
      const backdrops = data.backdrops.filter(backdrop => backdrop.iso_639_1 === null || backdrop.iso_639_1 === 'en').map(image => ({
        path: image.file_path ? `https://image.tmdb.org/t/p/w500${image.file_path}` : NO_POSTER,
        type: 'backdrop'
      }));;
      const posters = data.posters.filter(poster => poster.iso_639_1 === null || poster.iso_639_1 === 'en').map(image => ({
        path: image.file_path ? `https://image.tmdb.org/t/p/w500${image.file_path}` : NO_POSTER,
        type: 'poster'
      }));
      const images = [...posters, ...backdrops];

      return images;
    } catch (error) {
      console.log(error.message);
    }
  },
    /* WORKING OK*/ getStreamer: async (show_type, show_id, country = 'US') => {
    try {
      // https://api.themoviedb.org/3/movie/{movie_id}/watch/providers?api_key=a395cd002a1dee61cd68a48ce0ff2b42
      const response = await fetch(`${API_MAIN_URL}${show_type}/${show_id}/watch/providers${API_KEY}`);
      if (!response.ok)
        throw new Error('Impossible to get STREAMER from server.');
      const data = await response.json();
      const streamer = data.results[country];

      if (streamer === undefined)
        return [];

      const keys = [];
      for (const key in streamer) {
        if (!(key === 'link'))
          keys.push(key);
      }

      let streaming = [];
      keys.forEach(key => { streaming = [...streaming, ...streamer[key]] });

      streaming = streaming.reduce((acc, current) => {
        const arr = acc.find(item => item.provider_id === current.provider_id);
        if (!arr) return acc.concat([current]);
        else return acc;
      }, []);

      const provider = [];
      if (streaming.length > 0)
        streaming.forEach(prov => {
          provider.push({
            logo: prov.logo_path ? `https://image.tmdb.org/t/p/original${prov.logo_path}` : '',
            name: prov.provider_name
          });
        });

      return provider.slice(0, 5);
    } catch (error) {
      console.log(error.message);
    }
  },
  /* WORKING OK*/ getShowDetails: async (show_type, show_id) => {
    try {
      // https://api.themoviedb.org/3/{movie}/{movie_id}?api_key=a395cd002a1dee61cd68a48ce0ff2b42&language=en-US
      const response = await fetch(`${API_MAIN_URL}${show_type}/${show_id}${API_KEY}&language=en-US`);
      if (!response.ok)
        throw new Error(`Impossible to get ${show_type.toUpperCase()} DETAILS from server.`);
      const data = await response.json();

      const show = {
        id: data.id,
        type: show_type,
        isAdult: data.adult,
        backdrop: data.backdrop_path ? `https://image.tmdb.org/t/p/original${data.backdrop_path}` : NO_POSTER,
        poster: data.poster_path ? `https://image.tmdb.org/t/p/original${data.poster_path}` : NO_POSTER,
        genres: data.genres.map(genre => genre.name),
        homepage: data.homepage,
        imdb: data.imdb_id && `https://www.imdb.com/title/${data.imdb_id}`,
        duration: data.runtime,
        language: data.original_language,
        originalTitle: show_type === 'movie' ? data.original_title : data.original_name,
        title: show_type === 'movie' ? data.title : data.name,
        overview: data.overview,
        popularity: data.popularity,
        country: data.production_countries.map(country => country.iso_3166_1),
        production: data.production_companies.map(company => ({
          logo: company.logo_path ? `https://image.tmdb.org/t/p/original${company.logo_path}` : '',
          name: company.name
        })),
        releaseDate: (show_type === 'movie' ? data.release_date : data.first_air_date),
        tagline: data.tagline,
        rate: data.vote_average,
        trailer: await tmdbHelpers.getTrailer(show_type, show_id),
        streamingOn: await tmdbHelpers.getStreamer(show_type, show_id),
        images: await tmdbHelpers.getImages(show_type, show_id)
      };

      if (show_type === 'tv') {
        show.episodeTime = data.episode_run_time;
        show.inProduction = data.in_production;
        show.seasons = data.number_of_seasons;
        show.lastEpisode = data.in_production ? data.last_air_date : data.lastEpisode;
      }

      show.socialMedia = await tmdbHelpers.getSocialMedia(show);

      return show;
    } catch (error) {
      console.log(error.message);
    }
  },
    /* WORKING OK*/ getShows: async ({ show_type, recommendations, show_id, show_list, page = 1 }) => {
    try {
      // RECOMMENDATION => https://api.themoviedb.org/3/movie/{movie_id}/recommendations?api_key=a395cd002a1dee61cd68a48ce0ff2b42&language=en-US&page={page}
      // MOVIES LIST    => https://api.themoviedb.org/3/movie/{movie_type}?api_key=a395cd002a1dee61cd68a48ce0ff2b42&language=en-US&page={page}
      const fetchURL = `${API_MAIN_URL}${show_type}/${recommendations ? (show_id + '/recommendations') : show_list}${API_KEY}&language=en-US&page=${page}`;
      const response = await fetch(fetchURL);
      if (!response.ok)
        throw new Error(`Impossible to get ${recommendations ? 'RECOMMENDATIONS' : show_type.toUpperCase()} from server.`);
      const data = await response.json();
      let shows = data.results.map(item => ({
        id: item.id,
        title: show_type === 'tv' ? item.name : item.title,
        backdrop: item.backdrop_path ? `https://image.tmdb.org/t/p/original${item.backdrop_path}` : NO_POSTER,
        poster: item.poster_path ? `https://image.tmdb.org/t/p/original${item.poster_path}` : NO_POSTER,
        rate: item.vote_average,
        type: show_type
      }));

      shows = shows.reduce((acc, current) => {
        const arr = acc.find(item => item.id === current.id);
        if (!arr) return acc.concat([current]);
        else return acc;
      }, []);

      const pages = data.total_pages;

      return { pages, list: shows, listType: show_list };
    } catch (error) {
      console.log(error.message);
    }
  },
    /* WORKING OK*/ getTrends: async () => {
    try {
      // MOVIETRENDS => https://api.themoviedb.org/3/trending/movie/day?api_key=a395cd002a1dee61cd68a48ce0ff2b42
      // TVTRENDS => https://api.themoviedb.org/3/trending/tv/day?api_key=a395cd002a1dee61cd68a48ce0ff2b42
      const types = ['movie', 'tv', 'person'];
      const trendsList = types.reduce((acc, type) => ({
        ...acc,
        [type]: []
      }), {});

      await types.forEach(async (type) => {
        const fetchURL = `${API_MAIN_URL}trending/${type}/day${API_KEY}`;
        const response = await fetch(fetchURL);
        if (!response.ok)
          throw new Error(`Impossible to get ${type} trends from server.`);
        const data = await response.json();
        let trends = data.results.map(item => {
          const object = {
            id: item.id,
            title: item.media_type === 'movie' ? item.title : item.name,
            poster: item.poster_path ? `https://image.tmdb.org/t/p/original${item.poster_path}` : NO_POSTER,
            rate: item.vote_average,
            type: item.media_type
          }
          if (item.media_type === 'person') {
            delete object.rate;
            delete object.poster;
            delete object.title;
            object.name = item.name;
            object.photo = item.profile_path ? `https://image.tmdb.org/t/p/original${item.profile_path}` : NO_PHOTO;
          }

          return object;
        });

        trends = trends.reduce((acc, current) => {
          const arr = acc.find(item => item.id === current.id);
          if (!arr) return acc.concat([current]);
          else return acc;
        }, []);

        trendsList[type] = trends;
      });
      return trendsList;
    } catch (error) {
      console.log(error.message);
    }
  },
  searchFor: async ({ type, query = '', page = 1 }) => {
    // https://api.themoviedb.org/3/search/movie?api_key=a395cd002a1dee61cd68a48ce0ff2b42&language=en-US&query={query}&include_adult=false&page=1
    // https://api.themoviedb.org/3/search/person?api_key=a395cd002a1dee61cd68a48ce0ff2b42&language=en-US&query={query}&include_adult=false&page=1
    // https://api.themoviedb.org/3/search/tv?api_key=a395cd002a1dee61cd68a48ce0ff2b42&language=en-US&query={query}&include_adult=false&page=1
    // const getDetails = type === 'person' ? tmdbHelpers.getPersonDetails : tmdbHelpers.getShowDetails;
    try {
      const response = await fetch(`${API_MAIN_URL}search/${type}${API_KEY}&language=en-US${query ? `&query=${query.toLowerCase()}` : ''}&page=${page}`);
      if (!response.ok)
        throw new Error(`No results for ${query} from server.`);
      const data = await response.json();

      const detailedProfiles = await Promise.all(data.results.map(async profile =>
        //person => person_id: any, type?: string
        //show => show_type: any, show_id: any
        await type === 'person' ? tmdbHelpers.getPersonDetails(profile.id) : tmdbHelpers.getShowDetails(type, profile.id)
      ));

      const results = detailedProfiles.reduce((acc, current) => {
        const arr = acc.find(item => item.id === current.id);
        if (!arr) return acc.concat([{ ...current, type: current.type === 'person' ? 'people' : current.type }]);
        else return acc;
      }, []);

      const pages = data.total_pages;
      return { pages, list: results };
    } catch (error) {
      console.log(error.message);
    }
  },
  getPath: (profile, type) => `/${type}/${profile.id}_${(profile[type !== 'person' ? 'title' : 'name']).toLowerCase().replace(/\s/g, '_')}`,
  // getPath: (profile, type) => `/${type}/${profile.id}`,
  getName: (path) => (
    path.substr(path.indexOf('_') + 1, path.length)
      .replace('_', " ")
      .split(' ')
      .map(word => word[0].toUpperCase() + word.substr(1))
      .join(' ')
  ),
  getFormatedDate: (d) => {
    const dateArr = d.split('-');
    const date = new Date(dateArr[0], dateArr[1] - 1, dateArr[2]);
    return `${date.toLocaleDateString('default', { month: "short" })} ${date.getDate()}, ${date.getFullYear()}`;
  }
};

export default tmdbHelpers;