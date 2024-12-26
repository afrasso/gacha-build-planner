import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface ImageWithTooltipProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  tooltipText?: string;
}

const ImageWithTooltip: React.FC<ImageWithTooltipProps> = ({ tooltipText, ...props }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [tooltipStyle, setTooltipStyle] = useState({});
  const imageRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLSpanElement>(null);

  const updateTooltipPosition = () => {
    if (imageRef.current && tooltipRef.current) {
      const imageBounds = imageRef.current.getBoundingClientRect();
      const tooltipBounds = tooltipRef.current.getBoundingClientRect();

      // In a perfect world, the tooltip would be positioned centered below the image.
      let imgCenter = imageBounds.left + imageBounds.width / 2;
      // Calculate the left position of the tooltip relative to the location of the image.
      let tooltipLeft = imgCenter - tooltipBounds.width / 2 - imageBounds.left;
      // Calculate the top position of the tooltip relative to the location of the image.
      let tooltipTop = imageBounds.height;

      // Adjust the horizontal position if off-screen to the left.
      if (tooltipLeft + imageBounds.left < 10) {
        tooltipLeft = 10 - imageBounds.left;
      }
      // Adjust the horizontal position if off-screen to the right.
      if (tooltipLeft + tooltipBounds.width > window.innerWidth - 10) {
        tooltipLeft = window.innerWidth - tooltipBounds.width - 10;
      }

      setTooltipStyle({
        left: `${tooltipLeft}px`,
        top: `${tooltipTop}px`,
      });
    }
  };

  useEffect(() => {
    if (isHovered) {
      updateTooltipPosition();
      window.addEventListener("scroll", updateTooltipPosition);
      window.addEventListener("resize", updateTooltipPosition);
    }

    return () => {
      window.removeEventListener("scroll", updateTooltipPosition);
      window.removeEventListener("resize", updateTooltipPosition);
    };
  }, [isHovered]);

  return (
    <div
      className="relative inline-block"
      ref={imageRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Image {...props} />
      {tooltipText && isHovered && (
        <span
          ref={tooltipRef}
          className="absolute bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10 pointer-events-none transition-opacity duration-300"
          style={tooltipStyle}
        >
          {tooltipText}
        </span>
      )}
    </div>
  );
};

export default ImageWithTooltip;
