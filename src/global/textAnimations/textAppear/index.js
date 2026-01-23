import { setTextAppear } from "../../../common/textAppear";
import { useElementAnimation } from "../../../common/helpers";

export const useTextAppear = () => {
    const elements = document.querySelectorAll('[data-animation="text-appear"]');

    return useElementAnimation(elements, setTextAppear);
};