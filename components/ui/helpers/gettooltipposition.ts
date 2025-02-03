export const updateTooltipPosition = ({
  elementBounds,
  tooltipBounds,
}: {
  elementBounds: DOMRect;
  tooltipBounds: DOMRect;
}) => {
  // In a perfect world, the tooltip would be positioned centered below the element.
  const imgCenter = elementBounds.left + elementBounds.width / 2;
  // Calculate the left position of the tooltip relative to the location of the image.
  let tooltipLeft = imgCenter - tooltipBounds.width / 2 - elementBounds.left;
  // Calculate the top position of the tooltip relative to the location of the image.
  const tooltipTop = elementBounds.height;

  // Adjust the horizontal position if off-screen to the left.
  if (tooltipLeft + elementBounds.left < 10) {
    tooltipLeft = 10 - elementBounds.left;
  }
  // Adjust the horizontal position if off-screen to the right.
  if (tooltipLeft + tooltipBounds.width > window.innerWidth - 10) {
    tooltipLeft = window.innerWidth - tooltipBounds.width - 10;
  }

  return { left: tooltipLeft, top: tooltipTop };
};
