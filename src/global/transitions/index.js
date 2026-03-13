import barba from '@barba/core';
import { animate } from 'motion';

import { scrollTo, scrollToAnchor, getScrollPosition } from '../../common/smoothScroll';

const TRANSITION_END_EVENT = 'page-transition-end';

export const onPageTransitionEnd = (callback = () => {}) => {
    document.addEventListener(TRANSITION_END_EVENT, callback, { once: true });

    return () => document.removeEventListener(TRANSITION_END_EVENT, callback);
}

export function sendTransitionEndEvent() {
    document.dispatchEvent(new CustomEvent(TRANSITION_END_EVENT));
    window.isTransitioning = false;
}

const createOverlay = () => {
    const overlay = document.createElement('div');
    overlay.id = 'page-transition';
    overlay.style.position = 'fixed';
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.zIndex = 99;
    overlay.style.backgroundColor = 'var(--bg)';
    overlay.style.opacity = 0;
    overlay.style.pointerEvents = 'none';
    return overlay;
}

export const usePageTransitions = (runScripts = async () => {}) => {
    const overlay = createOverlay();
    document.body.appendChild(overlay);

    let scrollPosition = 0;
    let hash = null;

    try {
        barba.init({
            transitions: [
                {
                    name: 'transition',
                    leave(data) {
                        return onLeave(data);
                    },
                    enter(data) {
                        return onEnter(data);
                    }
                },
            ]
        });
        
        barba.hooks.beforeLeave((data) => {
            hash = data.trigger.hash || null;
            scrollPosition = getScrollPosition();
            stopScroll();
        });
        
        barba.hooks.beforeEnter((data) => {
            data.current.container.remove();
            resetScroll();
            if (!isBack(data)) {
                scrollTo(0, true);
            }
        });
        
        barba.hooks.after((data) => {
            if (isBack(data)) {
                scrollTo(scrollPosition, true);
            } else {
                scrollToAnchor(hash);
            }
            
            hash = null;
        });

        scrollToAnchor(location.hash || null, true);
    } catch (error) {
        console.warn('Barba init error', error);
    }

    async function onLeave(data) {
        if (isBack(data) || !overlay) {
            return Promise.resolve();
        }

        window.isTransitioning = true;

        return animate(overlay, { opacity: [0, 1] }, { duration: 0.5 });
    };

    async function onEnter(data) {
        startSctoll();
        resetWebflow(data);

        // very important to wait for all the modules to get loaded
        await runScripts();

        if (isBack(data)) {
            scrollTo(scrollPosition, true);
        } else {
            scrollToAnchor(hash, true);
        }

        if (isBack(data) || !overlay) {
            return Promise.resolve();
        }

        return animate(overlay, { opacity: [1, 0] }, { duration: 0.5 })
            .then(() => {
                sendTransitionEndEvent();
            });
    };

    function stopScroll() {
        if (lenis) {
            lenis.stop();
        }
    }

    function startSctoll() {
        lenis?.start?.();
    }

    function resetScroll() {
        lenis?.resize?.();
    }

    function isBack(data) {
        return data.trigger === 'back';
    }
};

function resetWebflow(data) {
    let parser = new DOMParser();
    let dom = parser.parseFromString(data.next.html, "text/html");
    let webflowPageId = dom.documentElement.getAttribute("data-wf-page");
    document.documentElement.setAttribute("data-wf-page", webflowPageId);
    window.Webflow && window.Webflow.destroy();
    window.Webflow && window.Webflow.ready();
    window.Webflow && window.Webflow.require("ix2")?.init?.();
    restartAutoplayedVideos();
}

function restartAutoplayedVideos() {
    const videos = document.querySelectorAll('video[autoplay]');
    videos.forEach(video => {
        if (video.paused) {
            video.play().catch(console.warn);
        }
    });
}
