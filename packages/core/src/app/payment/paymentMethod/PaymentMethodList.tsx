import { PaymentMethod, Cart, CheckoutParams, CheckoutRequestBody, CheckoutSelectors, Consignment, RequestOptions } from '@bigcommerce/checkout-sdk';
import { find, get, noop } from 'lodash';
import React, { FunctionComponent, useCallback, useMemo, useEffect, useState } from 'react';
import { CheckoutContextProps, withCheckout } from '../../checkout';
import { connectFormik, ConnectFormikProps } from '../../common/form';
import { isMobile } from '../../common/utility';
import { Checklist, ChecklistItem } from '../../ui/form';
import { findIndex } from 'lodash';
import getUniquePaymentMethodId, { parseUniquePaymentMethodId } from './getUniquePaymentMethodId';
import PaymentMethodTitle from './PaymentMethodTitle';
import PaymentMethodV2 from './PaymentMethodV2';
import { Modal } from '../../ui/modal';
import ModalContents from '../../ui/modal/ModalContents';



export interface PaymentMethodListProps {
    isEmbedded?: boolean;
    isInitializingPayment?: boolean;
    isUsingMultiShipping?: boolean;
    methods: PaymentMethod[];
    onSelect?(method: PaymentMethod): void;
    onUnhandledError?(error: Error): void;
}

export interface WithCheckoutCODProps {
    cart: Cart;
    consignments: Consignment[];
    isInitializing: boolean;
    isLoading?: boolean;
    loadCheckout(id: any, options?: RequestOptions<CheckoutParams>): Promise<CheckoutSelectors>;
    loadShippingOptions?(): Promise<CheckoutSelectors>;
    updateCheckout?(payload: CheckoutRequestBody): Promise<CheckoutSelectors>;
}

function getPaymentMethodFromListValue(methods: PaymentMethod[], value: string): PaymentMethod {
    const { gatewayId: gateway, methodId: id } = parseUniquePaymentMethodId(value);
    const method = gateway ? find(methods, { gateway, id }) : find(methods, { id });

    if (!method) {
        throw new Error(`Unable to find payment method with id: ${id}`);
    }

    return method;
}

const PaymentMethodList: FunctionComponent<
    PaymentMethodListProps & WithCheckoutCODProps & ConnectFormikProps<{ paymentProviderRadio?: string }>
