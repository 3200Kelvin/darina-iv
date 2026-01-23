import { getRaf, getSetVariable, isTouchscreen } from './index';

export const useCursorMove = (cursor, elements, { x: startX = 0, y: startY = 0 } = {}) => {
    if (isTouchscreen) {
        return () => {};
    }

    const position = {
        x: startX,
        y: startY,
    };
    const positionProxy = new Proxy(position, {
        set: (target, key, value) => {
            target[key] = value;
            requestAnimationFrame(moveTip);
            return true;
        },
    });

    const setX = getSetVariable(positionProxy, 'x');
    const setY = getSetVariable(positionProxy, 'y');
    const moveRaf = getRaf();

    if (elements.length) {
        elements.forEach((element) => element.addEventListener('mouseenter', onMouseEnter))
    } else if (elements) {
        elements.addEventListener('mouseenter', onMouseEnter);
    }

    return { setTarget };

    function onMouseEnter(event) {
        const { pageX, pageY, target } = event;
        setTarget(pageX, pageY);
        cursor.classList.add('entered');
        
        target.addEventListener('mousemove', onMouseMove);
        target.addEventListener('mouseleave', omMouseLeave);
    }

    function onMouseMove(event) {
        const { pageX, pageY } = event;
        setTarget(pageX, pageY);
    }

    function omMouseLeave(event) {
        const { pageX, pageY, target } = event;
        setTarget(pageX, pageY);
        cursor.classList.remove('entered');
        
        target.removeEventListener('mousemove', onMouseMove);
        target.removeEventListener('mouseleave', omMouseLeave);
    }

    function setTarget(x, y) {
        moveRaf(() => {
            setX(x);
            setY(y);
        });
    }

    function moveTip() {
        const { x, y } = position;
        cursor.style.setProperty('--transform', `translate(${x}px, ${y}px)`);
    }
};
