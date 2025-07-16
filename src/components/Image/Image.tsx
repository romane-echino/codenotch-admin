import React from 'react';
import './Image.scss';

interface IImageProps {
	Source: string;
	AlternativeText?: string;
	Rounded?: boolean;
}

export const Image: React.FC<IImageProps> = ({ Source, AlternativeText, Rounded }) => {
	return (
		<img
			src={Source}
			alt={AlternativeText}
			className={Rounded ? 'rounded-2xl' : ''}
		/>
	);
};