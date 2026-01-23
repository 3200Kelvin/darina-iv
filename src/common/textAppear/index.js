import './style.scss';

export const setTextAppear = (element) => {
    const CLASS_NAMES = {
        BASE: 'text-appear',
        ELEMENT: 'text-appear__line',
        TRANSITION: 'text-appear__transition',
        APPEARED: 'text-appear__appeared',
    };

    element.classList.add(CLASS_NAMES.BASE);

    const split = SplitText.create(element, {
        type: 'lines',
        mask: 'lines',
        linesClass: CLASS_NAMES.ELEMENT,
    });

    const entries = split.lines;

    const STAGGER = 0.15;

    entries.forEach((line, index) => {
        line.style.setProperty('--delay', `${STAGGER * index}s`);
    });

    let cleanup;

    const animate = () => {
        return new Promise((res) => {
            const lastEntry = entries[entries.length - 1];

            cleanup = () => {
                lastEntry.removeEventListener('transitionend', onTransitionEnd);
                cleanup = null;
            };

            const onTransitionEnd = (event) => {
                if (event.propertyName === 'transform') {
                    element.classList.remove(CLASS_NAMES.TRANSITION);

                    cleanup?.();
                    res();
                }
            };

            lastEntry.addEventListener('transitionend', onTransitionEnd);

            element.classList.add(CLASS_NAMES.TRANSITION);

            setTimeout(() => {
                element.classList.add(CLASS_NAMES.APPEARED);
            }, 10)
        });
    }

    const revert = () => {
        return new Promise((res) => {
            const lastEntry = entries[entries.length - 1];

            cleanup = () => {
                lastEntry.removeEventListener('transitionend', onTransitionEnd);
                cleanup = null;
            };

            const onTransitionEnd = (event) => {
                if (event.propertyName === 'transform') {
                    element.classList.remove(CLASS_NAMES.TRANSITION);

                    cleanup?.();
                    res();
                }
            };

            lastEntry.addEventListener('transitionend', onTransitionEnd);

            element.classList.add(CLASS_NAMES.TRANSITION);

            setTimeout(() => {
                element.classList.remove(CLASS_NAMES.APPEARED);
            }, 10)
        });
    }

    const reset = () => {
        cleanup?.();

        entries.forEach((line) => {
            line.classList.add(CLASS_NAMES.BASE);
        });
    }

    return { animate, revert, reset, cleanup };
}