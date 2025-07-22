import React from 'react';
import Spinner from '../../assets/images/spinner.svg';

export const Loading = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Spinner />
    </div>
  );
};
