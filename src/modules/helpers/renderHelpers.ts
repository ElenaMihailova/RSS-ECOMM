const generateLink = (text: string, link: string): string => {
  return link === '#'
    ? `<li><a class="navigation__link titleMonserrat titleMonserrat--small" onclick="event.preventDefault();" href="${link}">${text}</a></li>`
    : `<li><a class="navigation__link titleMonserrat titleMonserrat--small" href="${link}">${text}</a></li>`;
};

export default generateLink;
