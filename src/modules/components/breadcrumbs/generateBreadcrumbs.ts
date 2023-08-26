import { BreadcrumbItem } from './breadcrumbItem';

export default function generateBreadcrumbs(links: BreadcrumbItem[]): string {
  let breadcrumbsHTML = `
    <nav aria-label="breadcrumbs" class="breadcrumbs container">
      <ol class="breadcrumbs__list">`;
  links.forEach((link, index) => {
    if (!link.href) {
      breadcrumbsHTML += `
      <li class="breadcrumbs__link">
        ${link.text}
      </li>`;
    } else {
      breadcrumbsHTML += `
      <li>
        <a class="breadcrumbs__link" href="${link.href}">${link.text}</a>
      </li>`;
    }

    if (index !== links.length - 1) {
      breadcrumbsHTML += `
        <li>/</li>`;
    }
  });

  breadcrumbsHTML += '</ol></nav>';

  return breadcrumbsHTML;
}
