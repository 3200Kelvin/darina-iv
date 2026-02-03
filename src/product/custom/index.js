import { getCleanup } from "../../common/helpers";
import { useFileUploader } from "./uploader";
import { useProductCustomInputs } from "./inputs";

export const useProductCustomization = () => {
    const container = document.querySelector('.product');
    if (!container) {
        return;
    }

    const customParameters = container.querySelector('.product__custom');
    if (!customParameters?.checkVisibility()) {
        return;
    }

    return getCleanup(
        useFileUploader(container),
        useProductCustomInputs(container),
    );
};
