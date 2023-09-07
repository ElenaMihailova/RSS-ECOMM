export type NavLink = {
  text: string;
  href: string;
  className?: string;
};

export type FooterLinks = {
  collectionLinks: NavLink[];
  learnLinks: NavLink[];
  customerServiceLinks: NavLink[];
};
