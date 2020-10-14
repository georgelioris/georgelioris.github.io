import React from 'react';
import Transition from './Transition';

const Section = ({ className, children }) => {
  const classNames = ['max-w-3xl mx-auto', className]
    .filter(Boolean)
    .join(' ')
    .trim();
  return (
    <div className={classNames}>
      <Transition>{children}</Transition>
    </div>
  );
};

export default Section;
