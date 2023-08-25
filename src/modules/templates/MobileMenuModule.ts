const mobileMenuTemplate = (linksHtml: string): string => `
<div class="navbar__mobil">
  <div class="navbar__container">
    <input id='hamburger' class="hamburger" type="checkbox" />
    <div class="hamburger-lines">
      <span class="line line1"></span>
      <span class="line line2"></span>
      <span class="line line3"></span>
    </div>
    <div class='navbar__wrapper menu' id="menu">
      <div class="input input--icon">
        <input id="search" type="text" name="Name" placeholder="SEARCH PRODUCTS" />
        <label for="search">
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
            <use xlink:href="./image/sprite.svg#search"></use>
          </svg>
        </label>
      </div>
      <ul class="menu__user">
        <li>
          <div>
            <a  href="login" class="login login--mobile">
              <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                <use xlink:href="./image/sprite.svg#person"></use>
              </svg>
              <p>USER PROFILE <span>We know you as a guest user</span></p>
          </div>
          <div class="visually-hidden">
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
              <use xlink:href="./image/sprite.svg#logout"></use>
            </svg>
            <p>You don't even want a cup of tea?</p>
          </div>
          </a>
        </li>
        <li>
        <div>
          <a href="registration" class="registration registration--mobile">
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
              <use xlink:href="./image/sprite.svg#add_person"></use>
            </svg>
            <p>USER REGISTRATION</p>
          </a>
        </div>
        </li>
        <li>
          <a href="javascript:void(0)">
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
              <use xlink:href="./image/sprite.svg#card"></use>
            </svg>
            <p>YOUR BAG<span>(3) items have been added</span></p>
          </a>
        </li>
      </ul>
      <hr>
      </hr>
      <ul class="menu__nav">
        ${linksHtml}
      </ul>
    </div>
  </div>
</div>
`;

export default mobileMenuTemplate;
