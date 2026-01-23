export const useScroll = (onBefore, onAfter, { threshold = 50, runOnInit = false } = {}) => {
    let isBefore;

    const onScroll = () => {
        if (window.scrollY < threshold) {
            if (isBefore !== true) {
                onBefore();
                isBefore = true;
            }
        } else {
            if (isBefore !== false) {
                onAfter();
                isBefore = false;
            }
        }
    };

    window.addEventListener('scroll', onScroll);

    if (runOnInit) {
        onScroll();
    }

    return () => window.removeEventListener('scroll', onScroll);
};
