import { Cart,ShippingOption, Consignment, RequestOptions, CheckoutParams, CheckoutSelectors } from '@bigcommerce/checkout-sdk';
import React, { FunctionComponent, memo, useCallback, useState, useEffect } from 'react'; //add memo 
import { CheckoutContextProps, withCheckout } from '../../checkout';
import { EMPTY_ARRAY } from '../../common/utility';
import { Checklist, ChecklistItem } from '../../ui/form';
import { LoadingOverlay } from '../../ui/loading';
import StaticShippingOption from './StaticShippingOption';

interface ShippingOptionListItemProps {
    consignmentId: string;
    shippingOption: ShippingOption;
}
const ShippingOptionListItem: FunctionComponent<ShippingOptionListItemProps> = ({
    consignmentId,
    shippingOption,
}) => {
    const renderLabel = useCallback(
        () => (
            <div className="shippingOptionLabel">
                <StaticShippingOption displayAdditionalInformation={true} method={shippingOption} />
            </div>
        ),
        [shippingOption],
    );
    
    return (
        <ChecklistItem
            htmlId={`shippingOptionRadio-${consignmentId}-${shippingOption.id}`}
            label={renderLabel}
            value={shippingOption.id}
        />
    );
};



export interface ShippingOptionListProps {
    consignmentId: string;
    inputName: string;
    isLoading: boolean;
    selectedShippingOptionId?: string;
    shippingOptions?: ShippingOption[];
    onSelectedOption(consignmentId: string, shippingOptionId: string): void;
}


export interface WithCheckoutShippingProps {
    cart: Cart;
    consignments: Consignment[];
    loadCheckout(id: any, options?: RequestOptions<CheckoutParams>): Promise<CheckoutSelectors>;
}

const ShippingOptionsList: FunctionComponent<ShippingOptionListProps & WithCheckoutShippingProps> = ({
    consignmentId,
    inputName,
    isLoading,
    shippingOptions = EMPTY_ARRAY,
    selectedShippingOptionId,
    cart,
    loadCheckout,
    onSelectedOption
}) => {
    const handleSelect = useCallback(
        (value: string) => {
            onSelectedOption(consignmentId, value);
        },
        [consignmentId, onSelectedOption],
    );

    if (!shippingOptions.length) {
        return null;
    }

    const [data, setData] = useState(shippingOptions);

    const FREE_COST = data.filter(item => item.cost === 0); //Free Shipping filter items..
    const SHPPING_COST = data.filter(item => item.cost > 1); //Paied Shipping filter items..

    const putShippingCost = (method: string) => {
        const options = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "shippingOptionId": method
            })
        };
        fetch(`/api/storefront/checkouts/${cart.id}/consignments/${consignmentId}`, options)
            .then(response => response.json())
            .then(response => {
                console.log(response);
                loadCheckout(cart.id);
            })
            .catch(err => console.error(err));
    }


    useEffect(() => {
        const SHIPPING_CONDITION_AMOUNT = 10_000
        // ????????? ????????????
        if (cart.cartAmount >= SHIPPING_CONDITION_AMOUNT) {
            setData(FREE_COST);
            putShippingCost(FREE_COST[0].id);
        }
        // ????????? ????????????
        if (cart.cartAmount < SHIPPING_CONDITION_AMOUNT) {
            putShippingCost(SHPPING_COST[0].id);
        }
    }, [])

    return (
        <LoadingOverlay isLoading={isLoading}>
            <Checklist
                aria-live="polite"
                defaultSelectedItemId={selectedShippingOptionId}
                name={inputName}
                onSelect={handleSelect}
            >
                {data.map((shippingOption) => (
                    <ShippingOptionListItem
                        consignmentId={consignmentId}
                        key={shippingOption.id}
                        shippingOption={shippingOption}
                    />
                ))}
            </Checklist>
        </LoadingOverlay>
    );
};



export function mapToDonationProps({
    checkoutService,
    checkoutState,
}: CheckoutContextProps): WithCheckoutShippingProps | null {
    const {
        data: {
            getCart,
            getCheckout,
            getConsignments
        }
    } = checkoutState;

    const checkout = getCheckout();
    const cart = getCart();
    const consignments = getConsignments() || [];

    if (!checkout || !cart) {
        return null;
    }

    return {
        cart,
        consignments,
        loadCheckout: checkoutService.loadCheckout
    };
}

export default memo(withCheckout(mapToDonationProps)(ShippingOptionsList));

