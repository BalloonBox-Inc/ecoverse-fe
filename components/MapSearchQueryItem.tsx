import { Place } from '@services/map';
import React from 'react';

type Props = Omit<Place, 'id'>;

export default function MapSearchQueryItem({ place, center }: Props) {
  const handleClick = () => {
    console.log(center);
  };
  return (
    <button className={styles.button} onClick={handleClick}>
      {place}
    </button>
  );
}

const styles = {
  button:
    'w-full btn btn-secondary border-0 bg-transparent text-left justify-start h-fit py-4',
};
