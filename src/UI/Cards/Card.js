import classes from './Card.module.css';
import { useNavigate } from 'react-router-dom';
import CardRate from './CardRate';
import helpers from '../../Helpers/tmdbHelper';
const { getPath } = helpers;

const Card = (props) => {
    const navigate = useNavigate();
    const { item, type } = props;
    const pathType = type === 'people' ? 'person' : type;
    const onClickFunc = props.onZoom || (e => { navigate(getPath(item, pathType)) });
    const isShow = type !== 'people';

    const profile = {
        id: item.id,
        src: isShow ? item.poster : item.photo,
        name: isShow ? item.title : item.name
    }

    if (isShow)
        profile.rate = item.rate;

    return (
        <div key={profile.id} className={classes.card} style={props.style} onClick={onClickFunc}>
            <img className={classes.cardImg} src={profile.src} alt={item.name} style={props.style} />
            {!isShow && <div className={classes.caption}><p>{item.name}</p></div>}
            {isShow && <CardRate rate={+profile.rate} size={props.size} />}
        </div>
    );
};

export default Card;