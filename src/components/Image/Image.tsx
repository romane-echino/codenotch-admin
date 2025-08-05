import React from 'react';
import './Image.scss';
import { Sizing } from '../Sizing/Sizing';

interface IImageProps {
	Source: string;
	AlternativeText?: string;
	Rounded?: boolean;
}

export const Image: React.FC<IImageProps> = (props) => {
	return (
		<Sizing {...props}>
			<img
			src={props.Source}
			alt={props.AlternativeText}
			className={`${props.Rounded ? 'rounded-2xl' : ''} w-full`}
		/>
		</Sizing>
	);
};	