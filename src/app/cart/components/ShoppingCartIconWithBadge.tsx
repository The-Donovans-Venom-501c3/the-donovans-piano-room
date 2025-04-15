"use client";
import { Badge } from '@mui/material';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { useAtomValue } from 'jotai';

import { SxProps } from '@mui/system';
import { addedCartItemsAtom } from '@/store/cartStore';

const ShoppingCartIconWithBadge = () => {
    const iconStyles: SxProps = {
        fontSize: 25,
        '&:hover': {
            color: '#E98427',
        },
    };
    const cartItems = useAtomValue(addedCartItemsAtom);
    const quantity = cartItems.reduce((acc, curr) => {
        acc += curr.quantity;
        return acc;
    }, 0);
    return (
        <Badge badgeContent={quantity} color="success" >
            <ShoppingCartOutlinedIcon sx={iconStyles} />
        </Badge>
    )
}

export default ShoppingCartIconWithBadge;