export type RouteAction = {
  path: string;
  callback: () => void;
};

export type UserRequest = {
  path: string;
  resource?: string;
};
