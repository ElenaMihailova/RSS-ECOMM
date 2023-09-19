import { LenaContributions, NastyaContributions, NikitaContributions } from '../../../assets/data/constants';
import PageView from '../../core/pageView';
import { createElement, createSvgElement } from '../../helpers/functions';
import './aboutUsPage.scss';

class AboutUsView extends PageView {
  constructor() {
    super();
    this.container.classList.add('about-us-page');
  }

  public render(): HTMLElement {
    const pageWrapper = createElement({
      tagName: 'div',
      classNames: ['about-us__wrapper'],
      parent: this.container,
    });

    createElement({
      tagName: 'h2',
      classNames: ['about-us__title'],
      text: 'OUR TEAM',
      parent: pageWrapper,
    });

    const personsContainer = createElement({
      tagName: 'div',
      classNames: ['about-us__persons'],
      parent: pageWrapper,
    });

    this.renderLena(personsContainer);
    this.renderNastya(personsContainer);
    this.renderNikita(personsContainer);

    createElement({
      tagName: 'div',
      classNames: ['about-us__logo'],
      html: createSvgElement('rss-link', 'rss-logo', '121', '45'),
      parent: pageWrapper,
    });

    return this.container;
  }

  private renderLena(parent: HTMLDivElement): HTMLElement {
    const container = createElement({
      tagName: 'div',
      classNames: ['about-us__person'],
      parent,
    });

    createElement({
      tagName: 'img',
      classNames: ['about-us__photo'],
      attributes: [{ src: './image/lena.jpeg' }],
      parent: container,
    });

    const infoBlock = createElement({
      tagName: 'div',
      classNames: ['about-us__info'],
      parent: container,
    });

    createElement({
      tagName: 'h3',
      classNames: ['about-us__name'],
      text: 'Elena Mihailova',
      parent: infoBlock,
    });

    const roleBlock = createElement({
      tagName: 'div',
      classNames: ['about-us__role'],
      parent: infoBlock,
    });

    createElement({
      tagName: 'span',
      classNames: ['about-us__role-name'],
      text: 'Team Lead',
      parent: roleBlock,
    });

    createElement({
      tagName: 'a',
      classNames: ['about-us__link'],
      text: 'ElenaMihailova',
      attributes: [{ href: `https://github.com/ElenaMihailova` }],
      parent: roleBlock,
    });

    const contributionBlock = createElement({
      tagName: 'div',
      classNames: ['about-us__contribution'],
      parent: infoBlock,
    });

    createElement({
      tagName: 'h4',
      classNames: ['about-us__contribution-title'],
      text: 'Contribution',
      parent: contributionBlock,
    });

    const contributionText = createElement({
      tagName: 'div',
      classNames: ['about-us__contributions'],
      parent: contributionBlock,
    });

    LenaContributions.forEach((item) => {
      createElement({
        tagName: 'span',
        classNames: ['about-us__contribution-item'],
        text: item,
        parent: contributionText,
      });
    });

    return container;
  }

  private renderNastya(parent: HTMLDivElement): HTMLElement {
    const container = createElement({
      tagName: 'div',
      classNames: ['about-us__person'],
      parent,
    });

    createElement({
      tagName: 'img',
      classNames: ['about-us__photo'],
      attributes: [{ src: './image/nastya.jpeg' }],
      parent: container,
    });

    const infoBlock = createElement({
      tagName: 'div',
      classNames: ['about-us__info'],
      parent: container,
    });

    createElement({
      tagName: 'h3',
      classNames: ['about-us__name'],
      text: 'Anastasiya Valkovich',
      parent: infoBlock,
    });

    const roleBlock = createElement({
      tagName: 'div',
      classNames: ['about-us__role'],
      parent: infoBlock,
    });

    createElement({
      tagName: 'span',
      classNames: ['about-us__role-name'],
      text: 'Developer',
      parent: roleBlock,
    });

    createElement({
      tagName: 'a',
      classNames: ['about-us__link'],
      text: 'nvalkovich',
      attributes: [{ href: `https://github.com/nvalkovich` }],
      parent: roleBlock,
    });

    const contributionBlock = createElement({
      tagName: 'div',
      classNames: ['about-us__contribution'],
      parent: infoBlock,
    });

    createElement({
      tagName: 'h4',
      classNames: ['about-us__contribution-title'],
      text: 'Contribution',
      parent: contributionBlock,
    });

    const contributionText = createElement({
      tagName: 'div',
      classNames: ['about-us__contributions'],
      parent: contributionBlock,
    });

    NastyaContributions.forEach((item) => {
      createElement({
        tagName: 'span',
        classNames: ['about-us__contribution-item'],
        text: item,
        parent: contributionText,
      });
    });

    return container;
  }

  private renderNikita(parent: HTMLDivElement): HTMLElement {
    const container = createElement({
      tagName: 'div',
      classNames: ['about-us__person'],
      parent,
    });

    createElement({
      tagName: 'img',
      classNames: ['about-us__photo'],
      attributes: [{ src: './image/nikita.jpeg' }],
      parent: container,
    });

    const infoBlock = createElement({
      tagName: 'div',
      classNames: ['about-us__info'],
      parent: container,
    });

    createElement({
      tagName: 'h3',
      classNames: ['about-us__name'],
      text: 'Nikita Yakubchik',
      parent: infoBlock,
    });

    const roleBlock = createElement({
      tagName: 'div',
      classNames: ['about-us__role'],
      parent: infoBlock,
    });

    createElement({
      tagName: 'span',
      classNames: ['about-us__role-name'],
      text: 'Developer',
      parent: roleBlock,
    });

    createElement({
      tagName: 'a',
      classNames: ['about-us__link'],
      text: 'iamnkt',
      attributes: [{ href: `https://github.com/iamnkt` }],
      parent: roleBlock,
    });

    const contributionBlock = createElement({
      tagName: 'div',
      classNames: ['about-us__contribution'],
      parent: infoBlock,
    });

    createElement({
      tagName: 'h4',
      classNames: ['about-us__contribution-title'],
      text: 'Contribution',
      parent: contributionBlock,
    });

    const contributionText = createElement({
      tagName: 'div',
      classNames: ['about-us__contributions'],
      parent: contributionBlock,
    });

    NikitaContributions.forEach((item) => {
      createElement({
        tagName: 'span',
        classNames: ['about-us__contribution-item'],
        text: item,
        parent: contributionText,
      });
    });

    return container;
  }
}

export default AboutUsView;
