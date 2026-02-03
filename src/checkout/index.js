import {
    getProductCustomizationData,
    CART_ITEMS_UPDATE_MESSAGE,
    redrawCartItems,
} from "../common/productCustomization";

export const usePageScripts = () => {
    const orderDetailsInput = document.querySelector('[data-checkout-order-details]');
    const orderList = document.querySelector('.checkout__order-list');

    const initialCustomizationData = getProductCustomizationData();

    const orderListMutationObserver = new MutationObserver(handleOrderListMutation);

    handleCartDataUpdate(initialCustomizationData);
    window.addEventListener('message', customizationDataListener);
    orderListMutationObserver.observe(orderList, { childList: true });

    function fillOrderDetails(data) {
        if (!orderDetailsInput) {
            return;
        }

        const value = Object.entries(data).map(([sku, groups]) => {
            const groupStrings = groups.map((group) => {
                const paramStrings = Object.entries(group).map(([key, paramData]) => {
                    return `${key}: ${paramData.value}`;
                });
                return paramStrings.join('\n');
            });

            return `SKU ${sku}:\n${groupStrings.join('\n\n')}`;
        }).join('\n\n');

        orderDetailsInput.value = value;
    }

    function handleOrderListMutation() {
        redrawCartItems(orderList, initialCustomizationData);
    }

    function handleCartDataUpdate(data) {
        redrawCartItems(orderList, data);
        fillOrderDetails(data);
    }
    
    function customizationDataListener(event) {
        if (event.data.type === CART_ITEMS_UPDATE_MESSAGE) {
            handleCartDataUpdate(event.data.payload);
        }
    }

    return () => {
        window.removeEventListener('message', customizationDataListener);
        orderListMutationObserver.disconnect();
    };
};
