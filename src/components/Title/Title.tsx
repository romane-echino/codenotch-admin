import React from 'react';
import { BoxTitle, IBoxProps } from '../Box/Box';
import { Sizing } from '../Sizing/Sizing';

interface ITitleProps extends IBoxProps {
}

export const Title: React.FC<ITitleProps> = (props) => {
	return (
		<Sizing>
			<BoxTitle {...props} DisableMargins={true} />
		</Sizing>
	)
}