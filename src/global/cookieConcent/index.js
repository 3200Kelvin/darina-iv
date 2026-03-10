import { setCookie, getCookie } from '@/common/helpers/cookies';

export const useCookieConsent = () => {
    const dialog = document.querySelector('.cookie');
    if (!dialog) {
        return;
    }

    const isAccepted = getCookie('cookie_consent') === 'accepted';
    if (isAccepted) {
        return;
    }

    const button = dialog.querySelector('.button');

    const onButtonClick = () => {
        setCookie('cookie_consent', 'accepted', 90);
        dialog.remove();
    };

    button.addEventListener('click', onButtonClick);

    dialog.style.display = 'block';

    return () => button.removeEventListener('click', onButtonClick);
}