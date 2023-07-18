import classes from './CatalogueHeader.module.css';

const CatalogueHeader = (props) => (
  <div>
    <ul className={classes.container__bar}>
      {props.list.map((item, index) => <li key={index} className={`${classes['list-item']} ${props.active === item ? classes.active : ''}`} onClick={() => props.onClick(item)}>{item}</li>)}
    </ul>
  </div>
);

export default CatalogueHeader;