import { useProductCustomization } from "./custom";
import { useProductImages } from "./images";

import { getCleanup } from "../common/helpers";

export const usePageScripts = () => getCleanup(
    useProductImages(),
    useProductCustomization(),
);