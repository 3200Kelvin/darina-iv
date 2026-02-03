import { setCookie, getCookie } from "../helpers/cookies";

const COOKIE_NAME = 'product_customization';

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
        console.log(itemSku);
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
    const { value, label } = data;
    const paramItem = document.createElement('p');
    paramItem.setAttribute('data-product-item-param', key);
    paramItem.textContent = `${key}: ${label || value}`;
    return paramItem;
}