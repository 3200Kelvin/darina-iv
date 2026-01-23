export function scrollTo(target, isInstant = false) {
    if (window.lenis) {
        window.lenis.scrollTo(target, { immediate: isInstant, force: isInstant });
        return;
    }

    if (isNaN(target)) {
        document.querySelector(target).scrollIntoView({ behavior: isInstant ? 'instant' : 'smooth' });
    } else {
        window.scrollTo(0, target);
    }
}

export function scrollToAnchor(hash = null, isInstant = false) {
    if (hash) {
        scrollTo(hash, isInstant);
        return;
    }

    const params = new URL(window.location).searchParams;
    const anchor = params.get('anchor');

    if (anchor) {
        scrollTo(`#${anchor}`, isInstant);

        const newUrl = `${window.location.origin}${window.location.pathname}#${anchor}`;
        history.replaceState(null, "", newUrl);
    }
}

export const getScrollPosition = () => {
    if (window.lenis) {
        return window.lenis.scroll;
    }

    return window.pageYOffset || document.documentElement.scrollTop;
}

export const setSmoothScroll = async () => {
    const Lenis = (await import('lenis')).default;
    
    if (!Lenis) {
        return null;
    }

    const lenis = configureLenis(Lenis);

    window.lenis = lenis;

    return lenis;
};

function configureLenis(Lenis) {
    const content = document.querySelector('main');
    if (!content) {
        return null;
    }

    const lenis = new Lenis({
        duration: 1.2,
        wheelMultiplier: 1,
        touchMultiplier: 1,
        autoRaf: true,
        // prevent: (node) => !!node.closest('.form__dropdown'),
    });

    document.addEventListener('DOMContentLoaded', scrollToAnchor);

    // weird shit to get lenis scroll to work properly
    lenis.resizeDebounce = null;

    lenis.on('scroll', onScroll);

    const docHeightObserver = new ResizeObserver((entries) => {
        onResize(entries[0]);
    });
    docHeightObserver.observe(document.documentElement);
    docHeightObserver.observe(document.body);
    docHeightObserver.observe(content);

    document.documentElement.style.setProperty('height', 'auto');
    setTimeout(() => {
        document.documentElement.style.setProperty('height', '100%');
    }, 100);
    // end of the weird shit

    return lenis;

    function onScroll(event) {
        const { scrollHeight } = event.dimensions;
        if (scrollHeight !== document.body.scrollHeight) {
            resize();
        }
    }

    function onResize(entry) {
        if (entry.target === document.documentElement) {
            try {
                Object.defineProperty(window, 'innerHeight', {
                    get: function() {
                      return entry.contentRect.height;
                    }
                });
            } catch(error) {
                console.warn(error);
            }
        }
        
        resize();
    }

    function resize() {
        clearTimeout(lenis.resizeDebounce);
        lenis.resizeDebounce = setTimeout(() => {
            lenis.resize();
        }, 100);
    }
}
