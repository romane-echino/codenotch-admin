import React from 'react';
import './Label.scss';
import { Sizing } from '../Sizing/Sizing';

interface ILabelProps {
	Title: string;
	Value: string;
	Size: 'ExtraSmall' | 'Small' | 'Normal' | 'Large';
	Icon: string;
	IconColor: 'Success' | 'Error' | 'Warning' | 'Info' | 'Primary';
	Align?: 'Left' | 'Center' | 'Right';

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
		//text-gray-500 dark:text-gray-400
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
			case 'ExtraSmall': sizeClass = 'text-xs'; break;
			case 'Small': sizeClass = 'text-sm'; break;
			case 'Normal': sizeClass = 'text-base'; break;
			case 'Large': sizeClass = 'text-base sm:text-lg font-semibold'; break;
			default: sizeClass = 'text-base'; break;
		}


		let titleClass = '';
		switch (this.props.Align) {
			case 'Left': sizeClass += ' justify-start'; titleClass = 'text-left'; break;
			case 'Center': sizeClass += ' justify-center'; titleClass = 'text-center'; break;
			case 'Right': sizeClass += ' justify-end'; titleClass = 'text-right'; break;
			default: sizeClass += ' justify-start'; titleClass = 'text-left'; break;
		}

		return (
			<Sizing {...this.props}>
				{this.props.Title &&
					<p className={`${titleClass} mb-1  text-xs text-gray-500 dark:text-gray-400 sm:text-sm`}>
						{this.props.Title}
					</p>
				}

				<p className={`flex items-center justify-center gap-1 text-gray-800 dark:text-white/90 ${sizeClass}`}>
					{this.props.Value}
					{this.props.Icon &&
						<i className={`${this.props.Icon} ${iconColorClass} text-sm`} />
					}
				</p>
			</Sizing>
		)
	}

}