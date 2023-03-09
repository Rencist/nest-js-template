export interface FilterQuery {
  [key: string | number]: {
    [key: string | number]: string | number | FilterQuery;
  };
}

export interface Extra {
  where: {
    OR: FilterQuery[];
    [key: string]: unknown;
  };
  [key: string]: unknown;
}
