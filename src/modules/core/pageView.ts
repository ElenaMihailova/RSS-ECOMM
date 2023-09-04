import { Icon, InputBtn, SelectOption } from '../../types/interfaces';
import { createElement, createSvgElement } from '../helpers/functions';

abstract class PageView {
  protected container: HTMLElement;

  constructor() {
    this.container = document.createElement('div');
  }

  public render(): HTMLElement {
    return this.container;
  }

  public addSelectOptions(selectElement: HTMLElement, options: SelectOption[]): void {
    options.forEach((option) => {
      createElement({
        tagName: 'option',
        attributes: option.attributes,
        text: option.text,
        parent: selectElement,
      });
    });
  }

  public addInputIcon(parentElement: HTMLElement, iconData: Icon): void {
    createElement({
      tagName: 'div',
      classNames: ['input-icon', `${iconData.containerClassName}`],
      html: createSvgElement(iconData.className, iconData.id),
      attributes: iconData.attributes,
      parent: parentElement,
    });
  }

  public addInputBtn(parentElement: HTMLElement, inputBtnData: InputBtn): void {
    createElement({
      tagName: 'button',
      classNames: ['input-btn', `${inputBtnData.className}`],
      text: inputBtnData.text,
      attributes: inputBtnData.attributes,
      parent: parentElement,
    });
  }

  public runHandlers(): void {}
}

export default PageView;
