import { StarIcon, StarIcon as StarOutline } from '@heroicons/react/outline';
import { useState } from 'react';

const RatingStars = ({ value = 0, onChange, isEditable = false, size = 'h-6 w-6' }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center">
      {Array.from({ length: 5 }, (_, i) => {
        const rating = i + 1;
        return (
          <button
            key={i}
            type="button"
            onClick={() => isEditable && onChange(rating)}
            onMouseEnter={() => isEditable && setHover(rating)}
            onMouseLeave={() => isEditable && setHover(0)}
            className={`${
              rating <= (hover || value) ? 'text-yellow-400' : 'text-gray-300'
            } ${!isEditable ? 'cursor-default' : 'cursor-pointer'} transition-colors`}
            aria-label={`${rating} stars`}
          >
            {rating <= (hover || value) ? <StarIcon className={size} /> : <StarOutline className={size} />}
          </button>
        );
      })}
      <span className="ml-2 text-sm text-gray-600">({value})</span>
    </div>
  );
};

export default RatingStars;