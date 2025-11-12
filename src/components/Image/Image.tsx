import React from 'react';
import { Sizing } from '../Sizing/Sizing';

interface IImageProps {
	Source: string;
	AlternativeText?: string;
	Rounded?: boolean;
	FullWidth?: boolean;
}

export const Image: React.FC<IImageProps> = (props) => {
	return (
		<Sizing {...props}>
			<img
			src={props.Source}
			alt={props.AlternativeText}
			className={`${props.Rounded ? 'rounded-2xl' : ''} ${props.FullWidth ? 'w-full' : ''}`}
		/>
		</Sizing>
	);
};	