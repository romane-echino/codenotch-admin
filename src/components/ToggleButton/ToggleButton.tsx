import React from 'react';
import './ToggleButton.scss';
import { Action, IBindableComponentProps } from '@echino/echino.ui.sdk';

interface IToggleButtonProps extends IBindableComponentProps {
	Source: string[];
	onChange?: Action<{ index: number, value: string }>;
}

interface IToggleButtonState {
	value: string;
	selectedIndex: number;
}

export class ToggleButton extends React.Component<IToggleButtonProps, IToggleButtonState> {

	constructor(props: IToggleButtonProps) {
		super(props);

		this.state = {
			value: props.Source[0],
			selectedIndex: 0
		}
	}

	changeValue(value: string, index) {
		this.setState({ value: value }, () => {
			this.props.onPropertyChanged('Value', undefined, value)
			if (this.props.onChange) {
				this.props.onChange({ index, value });
			}
		});
	}

	render() {
		return (
			<div className="flex flex-wrap items-center gap-x-1 gap-y-2 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
				{this.props.Source.map((item, index) => (
					<button key={index} className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md h group hover:text-gray-900 dark:hover:text-white ${this.state.selectedIndex === index ? 'text-gray-900 dark:text-white bg-white dark:bg-gray-800' : 'text-gray-500 dark:text-gray-400'}`} onClick={() => this.setState({ selectedIndex: index })}>
						{item}
					</button>
				))}
			</div>
		)
	}
}