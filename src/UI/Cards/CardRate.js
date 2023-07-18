import classes from './CardRate.module.css';

const MovieRate = (props) => (
    <div className={classes.chart} style={{ '--value': `${props.rate * 10}%`, '--size': `${props.size}px` }}>
        <p>{Number.isInteger(props.rate) ? props.rate : props.rate.toFixed(1)}</p>
    </div>
);

export default MovieRate;