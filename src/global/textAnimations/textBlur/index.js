import { setTextBlur } from "../../../common/textBlur";
import { useElementAnimation } from "../../../common/helpers";

export const useTextBlur = () => {
    const elements = document.querySelectorAll('[data-animation="text-blur"]');

    return useElementAnimation(elements, setTextBlur);
};