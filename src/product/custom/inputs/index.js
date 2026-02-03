import { getCleanup } from "@/common/helpers";
import {
    sendProductCustomizationUpdate,
} from "@/common/productCustomization";

export const useProductCustomInputs = (container) => {
    const inputs = container.querySelectorAll('[data-cart-item-customization]');
    const currentCustomizationData = {};

    const cleanups = [...inputs].map((input) => {
        input.addEventListener('input', onInputDataChange);

        return () => input.removeEventListener('input', onInputDataChange);
    });

    return getCleanup(
        ...cleanups
    );

    function onInputDataChange(event) {
        const input = event.target;
        const key = input.name;
        const value = input.value;
        const label = formatInputValue(value, input.dataset.formatting);
        currentCustomizationData[key] = { value, label };
        sendProductCustomizationUpdate(currentCustomizationData);
    }

    function formatInputValue(value, formatting) {
        switch (formatting) {
            case 'sum':
                return value.split(', ').length;
            default:
                return null;
        }
    }
};
