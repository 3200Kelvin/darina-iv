import { getCleanup } from "../../common/helpers";
import {
    getProductCustomizationData,
    setProductCustomizationData,
    CUSTOMIZATION_DATA_UPDATE_MESSAGE,
    sendCartItemsUpdate,
    redrawCartItems,
} from "../../common/productCustomization";

export const useCartCustomization = () => {
    const cart = document.querySelector('.cart');
    if (!cart) {
        return;
    }

    const cartList = cart.querySelector('.cart__list');
    let currentCustomizationData = {};
    let customizationData = getProductCustomizationData();

    const cartListMutationObserver = new MutationObserver(onCartListMutation);
    cartListMutationObserver.observe(cartList, { childList: true });

    window.addEventListener('message', onWindowMessage);

    return getCleanup(
        () => cartListMutationObserver.disconnect(),
        () => window.removeEventListener('message', onWindowMessage),
    );

    function onWindowMessage(event) {
        if (event.data.type === CUSTOMIZATION_DATA_UPDATE_MESSAGE) {
            setCurrentCustomizationData(event.data.payload || {});
        }
    }

    function setCurrentCustomizationData(data) {
        currentCustomizationData = { ...data };
    }

    function saveCustomizationData() {
        redrawCartItems(cartList, customizationData);
        setProductCustomizationData(customizationData);
        sendCartItemsUpdate(customizationData);
    }

    function onCartListMutation() {
        const cartItems = cartList.querySelectorAll('.cart__item');

        if (!cartItems.length) {
            customizationData = {};
            saveCustomizationData();
            return;
        }

        cartItems.forEach((item) => {
            const itemSkuElement = item.querySelector('[data-product-sku]');
            const itemSku = itemSkuElement.textContent.trim();

            if (!itemSku) {
                return;
            }

            if (!customizationData[itemSku]) {
                customizationData[itemSku] = [];
            }

            const itemQuantityElement = item.querySelector('[data-product-quantity]');
            const itemQuantity = parseInt(itemQuantityElement.textContent.trim() || '1', 10);

            const dataLength = customizationData[itemSku].length || 0;

            if (itemQuantity === dataLength) {
                return;
            }

            if (itemQuantity > dataLength) {
                customizationData[itemSku][itemQuantity - 1] = { ...currentCustomizationData };
            } else {
                customizationData[itemSku] = customizationData[itemSku].slice(0, itemQuantity);
            }
        });

        saveCustomizationData();
    }
};
