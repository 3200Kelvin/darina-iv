export const onTransitionEnd = (element, property, callback) => {
    const onTransitionEnd = (event) => {
        if (event.propertyName === property) {
            callback();
            element.removeEventListener('transitionend', onTransitionEnd);
        }
    }

    element.addEventListener('transitionend', onTransitionEnd);
};