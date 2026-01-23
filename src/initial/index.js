const STORAGE_KEY = 'loaded';

export const isLoaded = () => sessionStorage.getItem(STORAGE_KEY) === 'true';

export const setIsLoaded = () => sessionStorage.setItem(STORAGE_KEY, 'true');

export const useInitialScript = () => {
    if (!isLoaded()) {
        return;
    }

    // const style = document.createElement('style');
    // style.textContent = `#preloader { display: none !important; }`;
    // document.head.appendChild(style);
};
