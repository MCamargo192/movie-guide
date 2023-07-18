import classes from './Links.module.css';

import { UilLinkH, UilFacebook, UilInstagram, UilTwitterAlt, UilPlayCircle, UilCameraPlus } from '@iconscout/react-unicons';

const Links = props => {
    const { homepage, socialMedia, trailer } = props.item;
    const links = [];

    for (const key in socialMedia) {
        let component = '';
        if (key === 'facebook')
            component = <UilFacebook />;
        if (key === 'instagram')
            component = <UilInstagram />;
        if (key === 'twitter')
            component = <UilTwitterAlt />;

        links.push({
            href: socialMedia[key],
            component
        })
    }

    if (homepage)
        links.push({
            href: homepage,
            component: <UilLinkH />
        });
    if (trailer && trailer.links)
        links.push({
            href: trailer.link,
            component: <UilPlayCircle />
        });

    return (
        <div className={classes.media}>
            {links && links.map((link, index) => (
                <div key={index} className={`${classes['external-link']} ${classes['media-link']}`} >
                    <a href={link.href} target='_blank' className={classes['page-link']} rel="noreferrer">
                        {link.component}
                    </a>
                </div>
            ))}
            {props.hasGallery && <div className={`${classes['external-link']} ${classes['media-link']}`} onClick={props.onClose}>
                <UilCameraPlus />
            </div>}

        </div>
    )
};

export default Links;