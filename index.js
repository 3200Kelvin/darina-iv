import { usePageTransitions } from "./src/global/transitions";
import { useGlobalScripts, useGlobalOnceScripts } from "./src/global";
import { postReadyEvent } from "./src/global/preloader";
import { getPageNamespace } from "./src/common/helpers";

const MODULE_MAP = {
    home: 'main',
    about: 'about',
    media: 'media',
    solutions: 'solutions',
    solution: 'solution',
    contact: 'contact',
    signup: 'memberstackSignup',
    'members-area': 'memberstackAccount',
    intelligence: 'intelligence',
    article: 'article',
};

if (gsap) {
    gsap.defaults({
        duration: 0,
        ease: 'power2.inOut'
    });
}

let isInitialized = false;
let cleanup;
window.isTransitioning = false;
init();

async function loadAndRunModule(namespace) {
    const modulePath = MODULE_MAP[namespace];

    if (!modulePath) {
        return null;
    }

    const cleanup = await import(`./src/${modulePath}/index.js`).then(({ usePageScripts }) => {
        return usePageScripts?.();
    });

    return cleanup;
}

function once() {
    useGlobalOnceScripts();
    
    usePageTransitions(each);
}

async function runPageSpecificScript() {
    const pageNamespace = getPageNamespace();
    
    const cleanup = await loadAndRunModule(pageNamespace);

    return cleanup;
}

async function each() {
    try {
        if (cleanup) {
            cleanup();
            cleanup = null;
        }

        const globalScriptsCleanup = useGlobalScripts();
        const pageScriptCleanup = await runPageSpecificScript();

        cleanup = () => {
            globalScriptsCleanup?.();
            pageScriptCleanup?.();
        }
    } catch (e) {
        console.error(e);
    }
}

async function init() {
    document.fonts.ready.then(async () => {
        if (!isInitialized) {
            once();
            isInitialized = true;
        }
        await each();
        postReadyEvent();
    });
}

