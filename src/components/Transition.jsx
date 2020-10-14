import React, { useEffect, useState } from 'react';
import { useTransition, animated } from 'react-spring';

const Transition = ({ children }) => {
  const [show, set] = useState(false);
  const transitions = useTransition(show, null, {
    from: { position: 'absolute', opacity: 0 },
    enter: { opacity: 1, position: 'relative' },
    leave: { opacity: 0 }
  });

  useEffect(() => {
    set(true);
    return () => {
      set(false);
    };
  }, []);

  return transitions.map(
    ({ item, key, props }) =>
      item && (
        <animated.div style={props} key={key}>
          {children}
        </animated.div>
      )
  );
};

export default Transition;
