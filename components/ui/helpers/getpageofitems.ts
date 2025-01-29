export const getPageOfItems = <T>({
  currentPage,
  items,
  pageSize,
}: {
  currentPage: number;
  items: T[];
  pageSize: number;
}) => {
  const firstItemIndex = currentPage * pageSize;
  const lastItemIndex = (currentPage + 1) * pageSize;
  return items.slice(firstItemIndex, lastItemIndex);
};
