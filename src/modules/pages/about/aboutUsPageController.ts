import { getElement, getElementCollection } from '../../helpers/functions';
import Router from '../../router/router';

class AboutController {
  private router: Router;

  constructor(router: Router) {
    this.router = router;
    this.runHandlers();
  }

  private runHandlers(): void {
    const rssLink = getElement('.rss-link');
    rssLink.addEventListener('click', () => {
      window.open('https://rs.school/', '_blank');
    });

    const personalLinks = getElementCollection('.about-us__link');
    personalLinks.forEach((link) => {
      link.addEventListener('click', (e: Event) => {
        e.preventDefault();
        const linkHtml = link as HTMLAnchorElement;
        window.open(`${linkHtml.href}`, '_blank');
      });
    });
  }
}

export default AboutController;
