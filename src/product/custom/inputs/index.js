import { getCleanup } from "@/common/helpers";
import {
    sendProductCustomizationUpdate,
} from "@/common/productCustomization";

export const useProductCustomInputs = (container) => {
    const inputs = container.querySelectorAll('[data-cart-item-customization]');
    const currentCustomizationData = {};

    const cleanups = [...inputs].map((input) => {
        const field = input.closest('.product__field');
        if (field) {
            const placeholder = field.querySelector('.product__field__placeholder')?.textContent;
            if (placeholder) {
                input.setAttribute('placeholder', placeholder);
            }
        }

        input.addEventListener('input', onInputDataChange);
        onInputDataChange({ target: input }); // Initialize with current value

        return () => input.removeEventListener('input', onInputDataChange);
    });

    return getCleanup(
        ...cleanups
    );

    function onInputDataChange(event) {
        const input = event.target;
        if (!!input.dataset.locale && !input.checkVisibility()) {
            return;
        }
        const key = input.name;
        const value = input.value;
        const label = formatInputValue(value, input.dataset.formatting);
        const localizedLabels = getLocalizedLabels(input);
        currentCustomizationData[key] = { value, label, localizedLabels };
        sendProductCustomizationUpdate(currentCustomizationData);
    }

    function getLocalizedLabels(input) {
        const localizedLabels = {};

        [...input.attributes].forEach((attribute) => {
            if (!attribute.name.startsWith('data-label-')) {
                return;
            }

            const locale = attribute.name.slice('data-label-'.length).trim().toUpperCase();
            const localizedLabel = attribute.value?.trim();

            if (!locale || !localizedLabel) {
                return;
            }

            localizedLabels[locale] = localizedLabel;
        });

        return localizedLabels;
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
