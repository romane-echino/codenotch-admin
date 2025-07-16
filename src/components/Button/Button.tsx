import React from 'react';
import './Button.scss';
import { Action } from '@echino/echino.ui.sdk';
import { Label } from '../Label/Label';

export interface IButtonProps {
	Label: string;
	Icon?: string;
	Type: 'Primary' | 'Secondary' | 'Tertiary' | 'Success' | 'Error' | 'Warning' | 'Info' | 'MenuItem';
	OnClick: Action<void>;

	Confirmation:string;
}

export const Button: React.FC<IButtonProps> = (props) => {

	let classes = '';
	let basics = 'inline-flex font-medium px-4 py-2.5 justify-center';

	switch (props.Type) {
		case 'Primary':
			classes = `${basics} bg-primary-500 text-white hover:bg-primary-600`;
			break;
		case 'Secondary':
			classes = `${basics} border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200`;
			break;
		case 'Success':
			classes = `${basics} bg-success-500 text-white hover:bg-success-600`;
			break;
		case 'Error':
			classes = `${basics} bg-error-500 text-white hover:bg-error-600`;
			break;
		case 'Warning':
			classes = `${basics} bg-warning-500 text-white hover:bg-warning-600`;
			break;
		case 'Info':
			classes = `${basics} bg-info-500 text-white hover:bg-info-600`;
			break;
		case 'MenuItem':
			classes = 'flex w-full px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300';
			break;
		default:
			classes = `${basics} border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200`;
			break;
	}

	const handleClick = () => {
		if (props.Confirmation) {
			if (window.confirm(props.Confirmation)) {
				props.OnClick();
			}
		}
		else{
			props.OnClick();
		}
	}

	return (
		<button onClick={handleClick} className={`cursor-pointer whitespace-nowrap items-center gap-2 rounded-lg    ${classes}`}>
			{props.Icon && <i className={`${props.Icon} text-lg flex items-center`} />}
			<span>{props.Label}</span>
		</button>
	)
}