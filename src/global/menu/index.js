import { animate, stagger } from "motion";
import { blockScroll, unblockScroll } from "../../common/blockScroll";

import './style.scss';

export const useMenu = () => {
    const button = document.querySelector('.menu-button');
    const wrapper = document.querySelector('.menu-wrapper');
    const menu = document.querySelector('.menu');

    if (!menu || !button) {
        return;
    }

    const links = menu.querySelectorAll('a');
    const menuLinks = menu.querySelectorAll('.menu__link');
    const menuLinkLabels = [...menuLinks].map(link => link.firstElementChild);

    const MENU_OPENED_CN = 'menu-opened';

    let menuHeight = 0;
    let isOpened = false;
    let timeline = null;

    const menuResizeObserver = new ResizeObserver(([{ contentRect }]) => {
        menuHeight = contentRect.height;
        if (isOpened) {
            animate(wrapper, { height: menuHeight });
        }
    });

    menuResizeObserver.observe(menu);
    button.addEventListener('click', handleButtonClick);
    links.forEach((link) => {
        link.addEventListener('click', close);
    });
    animate(menuLinkLabels, { transform: 'translateY(-120%)' });

    return () => {
        button.removeEventListener('click', handleButtonClick);
        links.forEach((link) => {
            link.removeEventListener('click', close);
        });
    }

    function handleButtonClick(event) {
        event.stopPropagation();
        if (isOpened) {
            close();
        } else {
            open();
        }
    }

    function open() {
        isOpened = true;
        clearTimeline();
        blockScroll(MENU_OPENED_CN);

        timeline = 
            animate(menu, { display: 'block' })
            .then(() => {
                animate(wrapper, { height: menuHeight });
                animate(menuLinkLabels, { transform: 'translateY(0%)' }, { delay: stagger(0.05, { startDelay: 0 }) });
            });
    }

    function close() {
        isOpened = false;
        clearTimeline();

        timeline = 
            animate(wrapper, { height: 0 })
            .then(() => {
                animate(menu, { display: 'none' });
            }).then(() => {
                unblockScroll(MENU_OPENED_CN);
                animate(menuLinkLabels, { transform: 'translateY(-120%)' });
            });
    }

    function showCloseIcon() {
        button.classList.add('menu-btn--opened');
    }

    function showOpenIcon() {
        button.classList.remove('menu-btn--opened');
    }

    function clearTimeline() {
        timeline?.stop?.();
    }
};
