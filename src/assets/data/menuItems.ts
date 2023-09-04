const menuItems = [
  {
    href: 'login',
    classNames: ['login', 'login--mobile'],
    contents: [
      {
        svgHref: './image/sprite.svg#person',
        text: 'USER PROFILE <span>We know you as a guest user</span>',
      },
      {
        svgHref: './image/sprite.svg#logout',
        text: 'You don even want a cup of tea?',
        divClass: 'visually-hidden',
      },
    ],
  },
  {
    href: 'registration',
    classNames: ['registration', 'registration--mobile'],
    svgHref: './image/sprite.svg#add_person',
    text: 'USER REGISTRATION',
  },
  {
    href: '#',
    classNames: [],
    svgHref: './image/sprite.svg#card',
    text: 'YOUR BAG<span>(3) items have been added</span>',
  },
];

export default menuItems;
