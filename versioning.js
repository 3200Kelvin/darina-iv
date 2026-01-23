(function useVersion() {
    const PROD_ORIGIN = 'https://www.iwcglobal.net';

    if (window.location.origin === PROD_ORIGIN) {
        setProdScripts();
        return;
    }

    const SESSION_STORAGE_KEY = 'is-dev';

    const isStoredDev = sessionStorage.getItem(SESSION_STORAGE_KEY) === 'true';

    if (isStoredDev) {
        setDevScripts();
        return;
    }

    const isUrlDev = window.location.href.includes('dev=true');

    if (isUrlDev) {
        sessionStorage.setItem(SESSION_STORAGE_KEY, 'true');
        setDevScripts();
        return;
    }

    setStagingScripts();

    function setDevScripts() {
        document.body.setAttribute('data-mode', 'dev');
        const script = document.createElement('script');
        script.type = 'module';
        script.defer = true;
        script.src = 'http://localhost:5173/index.js';
        appendElement([script]);
    }

    function setStagingScripts() {
        document.body.setAttribute('data-mode', 'staging');
        const timestamp = new Date().getTime();

        const script = getScript(`https://3200kelvin.github.io/IWC/dist/index.js?v=${timestamp}`);
        const style1 = getStyle(`https://3200kelvin.github.io/IWC/dist/index.css?v=${timestamp}`);

        appendElement([script, style1]);
    }

    function setProdScripts() {
        const script = getScript('/app/index.js');
        const style = getStyle('/app/index.css');

        appendElement([script, style]);
    }

    function getScript(src) {
        const script = document.createElement('script');
        script.type = 'module';
        script.defer = true;
        script.src = src;
        return script;
    }

    function getStyle(src) {
        const style = document.createElement('link');
        style.type = 'text/css';
        style.rel = 'stylesheet';
        style.href = src;
        return style;
    }

    function appendElement(elements) {
        document.currentScript.after(...elements);
    }
})();