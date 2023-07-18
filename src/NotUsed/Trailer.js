import classes from './Trailer.module.css';
import Modal from '../UI/Modal/Modal';
import { UilTimes } from '@iconscout/react-unicons'

const Trailer = (props) => {
  const { show } = props;
  return (
    <Modal onClose={props.onClose} >
      <div className={classes['close-btn']} onClick={props.onClose}>
        <UilTimes />
      </div>
      <iframe
        className={classes.iframe}
        title={`${show.name} - ${show.trailer.name}`}
        width="872"
        height="490"
        src={show.trailer.link}
        frameborder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope;"
        allowfullscreen
      >
      </iframe>
    </Modal>
  );
}

export default Trailer;