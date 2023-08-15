export const addHTML = (tag: string, classNames: string[], html: string): void => {
  const root = document.createElement(tag);
  root.classList.add(...classNames);
  root.innerHTML = html;
  document.body.appendChild(root);
};

export const generateLink = (text: string, link: string): string => {
  return `
      <li>
          <a class="navigation__link titleMonserrat titleMonserrat--small" href="${link}">${text}</a>
      </li>
  `;
};
