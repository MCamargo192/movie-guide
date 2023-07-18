import { Fragment } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

import Catalogue from '../Pages/Catalogue/Catalogue';
import Show from '../Pages/Details/Show';
import Person from '../Pages/Details/Person';
import Home from '../Pages/Home/Home';
import Search from '../Pages/Search/Search';
import Profile from '../Pages/Profile/Profile';


// import People from './People';
// import Person from './Person';
// import Content from './Content';
// import Movie from './Movie';
// import Search from './Search';
// import Recommendations from './RelatedMovies';
// import NotFound from './NotFound';

const Router = () => (
    <Fragment>
        <Routes>
            <Route exact path='/' element={<Navigate replace to="/home" />} />
            <Route exact path='/home' element={<Home />} />
            <Route exact path='/movies' element={<Catalogue catalogue={'movie'} />} />
            <Route exact path='/tv' element={<Catalogue catalogue={'tv'} />} />
            <Route exact path='/people' element={<Catalogue catalogue={'people'} />} />
            <Route path='/person/:id' element={<Person />} />
            <Route path='/:type/:id' element={<Show />} />
            <Route exact path='/search' element={<Search />} />
            <Route exact path='/profile' element={<Profile />} />

            {/* <Route exact path='/' render={() => (<Redirect to='/popular' />)} />
            <Route exact path='/people' render={() => (<Content people={true} caption={true} />)} />
            <Route exact path='/popular' render={() => (<Content movieType={'popular'} />)} />
            <Route exact path='/now_playing' render={() => (<Content movieType={'now_playing'} />)} />
            <Route exact path='/upcoming' render={() => (<Content movieType={'upcoming'} />)} />
            <Route exact path='/top_rated' render={() => (<Content movieType={'top_rated'} />)} />
            <Route path='/search' render={props => (<Search query={props.location.search} />)} />
            <Route path='/movie/:id' render={props => (<Movie id={props.match.params.id} />)} />
            <Route path='/person/:id' render={props => (<Person id={props.match.params.id} />)} />
            <Route render={() => (<NotFound />)} /> */}
        </Routes>
    </Fragment >
);

export default Router;