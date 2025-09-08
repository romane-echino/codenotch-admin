import React from 'react';
import { Sizing } from "../Sizing/Sizing";
import { Box, IBoxProps } from "./Box";

export const BoxProxy: React.FC<IBoxProps> = (props) => {
    const { HasLayout = true } = props;
    if (HasLayout) {
        return (
            <Box {...props}>
                {props.children}
            </Box>
        )
    }
    else {
        return (
            <Sizing {...props}>
                {props.children}
            </Sizing>
        )
    }
}