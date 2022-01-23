export type Fellowship = "founders" | "angels" | "writers";
export type Paginated<T, U> = {
  edges: {
    node: T;
  }[];
  pageInfo: {
    endCursor: U;
    hasNextPage: boolean;
  };
};
export type NewsCursor = [number, number, number];