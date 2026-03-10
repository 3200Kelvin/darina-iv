import { getCleanup } from "../../common/helpers";

export const useProductImages = () => {
    const mainImage = document.querySelector('.product__images__image');
    const minisList = document.querySelector('.product__images__minis-list');
    const minis = document.querySelectorAll('.product__images__mini');

    if (!mainImage || minis.length === 0) {
        return;
    }
    
    minisList.addEventListener('click', onMinisListClick);

    return () => minisList.removeEventListener('click', onMinisListClick);

    function onMinisListClick(event) {
        const mini = event.target.closest('.product__images__mini');
        if (!mini) {
            return;
        }
        mainImage.src = mini.src;
    }
};
