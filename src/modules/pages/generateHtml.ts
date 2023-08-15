import { generateLink } from '../helpers/renderHelpers';
import { NavLink, FooterLinksType } from '../../types/nav.types';

const createMobilMenu = (linksHtml: string): string => {
  return `
    <nav>
      <div class="navbar">
        <div class="navbar__container">
          <input id='hamburger' class="hamburger" type="checkbox"/>
          <div class="hamburger-lines">
            <span class="line line1"></span>
            <span class="line line2"></span>
            <span class="line line3"></span>
          </div>
          <div class='navbar__wrapper menu' id="menu">
            <div class="input input--icon">
              <input id="search" type="text" name="Name" placeholder="SEARCH PRODUCTS" />
              <label for="search">
                <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                  <use xlink:href="./image/sprite.svg#search"></use>
                </svg>
              </label>
            </div>
            <ul class="menu__user">
              <li>
                <a href="#" class="login">
                  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                    <use xlink:href="./image/sprite.svg#person"></use>
                  </svg>
                  <p>USER PROFILE <span>We know you as a guest user</span></p>
                </a>
              </li>
              <li>
                <a href="#" class="corb">
                  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                    <use xlink:href="./image/sprite.svg#corb"></use>
                  </svg>
                  <p>YOUR BAG<span>(3) items have been added</span></p>
                </a>
              </li>
            </ul>
            <hr></hr>
            <ul class="menu__nav">
              ${linksHtml}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  `;
};

export const createHeader = (navLinks: NavLink[]): string => {
  const linksHtml = navLinks
    .map((link) => `<li><a class='titleMonserrat titleMonserrat--small' href="${link.href}">${link.text}</a></li>`)
    .join('');

  const mobilMenuHtml = createMobilMenu(linksHtml);

  const html = `
      <div class="header__wrapper">
        <div class="header__logo logo">
          <a class="logo__link" href="#">
            <svg class="logo__img" width="24" height="24" viewBox="0 0 24 25" aria-label="Logo.">
              <use xlink:href="./image/sprite.svg#logo"></use>
            </svg>
            <span>Brand Name</span>
          </a>
        </div>
        ${mobilMenuHtml}        
      </div>
    `;

  return html;
};

export const createFooter = ({
  collectionLinks = [],
  learnLinks = [],
  customerServiceLinks = [],
}: FooterLinksType): string => {
  const collectionHtml = collectionLinks.map((item) => generateLink(item.text, item.href)).join('');
  const learnHtml = learnLinks.map((item) => generateLink(item.text, item.href)).join('');
  const customerServiceHtml = customerServiceLinks.map((item) => generateLink(item.text, item.href)).join('');

  const html = `
  <div class="container">
  <nav class="footer__nav navigation">
    <div class="navigation__wrap">
      <h2 class="navigation__name titleMonserrat titleMonserrat--medium">
        Collections
      </h2>
      <ul class="navigation__list">
        ${collectionHtml}
      </ul>
    </div>
    <div class="navigation__wrap">
      <h2 class="navigation__name titleMonserrat titleMonserrat--medium">
        Learn
      </h2>
      <ul class="navigation__list">
        ${learnHtml}
      </ul>
    </div>
    <div class="navigation__wrap">
      <h2 class="navigation__name titleMonserrat titleMonserrat--medium">
        Customer Service
      </h2>
      <ul class="navigation__list">
        ${customerServiceHtml}
      </ul>
    </div>
    <div class="navigation__wrap">
      <h2 class="navigation__name titleMonserrat titleMonserrat--medium">Contact us</h2>
      <ul class="navigation__list">
        <li>
          <a class="navigation__link titleMonserrat titleMonserrat--small" href="#">
            <svg width="24" height="24" viewBox="0 0 24 25" aria-label="location">
              <use xlink:href="./image/sprite.svg#location"></use>
            </svg>
            пр. Независимости 28, Минск 220040, Беларусь</a
          >
        </li>
        <li>
          <a class="navigation__link titleMonserrat titleMonserrat--small" href="mailto:teashop@teashop.by">
            <svg width="24" height="24" viewBox="0 0 24 25" aria-label="email">
              <use xlink:href="./image/sprite.svg#mail"></use>
            </svg>
            teashop@teashop.by</a
          >
        </li>
        <li>
          <a class="navigation__link titleMonserrat titleMonserrat--small" href="tel:+375336041177">
            <svg width="24" height="24" viewBox="0 0 24 25" aria-label="email">
              <use xlink:href="./image/sprite.svg#call"></use>
            </svg>
            +375 33 604 11 77</a
          >
        </li>
      </ul>
    </div>
  </nav>
  </div>
    `;
  return html;
};
