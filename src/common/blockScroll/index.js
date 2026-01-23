import { isTouchscreen } from '../helpers';

// import './style.scss';

const BLOCKED_SCROLL_CLASS_NAME = 'block-scroll';

export function setScrollBarWidthListener() {
    return;
    if (window.scrollBarListener) {
        return;
    }

    const onResize = () => {
        const currentValue = document.documentElement.style.getPropertyValue('--scroll-bar-width');
        const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
        if (scrollBarWidth && currentValue !== `${scrollBarWidth}px`) {
            document.documentElement.style.setProperty('--scroll-bar-width', `${scrollBarWidth}px`);
        }
    };

    window.scrollBarListener = new ResizeObserver(onResize);
    window.scrollBarListener.observe(document.documentElement);
    onResize();
}

export const blockScroll = (className) => {
    document.documentElement.classList.add(BLOCKED_SCROLL_CLASS_NAME);
    if (className) {
        document.documentElement.classList.add(className);
    }
    if (!isTouchscreen) {
        window.lenis?.stop?.();
    }
};

export const unblockScroll = (className) => {
    document.documentElement.classList.remove(BLOCKED_SCROLL_CLASS_NAME);
    if (className) {
        document.documentElement.classList.remove(className);
    }
    if (!isTouchscreen) {
        window.lenis?.start();
    }
};