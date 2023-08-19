export type RouteAction = {
  path: string;
  callback: () => void;
};

export type UserRequest = {
  path: string;
  resource?: string;
};

export interface HTMLElementTagNameMap {
  div: HTMLDivElement;
  button: HTMLButtonElement;
  h1: HTMLHeadingElement;
  span: HTMLSpanElement;
  p: HTMLParagraphElement;
  input: HTMLInputElement;
  img: HTMLImageElement;
  table: HTMLTableElement;
  tr: HTMLTableRowElement;
  th: HTMLTableCellElement;
  td: HTMLTableCellElement;
  a: HTMLAnchorElement;
}

export interface AttrSet {
  [key: string]: string;
}

export interface Data {
  [key: string]: string;
}
