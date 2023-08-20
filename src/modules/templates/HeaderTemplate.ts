const headerTemplate = (mobilMenuHtml: string, desktopMenu: string): string => `
<div class="header__wrapper">
        <div class="header__logo logo">
          <a class="logo__link" href="index">
            <svg class="logo__img" width="24" height="24" viewBox="0 0 24 25" aria-label="Logo.">
              <use xlink:href="./image/sprite.svg#logo"></use>
            </svg>
            <span>Brand Name</span>
          </a>
        </div>
        <nav class="navbar">
          ${mobilMenuHtml}
          ${desktopMenu}
        </nav>        
      </div>`;

export default headerTemplate;
