import React from 'react';
import './Mock.scss';
import { appyTint } from '../../utils/ColorPaletteUtils';

interface IMockProps {
	Tint?: string;
}

export const Mock: React.FC<IMockProps> = (props) => {
	appyTint(props?.Tint || '#465fff');
	return null;
}