> = ({
    formik: { values },
    isEmbedded,
    isInitializingPayment,
    isUsingMultiShipping,
    methods,
    cart,
    consignments,
    loadCheckout,
    onSelect = noop,
    onUnhandledError,
}) => {
        const handleSelect = useCallback(
            (value: string) => {
                onSelect(getPaymentMethodFromListValue(methods, value));
            },
            [methods, onSelect],
        );

        const index = findIndex(cart!.lineItems.physicalItems, { sku: "COD1" });
        const index2 = findIndex(cart!.lineItems.physicalItems, { sku: "COD2" });
        const index3 = findIndex(cart!.lineItems.physicalItems, { sku: "COD3" });
        const index4 = findIndex(cart!.lineItems.physicalItems, { sku: "COD4" });

        const cartId = cart.id;
        const itemAmount = cart.baseAmount;

        const _updateShippingCostTotal = () => {
            return new Promise(async (resolve, reject) => {
                const arrConsignments = consignments.map(consignment => {
                    return {
                        consignmentId: consignment.id,
                        selectedShippingOptionId: (consignment.selectedShippingOption ? consignment.selectedShippingOption.id : null)
                    }
                })
                for (let i = 0; i < arrConsignments.length; i++) {
                    const consignmentId = arrConsignments[i].consignmentId
                    const shippingOptionId = arrConsignments[i].selectedShippingOptionId

                    // if (!shippingOptionId) return

                    await fetch(`/api/storefront/checkouts/${cart.id}/consignments/${consignmentId}?include=consignments.availableShippingOptions%2Ccart.lineItems.physicalItems.options%2Ccart.lineItems.digitalItems.options%2Ccustomer%2Cpromotions.banners`, {
                        method: 'PUT',
                        credentials: 'same-origin',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            shippingOptionId
                        })
                    }).then(resp => {
                        return resp.json()
                    })
                        .catch(err => {
                            console.log(err);
                            reject(true);
                        });
                }
                resolve(true)
            })
        }

        // Control modal 
        const [modal, setModal] = useState<boolean>(false)
        const closeModal = () => { setModal(false); }

        // COD FEE product function
        const addProduct = (productIndex: any, codType: number) => {
            const isCODSelected = values.paymentProviderRadio === 'cod';
            const noCODProduct = productIndex === -1 || productIndex === null || productIndex === undefined;

            if (isCODSelected && noCODProduct) {
                setModal(true);
                fetch(`/cart.php?action=add&sku=COD${codType}&qty=1`).then(res => {
                    console.log(res);
                    _updateShippingCostTotal().then(data => {
                        console.log(data);
                        loadCheckout(cartId, {
                            params: {
                                include: [
                                    'cart.lineItems.physicalItems.categoryNames',
                                    'cart.lineItems.digitalItems.categoryNames',
                                ] as any,
                            },
                        });
                    })
                })
            }
            if (noCODProduct) {
                return;
            }
            // Remove COD FEE product
            if (!isCODSelected) {
                const cartId = cart.id;
                const itemId = cart.lineItems.physicalItems[productIndex].id!;
                fetch(`/api/storefront/carts/${cartId}/items/${itemId}`, {
                    method: "DELETE",
                    credentials: "same-origin",
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                    .then(response => {
                        console.log(response);
                        _updateShippingCostTotal().then(data => {
                            console.log(data);
                            loadCheckout(cartId, {
                                params: {
                                    include: [
                                        'cart.lineItems.physicalItems.categoryNames',
                                        'cart.lineItems.digitalItems.categoryNames',
                                    ] as any,
                                },
                            });
                        })
                    })
            }
        }

        const addCODbyAmount = (amount: number) => {

            const COD_PRICE_BY_AMOUNT_CONDITION1 = 10_000;
            const COD_PRICE_BY_AMOUNT_CONDITION2 = 30_000;
            const COD_PRICE_BY_AMOUNT_CONDITION3 = 100_000;
            const COD_PRICE_BY_AMOUNT_CONDITION4 = 300_000;

            switch (true) {
                case amount < COD_PRICE_BY_AMOUNT_CONDITION1:
                    addProduct(index, 1)
                    break;
                case amount >= COD_PRICE_BY_AMOUNT_CONDITION1 && amount < COD_PRICE_BY_AMOUNT_CONDITION2:
                    addProduct(index2, 2)
                    break;
                case amount >= COD_PRICE_BY_AMOUNT_CONDITION2 && amount < COD_PRICE_BY_AMOUNT_CONDITION3:
                    addProduct(index3, 4)
                    break;
                case amount >= COD_PRICE_BY_AMOUNT_CONDITION3 && amount < COD_PRICE_BY_AMOUNT_CONDITION4:
                    addProduct(index4, 4)
                    break;
            }
        }

        useEffect(() => {
            addCODbyAmount(itemAmount)
        }, [itemAmount, values.paymentProviderRadio])

        return (
            <>
                <Modal isOpen={modal}>
                    <ModalContents
                        clickable={closeModal}
                        modalText="代金引換でお支払いする際、手数料が追加されます。"
                    />
                </Modal>

                <Checklist
                    defaultSelectedItemId={values.paymentProviderRadio}
                    isDisabled={isInitializingPayment}
                    name="paymentProviderRadio"
                    onSelect={handleSelect}
                >
                    {methods.map((method) => {
                        const value = getUniquePaymentMethodId(method.id, method.gateway);
                        const showOnlyOnMobileDevices = get(
                            method,
                            'initializationData.showOnlyOnMobileDevices',
                            false,
                        );

                        if (showOnlyOnMobileDevices && !isMobile()) {
                            return;
                        }

                        return (
                            <PaymentMethodListItem
                                isDisabled={isInitializingPayment}
                                isEmbedded={isEmbedded}
                                isUsingMultiShipping={isUsingMultiShipping}
                                key={value}
                                method={method}
                                onUnhandledError={onUnhandledError}
                                value={value}
                            />
                        );
                    })}
                </Checklist>
            </>

        );
    };

interface PaymentMethodListItemProps {
    isDisabled?: boolean;
    isEmbedded?: boolean;
    isUsingMultiShipping?: boolean;
    method: PaymentMethod;
    value: string;
    onUnhandledError?(error: Error): void;
}

const PaymentMethodListItem: FunctionComponent<PaymentMethodListItemProps> = ({
    isDisabled,
    isEmbedded,
    isUsingMultiShipping,
    method,
    onUnhandledError,
    value,
}) => {
    const renderPaymentMethod = useMemo(() => {
        return (
            <PaymentMethodV2
                isEmbedded={isEmbedded}
                isUsingMultiShipping={isUsingMultiShipping}
                method={method}
                onUnhandledError={onUnhandledError || noop}
            />
        );
    }, [isEmbedded, isUsingMultiShipping, method, onUnhandledError]);

    const renderPaymentMethodTitle = useCallback(
        (isSelected: boolean) => <PaymentMethodTitle isSelected={isSelected} method={method} />,
        [method],
    );

    return (
        <ChecklistItem
            content={renderPaymentMethod}
            htmlId={`radio-${value}`}
            isDisabled={isDisabled}
            label={renderPaymentMethodTitle}
            value={value}
        />
    );
};


export function mapToDonationProps({
    checkoutService,
    checkoutState,
}: CheckoutContextProps): WithCheckoutCODProps | null {
    const {
        data: {
            getCart,
            getCheckout,
            getConsignments,
        },
        statuses: {
            isLoadingShippingOptions,
            isUpdatingConsignment,
            isUpdatingCheckout,
        },
    } = checkoutState;

    const checkout = getCheckout();
    const cart = getCart();
    const consignments = getConsignments() || [];

    if (!checkout || !cart) {
        return null;
    }

    const isLoading = (
        isLoadingShippingOptions() ||
        isUpdatingConsignment() ||
        isUpdatingCheckout()
    );


    return {
        cart,
        consignments,
        isInitializing: isUpdatingCheckout(),
        isLoading,
        loadCheckout: checkoutService.loadCheckout,
        loadShippingOptions: checkoutService.loadShippingOptions,
        updateCheckout: checkoutService.updateCheckout,
    };
}

// export default connectFormik(memo(PaymentMethodList));

export default connectFormik(withCheckout(mapToDonationProps)(PaymentMethodList));
