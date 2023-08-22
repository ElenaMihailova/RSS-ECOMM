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
        <div class="tooltip ">
          <p>Search</p>
      </div>
      </a>
    </li>
    <li>
      <a href="#" class="corb">
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
          <use xlink:href="./image/sprite.svg#corb"></use>
        </svg>
        <div class="tooltip ">
          <p>Corb</p>
      </div>
      </a>
    </li>
    <li>
      <a href="registration.html" class="registration">
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
          <use xlink:href="./image/sprite.svg#add_person"></use>
        </svg>
        <div class="tooltip ">
          <p>Sigh up</p>
      </div>
     </a>
    </li>
    <li>
      <a href="" class="login login--desktop">
        <svg class="login-svg" width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
          <use xlink:href="./image/sprite.svg#person"></use>
        </svg>
        <svg class="logout-svg visually-hidden" width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
          <use xlink:href="./image/sprite.svg#logout"></use>
        </svg>
        <div class="tooltip tooltip--login">
          <p>Log in</p>
        </div>
      </a>
    </li>
  </ul>
</div>
`;

export default desktopMenuTemplate;
