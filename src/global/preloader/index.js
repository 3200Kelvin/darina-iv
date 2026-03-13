import { animate } from "motion";
import { isLoaded, setIsLoaded } from "../../initial";
import { blockScroll, unblockScroll } from "../../common/blockScroll";
import { scrollTo } from "../../common/smoothScroll";
import { sendTransitionEndEvent } from '../transitions';

import './style.scss';

const READY_EVENT_NAME = 'website-loaded';

export const postReadyEvent = () => document.dispatchEvent(new CustomEvent(READY_EVENT_NAME));

export const usePreloader = () => {
    const preloader = document.getElementById('preloader');
    if (!preloader) {
        return;
    }
    
    window.isTransitioning = true;

    if (isLoaded()) {
        return hidePreloader();
    };

    scrollTo(0, true);
    blockScroll();
    const letter = preloader.querySelector('.preloader__title__h');

    document.addEventListener(READY_EVENT_NAME, animatePreloader);

    function hidePreloader() {
        return animate(preloader, { opacity: 0 }, { duration: 0.6 }).finished.then(() => {
            preloader.remove();
            unblockScroll();
            setIsLoaded();
            sendTransitionEndEvent();
        });
    }

    function animatePreloader() {
        scrollTo(0, true);
        return hidePreloader();
    }
};
