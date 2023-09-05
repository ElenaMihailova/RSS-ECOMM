import { createElement } from './functions';
import '../../style/sass/blocks/modal.scss';

const modal = (): HTMLElement => {
  const bg = createElement({
    tagName: 'div',
    classNames: ['maintenance-modal'],
    parent: document.body,
  });

  const w = createElement({
    tagName: 'div',
    classNames: ['modal-content'],
    text: 'Доброго времени суток! Просим вас дать один день на немного допилить, не получилось уложиться к сожалению. Большое спасибо заранее!',
    parent: bg,
  });

  return bg;
};

export default modal;
