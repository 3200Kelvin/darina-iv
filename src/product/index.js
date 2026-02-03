import { useProductCustomization } from "./custom";

import { getCleanup } from "../common/helpers";

export const usePageScripts = () => getCleanup(
    useProductCustomization(),
);
