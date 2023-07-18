import classes from './Slider.module.css';
import { useNavigate } from 'react-router-dom';
import helpers from '../../Helpers/tmdbHelper';

const { getPath } = helpers;

const Slider = (props) => {
  const navigate = useNavigate();

  return (
    <div className={classes.slider} id='content'>
      <ul className={classes['slider-list']}>
        {props.items.map((item, index) => (
          <li key={index} className={classes['slider-item']} onClick={e => { navigate(getPath(item, item.type)) }}>
            <img className={classes['slider-img']} src={item.type === 'person' ? item.photo : item.poster} alt={item.type === 'person' ? item.name : item.title} style={props.style} />
            {item.type === 'person' && <div className={`${classes['slider-caption']} ${classes.person}`}>{item.name}
            </div>}
            {item.type === 'person' && <div className={`${classes['slider-caption']} ${classes.character}`}>{item.character.endsWith(' (voice)') ? item.character.replace(' (voice)', '') : item.character}
            </div>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Slider;