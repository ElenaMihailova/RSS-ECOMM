export const addHTML = (tag: string, classNames: string[], html: string): HTMLElement => {
  const element = document.createElement(tag);
  element.classList.add(...classNames);
  element.innerHTML = html;
  return element;
};

export const generateLink = (text: string, link: string): string => {
  return `
      <li>
          <a class="navigation__link titleMonserrat titleMonserrat--small" href="${link}">${text}</a>
      </li>
  `;
};
