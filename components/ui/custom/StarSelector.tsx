"use client";

import { Star } from "lucide-react";
import React, { useState } from "react";

interface StarSelectorProps {
  color?: string;
  max: number;
  onChange?: (value: number) => void;
  size?: number;
  value: number;
}

const StarSelector: React.FC<StarSelectorProps> = ({ color = "gold", max, onChange, size = 24, value }) => {
  const [hover, setHover] = useState(0);

  const handleClick = (index: number) => {
    const newValue = index + 1;
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleHover = (hoverValue: number) => {
    if (onChange) {
      setHover(hoverValue);
    }
  };

  return (
    <div className="flex items-center">
      {[...Array(max)].map((_, index) => {
        const starValue = index + 1;
        return (
          <Star
            aria-label={`Rate ${starValue} star${starValue !== 1 ? "s" : ""}`}
            className={`${onChange ? "cursor-pointer" : ""} transition-colors ${
              starValue <= (hover || value) ? "text-" + color : "text-gray-300"
            }`}
            fill={starValue <= (hover || value) ? color : "none"}
            key={index}
            onClick={() => handleClick(index)}
            onMouseEnter={() => handleHover(starValue)}
            onMouseLeave={() => handleHover(0)}
            size={size}
          />
        );
      })}
    </div>
  );
};

export default StarSelector;
