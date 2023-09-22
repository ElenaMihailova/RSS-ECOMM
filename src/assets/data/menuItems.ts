const menuItems = [
  {
    href: '',
    classNames: ['profile', 'profile--mobile'],
    svgHref: '../image/sprite.svg#person',
    text: 'USER PROFILE',
  },
  {
    href: '',
    classNames: ['login', 'login--mobile'],
    contents: [
      {
        svgHref: '../image/sprite.svg#person',
        text: 'LOGIN <span>We know you as a guest user</span>',
      },
      {
        svgHref: '../image/sprite.svg#logout',
        text: 'You don even want a cup of tea?',
        divClass: 'visually-hidden',
      },
    ],
  },
  {
    href: '',
    classNames: ['registration', 'registration--mobile'],
    svgHref: '../image/sprite.svg#add_person',
    text: 'USER REGISTRATION',
  },
  {
    href: '',
    classNames: ['cart', 'cart--mobile'],
    svgHref: '../image/sprite.svg#cart',
    text: 'YOUR CART<span>(<span class="cart-quantity--mobile">0</span>) items have been added</span>',
  },
];

export default menuItems;
