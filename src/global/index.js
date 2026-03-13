// import { usePreloader } from "./preloader";
import { useMenu } from "./menu";
import { usePopups } from "./popup";
import { useCartCustomization } from "./cart";
import { useTextBlur, useTextAppear } from "./textAnimations";
import { useSafariForceRepaint } from "./forceRepaint";
import { setScrollBarWidthListener } from "../common/blockScroll";
import { getCleanup } from "../common/helpers";
import { setSmoothScroll } from "../common/smoothScroll";
import { useFlippingLinks } from "./flippingLinks";
import { useCookieConsent } from "./cookieConcent";
import { useLocalization } from "./localization";

import './style.scss';

export const useGlobalOnceScripts = () => {
    setSmoothScroll();
    // usePreloader();
    setScrollBarWidthListener();
    useMenu();
    useCartCustomization();
    useCookieConsent();
};

export const useGlobalScripts = () => {
    return getCleanup(
        useLocalization(),
        useTextBlur(),
        useTextAppear(),
        useSafariForceRepaint(),
        useFlippingLinks(),
        usePopups(),
    );
};
