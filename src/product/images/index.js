import './style.scss';

export const useProductImages = () => {
    const ACTIVE_CLASS_NAME = 'product__images__mini--active';
    const mainImage = document.querySelector('.product__images__image');
    const minisList = document.querySelector('.product__images__minis-list');
    let minis = document.querySelectorAll('.product__images__mini');

    if (!mainImage || minis.length === 0) {
        return;
    }

    const listMutationObserver = new MutationObserver(() => {
        const newMinis = document.querySelectorAll('.product__images__mini');
        minis.forEach(m => m.classList.remove(ACTIVE_CLASS_NAME));
        newMinis[0].classList.add(ACTIVE_CLASS_NAME);
        setImage(newMinis[0]);
        minis = newMinis;
    });

    listMutationObserver.observe(minisList, { childList: true });
    minisList.addEventListener('click', onMinisListClick);

    return () => {
        minisList.removeEventListener('click', onMinisListClick);
        listMutationObserver.disconnect();
    };

    function onMinisListClick(event) {
        const mini = event.target.closest('.product__images__mini');
        if (!mini) {
            return;
        }
        minis.forEach(m => m.classList.remove(ACTIVE_CLASS_NAME));
        mini.classList.add(ACTIVE_CLASS_NAME);
        setImage(mini);
    }

    function setImage(mini) {
        mainImage.src = mini.src;
    }
};
