const mobileMenuTemplate = (linksHtml: string): string => `
<div class="navbar__mobil">
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
        <a href="login.html" class="login">
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
`;

export default mobileMenuTemplate;
