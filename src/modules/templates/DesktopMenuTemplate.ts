const desktopMenuTemplate = (linksHtml: string): string => `
<div class="navbar__menu menu menu--desktop">
  <ul class="menu__nav menu__nav--desktop">
    ${linksHtml}
  </ul>
  <ul class="menu__user menu__user--desktop">
  <!-- TODO href -->
    <li>
      <a href="javascript:void(0)">
        <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
          <use xlink:href="./image/sprite.svg#search"></use>
        </svg>
        <div class="tooltip ">
          <p>Search</p>
      </div>
      </a>
    </li>
    <li>
      <a href="javascript:void(0)">
        <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
          <use xlink:href="./image/sprite.svg#card"></use>
        </svg>
        <div class="tooltip ">
          <p>Card</p>
      </div>
      </a>
    </li>
    <li>
      <a href="registration" class="registration registration--desktop">
        <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
          <use xlink:href="./image/sprite.svg#add_person"></use>
        </svg>
        <div class="tooltip ">
          <p>Sigh up</p>
      </div>
     </a>
    </li>
    <li>
      <a href="login" class="login login--desktop">
        <svg class="login-svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
          <use xlink:href="./image/sprite.svg#person"></use>
        </svg>
        <svg class="logout-svg visually-hidden" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
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
