import classes from './Cards.module.css';
import Card from "./Card";

const Cards = ({ grid, list, type, scroll = true }) => (
    <div className={`${classes.container} ${grid && classes.grid} ${scroll && classes.scroll}`}>
        {list.map((item, index) => <Card key={index} item={item} type={type === 'people' ? type : item.type} style={{ '--width': `${150}px`, '--bord': `${6}px` }} size={30} />)}
    </div>
);

export default Cards;