const desktopMenuTemplate = (linksHtml: string): string => `
<div class="navbar__menu menu menu--desktop">
  <ul class="menu__nav menu__nav--desktop">
    ${linksHtml}
  </ul>
  <ul class="menu__user menu__user--desktop">
    <li>
      <a href="#" class="search">
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
          <use xlink:href="./image/sprite.svg#search"></use>
        </svg>
      </a>
    </li>
    <li>
      <a href="login.html" class="login">
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
          <use xlink:href="./image/sprite.svg#person"></use>
        </svg>
      </a>
    </li>
    <li>
      <a href="#" class="corb">
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
          <use xlink:href="./image/sprite.svg#corb"></use>
        </svg>
      </a>
    </li>
  </ul>
</div>
`;

export default desktopMenuTemplate;
