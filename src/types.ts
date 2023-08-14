export interface RouteAction {
  path: string;
  callback: (res: string) => void;
}

export interface UserRequest {
  path: string;
  resource?: string;
}
