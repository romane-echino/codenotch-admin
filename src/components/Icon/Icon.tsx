import React from 'react';
import './Icon.scss';

interface IIconProps {
	Value:string;
	Size?: 'ExtraSmall' | 'Small' | 'Normal' | 'Large' | 'ExtraLarge';
	Color: 'Primary'| 'Success' | 'Error' | 'Warning' | 'Info';
	Animate?: 'None'| 'Beat' | 'Fade' | 'Spin';
}

interface IIconState {
}

export class Icon extends React.Component<IIconProps, IIconState> {

	constructor(props: IIconProps) {
		super(props);

		this.state = {
		}
	}

	render() {
		let classes = '';
		let containerClasses = '';
		switch (this.props.Size) {
			case 'ExtraSmall':
				classes = 'text-xs';
				containerClasses = 'size-4';
				break;
			case 'Small':
				classes = 'text-sm';
				containerClasses = 'size-5';
				break;
			case 'Normal':
				classes = 'text-base';
				containerClasses = 'size-6';
				break;
			case 'Large':
				classes = 'text-lg';
				containerClasses = 'size-7';
				break;
			case 'ExtraLarge':
				classes = 'text-xl';
				containerClasses = 'size-8';
				break;
			default:
				classes = 'text-base';
				containerClasses = 'size-6';
				break;
		}

		switch (this.props.Color) {
			case 'Primary':
				classes += ' text-primary-500';
				break;
			case 'Success':
				classes += ' text-success-500';
				break;
			case 'Error':
				classes += ' text-error-500';
				break;
			case 'Warning':
				classes += ' text-warning-500';
				break;
			case 'Info':
				classes += ' text-info-500';
				break;
			default:
				classes += ' text-gray-500';
				break;
		}

		switch (this.props.Animate) {
			case 'Beat':
				classes += ' fa-beat';
				break;
			case 'Fade':
				classes += ' fa-fade';
				break;
			case 'Spin':
				classes += ' fa-spin';
				break;
		}

		return (
			<div className={`${containerClasses} flex justify-center items-center `}>
				<i className={`${this.props.Value} ${classes}`} />
			</div>
		)
	}

}