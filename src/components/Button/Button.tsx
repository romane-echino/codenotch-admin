import React from 'react';
import './Button.scss';
import { Action } from '@echino/echino.ui.sdk';
import { Label } from '../Label/Label';

interface IButtonProps {
	Label: string;
	Icon?: string;
	Type: 'Primary' | 'Secondary' | 'Success' | 'Error' | 'Warning' | 'Info';
	OnClick: Action<void>;
}

interface IButtonState {
}

export class Button extends React.Component<IButtonProps, IButtonState> {

	constructor(props: IButtonProps) {
		super(props);

		this.state = {
		}
	}

	render() {
		let classes = '';
		switch (this.props.Type) {
			case 'Primary':
				classes = 'bg-primary-500 text-white hover:bg-primary-600';
				break;
			case 'Secondary':
				classes = 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200';
				break;
			case 'Success':
				classes = 'bg-success-500 text-white hover:bg-success-600';
				break;
			case 'Error':
				classes = 'bg-error-500 text-white hover:bg-error-600';
				break;
			case 'Warning':
				classes = 'bg-warning-500 text-white hover:bg-warning-600';
				break;
			case 'Info':
				classes = 'bg-info-500 text-white hover:bg-info-600';
				break;
			default:
				classes = 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200';
				break;
		}

		return (
			<button onClick={() => this.props.OnClick()} className={`cursor-pointer justify-center whitespace-nowrap inline-flex items-center gap-2 rounded-lg  px-4 py-2.5 font-medium ${classes}`}>
				{this.props.Icon && <i className={`${this.props.Icon} text-lg flex items-center`} />}
				<span>{this.props.Label}</span>
			</button>
		)
	}

}