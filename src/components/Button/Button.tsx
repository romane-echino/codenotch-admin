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
		return (
			<button className="text-theme-sm shadow-theme-xs inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
				{this.props.Icon && <i className={`${this.props.Icon} text-lg flex items-center`} />}
				<span>{this.props.Label}</span>
			</button>
		)
	}

}