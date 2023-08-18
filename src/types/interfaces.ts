export interface AttrSet {
  [key: string]: string;
}

export interface ElementData {
  tagName: keyof HTMLElementTagNameMap;
  classNames?: string[];
  attributes?: AttrSet[];
  text?: string;
  html?: string;
  parent?: HTMLElement;
}

export interface FormItems {
  tagName: keyof HTMLElementTagNameMap;
  attributes?: AttrSet[];
  classNames: string[];
  options?: {
    text: string;
    attributes?: AttrSet[];
  }[];
  icon?: {
    className: string;
    attributes?: AttrSet[];
  };
}

export interface Data {
  [key: string]: string;
}
