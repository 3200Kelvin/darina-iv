import './style.scss';

export const useFlippingLinks = () => {
    const links = document.querySelectorAll('.flipping-link');

    links.forEach(link => {
        const text = link.firstElementChild;
        const label = text.textContent.trim();
        text.setAttribute('data-label', label);
    });
};
