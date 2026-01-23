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
        return gsap.timeline()
            .to(preloader, { opacity: 0, duration: 0.6 })
            .add(() => {
                preloader.remove();
                unblockScroll();
                setIsLoaded();
                sendTransitionEndEvent();
            });
    }

    function animatePreloader() {
        gsap.timeline()
            .delay(0.5)
            .to(letter, { transform: 'translateY(-100%)', duration: 1 })
            .add(() => {
                scrollTo(0, true);
            })
            .add(hidePreloader);
    }
};
