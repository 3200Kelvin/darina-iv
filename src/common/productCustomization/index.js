import { setCookie, getCookie } from "../helpers/cookies";

const COOKIE_NAME = 'product_customization';
const LABEL_LOCALES = ['EN', 'FR'];

export const CUSTOMIZATION_DATA_UPDATE_MESSAGE = 'customizationDataUpdate';

export const CART_ITEMS_UPDATE_MESSAGE = 'cartItemsUpdate';

export const getProductCustomizationData = () => {
    return getCookie(COOKIE_NAME) || {};
};

export const setProductCustomizationData = (data) => {
    setCookie(COOKIE_NAME, data);
};

export const sendProductCustomizationUpdate = (data) => {
    window.postMessage({ type: CUSTOMIZATION_DATA_UPDATE_MESSAGE, payload: data }, '*');
}

export const sendCartItemsUpdate = (data) => {
    window.postMessage({ type: CART_ITEMS_UPDATE_MESSAGE, payload: data }, '*');
}

export function redrawCartItems(container, customizationData) {
    if (!container) {
        return;
    }

    const cartItems = container.querySelectorAll('[data-product-item]');
    cartItems.forEach((item) => {
        const itemSkuElement = item.querySelector('[data-product-sku]');
        const itemSku = itemSkuElement.textContent.trim();
        redrawCartItem(item, customizationData[itemSku] || []);
    });
}

function redrawCartItem(item, customizationList) {
    const paramList = item.querySelector('[data-product-parameters]');
    
    const existing = paramList.querySelectorAll('[data-product-customization-group]');
    existing.forEach((el) => el.remove());

    customizationList.forEach((group) => {
        const groupElement = document.createElement('li');
        groupElement.setAttribute('data-product-customization-group', '');

        Object.entries(group).forEach(([key, data]) => {
            const paramItem = drawItemParameter(key, data);
            groupElement.appendChild(paramItem);
        });

        paramList.appendChild(groupElement);
    });
}

function drawItemParameter(key, data) {
    const { value, label, localizedLabels = {} } = data || {};
    const paramItem = document.createElement('p');
    paramItem.setAttribute('data-product-item-param', key);

    LABEL_LOCALES.forEach((locale) => {
        const localizedLabelElement = document.createElement('span');
        localizedLabelElement.classList.add('inline');
        localizedLabelElement.setAttribute('data-locale', locale);
        localizedLabelElement.textContent = localizedLabels[locale] || key;
        paramItem.appendChild(localizedLabelElement);
    });

    const separator = document.createTextNode(': ');
    const valueText = document.createTextNode(label || value);
    paramItem.appendChild(separator);
    paramItem.appendChild(valueText);

    return paramItem;
}