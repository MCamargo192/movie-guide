import classes from './Gallery.module.css';
import Modal from '../Modal/Modal';
import { UilTimes } from '@iconscout/react-unicons'
import Carousel from '../Carousel/Carousel';

const Gallery = (props) => {
  const { images, type } = props;

  return (
    <Modal onClose={props.onClose} style={{ '--wv': `${90}vw`, '--hv': `${80}vh`, '--left': `${5}%`, '--top': `${10}%` }}>
      <div className={classes['close-btn']} onClick={props.onClose}>
        <UilTimes />
      </div>
      <Carousel {...{ images, type }} />
    </Modal>
  );
}

export default Gallery;