import { onPageTransitionEnd } from "../../global/transitions";

export function getNewValue(current, target, time, timeCoeff = 0.01, epsilon = 1) {
    const distance = target - current;
    const move = distance / 2 * time * timeCoeff;
    if (Math.abs(move) > Math.abs(distance)) {
        return target;
    }
    const newValue = current + move;
    if (Math.abs(newValue - target) < epsilon) {
        return target;
    }
    return newValue;
}

export function doAsync(callback, delay = 10) {
    return new Promise((res) => {
        callback();

        setTimeout(() => {
            res();
        }, delay);
    });
}

export const isTouchscreen = window.matchMedia("(pointer: coarse)").matches;

export const isHover = window.matchMedia("(hover: hover)").matches;

export const round = (num, digits = 3) => {
    const coeff = Math.pow(10, digits);
    return Math.round(num * coeff) / coeff;
}

export const tryCatch = (callback) => {
    try {
        return callback();
    } catch (error) {
        console.error(error);
    }
}

export const getIsDesktop = () => window.innerWidth > 991;

export const getIsMobile = () => window.innerWidth < 767;

export const getIsLeastMobile = () => window.innerWidth < 478;

export const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

export const isWeakDevice = isSafari || (window.navigator.deviceMemory || 0) < 4;

export function getSetVariable(obj, value) {
    return gsap.quickTo(obj, value, { duration: 0.8, ease: "power2.out" });
}

export const getRaf = () => {
    let raf = null;

    return function moveRaf(cb) {
        if (raf) {
            cancelAnimationFrame(raf);
            raf = null;
        }

        raf = requestAnimationFrame(cb);
    }
};

export const getOnEnterPress = (callback) => {
    return (event) => {
        event.stopPropagation();
        if (event.key === 'Enter') {
            callback();
        }
    }
}

export const onTransitionEnd = (element, property, callback) => {
    const onTransitionEnd = (event) => {
        if (event.propertyName === property) {
            callback();
            element.removeEventListener('transitionend', onTransitionEnd);
        }
    }

    element.addEventListener('transitionend', onTransitionEnd);
};

export const isPrefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function getIntersectionObserver(
    margin = 15,
    onIntersecting = () => {},
    onNotIntersecting = () => {},
    { marginTop = margin, marginBottom = margin } = {}
) {
    if (!('IntersectionObserver' in window)) {
        console.warn('IntersectionObserver is not supported');
        return {
            observe: () => {},
            unobserve: () => {},
            disconnect: () => {},
        };
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                onIntersecting(entry, observer);
            } else {
                onNotIntersecting(entry, observer);
            }
        });
    }, { rootMargin: `-${marginTop}% 0% -${marginBottom}% 0%`, threshold: 0 });

    return observer;
}

export function getScrollTriggerRefresh(block, scrollTrigger) {
    const observer = getIntersectionObserver(0, () => scrollTrigger.refresh());

    observer.observe(block);

    return () => observer.disconnect();
}

export const getCleanup = (...cleanups) => {
    return () => cleanups.forEach((cleanup) => {
        if (cleanup?.cleanup) {
            return cleanup.cleanup?.();
        }
        cleanup?.();
    });
}

export const getPageNamespace = () => {
    const container = document.querySelector('[data-barba="container"]');

    return container?.dataset.barbaNamespace || null;
}

export const noop = () => {};

export const useTransitionDelay = (callback = () => {}) => {
    if (window.isTransitioning) {
        return onPageTransitionEnd(callback);
    } else {
        callback();
        return noop;
    }
}

const getAnimationOffset = (element) => {
    const {
        animationOffset = 15,
        animationOffsetTablet = animationOffset,
        animationOffsetMobile = animationOffsetTablet
    } = element.dataset || {};

    if (getIsDesktop()) {
        return animationOffset;
    } else if (getIsLeastMobile()) {
        return animationOffsetMobile;
    } else {
        return animationOffsetTablet;
    }
};

export const useElementAnimation = (elements, getElementAnimation) => {
    const observers = {};

    const cleanups = [...elements].map((element) => {
        const { animate, cleanup } = getElementAnimation(element);

        element.animate = animate;

        return cleanup;
    });

    const cleanupPageListener = useTransitionDelay(addObservers);

    function addObservers() {
        elements.forEach((element) => {
            const offset = getAnimationOffset(element);

            const observer = getObserver(offset);

            observer.observe(element);
        });
    }

    function getObserver(offset) {
        if (!observers[offset]) {
            observers[offset] = getIntersectionObserver(offset, onIntersection);
        }

        return observers[offset];
    }

    function onIntersection(entry, observer) {
        entry.target.animate();
        observer.unobserve(entry.target);
    }

    return getCleanup(
        ...cleanups,
        cleanupPageListener,
        () => {
            Object.values(observers).forEach((observer) => observer.disconnect());
        }
    );
};
