import React from 'react';
import './Label.scss';

interface ILabelProps {
	Title: string;
	Value: string;
	Size:'Small' | 'Normal' | 'Large';
	Icon: string;
	IconColor: 'Success' | 'Error' | 'Warning' | 'Info' | 'Primary';
}

interface ILabelState {
}

export class Label extends React.Component<ILabelProps, ILabelState> {

	constructor(props: ILabelProps) {
		super(props);

		this.state = {
		}
	}

	render() {

		let iconColorClass = '';
		switch (this.props.IconColor) {
			case 'Success': iconColorClass = 'text-green-500 dark:text-green-400'; break;
			case 'Error': iconColorClass = 'text-red-500 dark:text-red-400'; break;
			case 'Warning': iconColorClass = 'text-yellow-500 dark:text-yellow-400'; break;
			case 'Info': iconColorClass = 'text-blue-500 dark:text-blue-400'; break;
			case 'Primary': iconColorClass = 'text-purple-500 dark:text-purple-400'; break;
			default: iconColorClass = 'text-gray-500 dark:text-gray-400'; break;
		}

		let sizeClass = '';
		switch (this.props.Size) {
			case 'Small': sizeClass = 'text-xs'; break;
			case 'Normal': sizeClass = 'text-base'; break;
			case 'Large': sizeClass = 'text-base sm:text-lg font-semibold'; break;
			default: sizeClass = 'text-base'; break;
		}

		return (
			<div>
				<p className="mb-1 text-center text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
					{this.props.Title}
				</p>
				<p className={`flex items-center justify-center gap-1 text-gray-800 dark:text-white/90 ${sizeClass}`}>
					{this.props.Value}
					{this.props.Icon &&
						<i className={`${this.props.Icon} ${iconColorClass} text-sm`} />
					}
				</p>
			</div>
		)
	}

}