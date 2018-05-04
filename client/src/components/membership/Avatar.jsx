import React, {Component} from 'react';
import PropTypes from 'prop-types';

// A Notification component
const Avatar = (props) => {
    const {member, color, fgColor, size} = props;
    const imageUrl =  member.profilePhoto && member.profilePhoto.thumbnailURL ? member.profilePhoto.thumbnailURL : null;

    const stringAsciiCodeSum = (value) => {
        return [...value].map(letter => letter.charCodeAt(0)).reduce((current, previous) => previous + current);
    }

    const getRandomColor = (value, colors = ['#d73d32','#7e3794','#4285f4','#67ae3f','#d61a7f','#ff4080']) => {
        // if no value is passed, always return transparent color 
        if(!value)  return 'transparent';

        // value based random color index
        // the reason we don't just use a random number is to make sure that
        // a certain value will always get the same color assigned given
        // a fixed set of colors

        const sum = stringAsciiCodeSum(value);
        const colorIndex = (sum % colors.length);
        return colors[colorIndex];
    }

    const renderAsImage = () => {
        
        const alt = `${member.firstName} ${member.lastName}`;
        const imageStyle = {
            maxWidth: '100%',
            width: size,
            height: size,
            borderRadius: 500
        };
        return (
            <img width={size}
                height={size}
                style={imageStyle}
                src={imageUrl}
                alt={alt} />
        );
    }

    const renderAsText = () => {
        
        const textSizeRatio = 3;
        const name = `${member.firstName || ''} ${member.lastName || ''}`;
        const color = getRandomColor(name);
        const initials = name.split(' ').map(n => n[0]).reduce((a, c) => a + (c || ''));
        const initialsStyle = {
            width: size,
            height: size,
            font: Math.floor(size / textSizeRatio) + 'px Helvetica, Arial, sans-serif',
            lineHeight: size + 'px', // yes, px suffix is needed on lineHeight
            textAlign: 'center',
            textTransform: 'uppercase',
            color: fgColor,
            background: color,
            borderRadius: '100%' 
        };
        return (
            <div style={initialsStyle}>
                {initials}
            </div>
        );
    }

   
    return (
        <div style={{display: 'inline-block', width: '40px', height: '40px', borderRadius: '500px', position: 'absolute', top: '16px', left: '16px'}}>
            {imageUrl ? renderAsImage() : renderAsText()}
        </div>
    )
};

Avatar.displayName = 'Avatar'
Avatar.propTypes = {
    fgColor: PropTypes.string,
    color: PropTypes.string,
    size: PropTypes.number,
    member: PropTypes.object
}

Avatar.defaultProps = {
    className: 'sb-avatar',
    fgColor: '#FFF',
    size: 44
}

export default Avatar;


