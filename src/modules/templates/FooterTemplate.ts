const footerTemplate = (collectionHtml: string, learnHtml: string, customerServiceHtml: string): string => `
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
    <div class="navigation__wrap" id="contact">
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

export default footerTemplate;
