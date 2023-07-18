import { useState, useEffect } from 'react';
import { UilAngleLeftB, UilAngleRightB } from '@iconscout/react-unicons'
import classes from './Carousel.module.css';

const Carousel = (props) => {
  const { images, type } = props

  const [currentIndex, setCurrentIndex] = useState(0)
  const [length, setLength] = useState(images.length)

  useEffect(() => { setLength(images.length) }, [images])

  const next = () => {
    if (currentIndex < (length - 1)) {
      setCurrentIndex(prevState => prevState + 1)
    }
  }

  const prev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prevState => prevState - 1)
    }
  }

  return (
    <div className={classes['carousel-container']}>
      <div className={classes['carousel-wrapper']}>
        {currentIndex > 0 && <div className={classes['left-arrow']} onClick={prev}>
          <UilAngleLeftB />
        </div>}
        <div className={classes['carousel-content-wrapper']}>
          <div
            className={classes['carousel-content']}
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
            {images.map((image, index) => <img key={index} src={type === 'person' ? image : image.path} alt={index} className={classes['carousel-img']} />)}
          </div>
        </div>
        {currentIndex < (length - 1) && <div className={classes['right-arrow']} onClick={next}>
          <UilAngleRightB />
        </div>}
      </div>
    </div>
  )
}

export default Carousel