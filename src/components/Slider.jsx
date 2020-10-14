import React from 'react';
import Slide from '@farbenmeer/react-spring-slider';

const imageStyle = (src) => ({
  backgroundSize: 'cover',
  backgroundImage: `linear-gradient(0deg, rgba(34,34,34,0.5) 0%, rgba(255,255,255,0) 8%), url(${src})`,
  height: '100%',
  width: '100%'
});

const BulletComponent = ({ onClick, isActive }) => (
  <li>
    <div
      label="image slider button"
      tabIndex="0"
      role="button"
      onKeyDown={onClick}
      style={{
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        background: 'white',
        margin: '0 5px',
        opacity: !isActive && '0.75'
      }}
      onClick={onClick}
    />
  </li>
);

const Slider = ({ images }) => (
  <div className="slide">
    <Slide hasBullets BulletComponent={BulletComponent}>
      {images.map((image) => (
        <div
          key={image}
          draggable="false"
          style={imageStyle(image)}
          className="md:rounded-sm"
        />
      ))}
    </Slide>
  </div>
);

export default Slider;
