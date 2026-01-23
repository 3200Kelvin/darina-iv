import { isSafari, noop, getIntersectionObserver } from '../../common/helpers';

import './style.scss';

export const useSafariForceRepaint = () => {
    if (!isSafari) {
        return noop;
    }

    const elements = document.querySelectorAll('[data-safari-force-repaint]');

    const intersectionObserver = getIntersectionObserver(0, onIntersecting, onNotIntersecting);
    elements.forEach((element) => intersectionObserver.observe(element));

    return () => intersectionObserver.disconnect();

    function onIntersecting(entry) {
        entry.target.classList.add('force-repaint');
    }

    function onNotIntersecting(entry) {
        entry.target.classList.remove('force-repaint');
    }
};
