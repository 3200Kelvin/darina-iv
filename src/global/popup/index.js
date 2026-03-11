import { animate } from "motion";
import { getCleanup } from '../../common/helpers';
import { blockScroll, unblockScroll } from '../../common/blockScroll';

export const usePopups = () => {
    const triggers = document.querySelectorAll('[data-popup-trigger]');

    const cleanups = [...triggers].map((trigger) => {
        const popupId = trigger.dataset.popupTrigger;
        const popup = document.querySelector(`[data-popup="${popupId}"]`);
        const background = popup.querySelector('[data-popup-bg]');
        const closeBtn = popup.querySelector('[data-popup-close]');

        trigger.addEventListener('click', openPopup);
        popup.addEventListener('click', onPopupClick);

        return () => {
            trigger.removeEventListener('click', openPopup);
            popup.removeEventListener('click', onPopupClick);
        };

        function openPopup() {
            blockScroll();
            animate([
                [popup, { display: 'block' }],
                [popup, { opacity: [0, 1] }, { duration: 0.3, easing: 'ease-out' }]
            ]);
        }

        function onPopupClick(event) {
            if (event.target === background || closeBtn?.contains(event.target)) {
                closePopup();
            }
        }

        function closePopup() {
            unblockScroll();
            animate([
                [popup, { opacity: 0 }, { duration: 0.3, easing: 'ease-out' }],
                [popup, { display: 'none' }]
            ]);
        }
    });

    return getCleanup(cleanups);
};
