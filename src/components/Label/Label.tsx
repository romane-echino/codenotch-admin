import React from 'react';
import './Label.scss';
import { Sizing } from '../Sizing/Sizing';
import { Ii18nProps } from '@echino/echino.ui.sdk';
import dayjs from 'dayjs';

interface ILabelProps extends Ii18nProps {
	Title: string;
	Value: string;
	Size: 'ExtraSmall' | 'Small' | 'Normal' | 'Large';
	Icon: string;
	IconColor: 'Success' | 'Error' | 'Warning' | 'Info' | 'Primary' | 'Inherit';
	Align?: 'Left' | 'Center' | 'Right';

	TextColor: 'Normal' | 'Light' | 'Inherit';
	IconPlacement: 'Left' | 'Right';

	Type: 'Date' | 'Time' | 'DateTime' | 'Text' | 'Duration' | 'Currency' | 'Percentage' | 'Phone' | 'Email' | 'Url';

}

interface ILabelState {
}

export class Label extends React.Component<ILabelProps, ILabelState> {

	static defaultProps: Partial<ILabelProps> = {
		Align: 'Left',
		TextColor: 'Normal',
		Type: 'Text',
		IconPlacement: 'Left',
	}
	constructor(props: ILabelProps) {
		super(props);

		this.state = {
		}
	}


	getFormattedValue(): string {
		switch (this.props.Type) {
			case 'Date':
				return dayjs(this.props.Value).locale(this.props.language).format('ll');
			case 'Time':
				return dayjs(this.props.Value).locale(this.props.language).format('LT');
			case 'DateTime':
				return dayjs(this.props.Value).locale(this.props.language).format('lll');
			case 'Duration':
				return dayjs.duration(dayjs(this.props.Value).diff(dayjs())).locale(this.props.language).humanize(true);
			case 'Currency':
				return new Intl.NumberFormat(this.props.language, { style: 'currency', currency: 'CHF' }).format(parseInt(this.props.Value)/100);
			case 'Percentage':
				let percentageValue = parseFloat(this.props.Value);
				if (isNaN(percentageValue)) {
					return '0%';
				}
				return `${percentageValue < 1 ? percentageValue * 100 : percentageValue}%`;
			case 'Phone':
				return this.props.Value;
			case 'Email':
				return this.props.Value;
			case 'Url':
				return this.props.Value;
			default:
				return this.props.Value;
		}
	}

	getFormattedComponent(): { type: any, props: any } {
		let component = 'p'
		switch (this.props.Type) {
			case 'Date':
			case 'Time':
			case 'DateTime':
			case 'Duration':
			case 'Currency':
			case 'Percentage':
				return { type: component, props: {} };
			case 'Phone':
				return { type: 'a', props: { href: `tel:${this.props.Value}` } };
			case 'Email':
				return { type: 'a', props: { href: `mailto:${this.props.Value}` } };
			case 'Url':
				return { type: 'a', props: { href: this.props.Value } };
			default:
				return { type: component, props: {} };
		}
	}

	render() {
		let formattedComponent = this.getFormattedComponent();
		let Component = formattedComponent.type;

		let iconClass = '';
		switch (this.props.IconColor) {
			case 'Success': iconClass = 'text-green-500 dark:text-green-400'; break;
			case 'Error': iconClass = 'text-red-500 dark:text-red-400'; break;
			case 'Warning': iconClass = 'text-yellow-500 dark:text-yellow-400'; break;
			case 'Info': iconClass = 'text-blue-500 dark:text-blue-400'; break;
			case 'Primary': iconClass = 'text-primary-500 dark:text-primary-400'; break;
			case 'Inherit': iconClass = ''; break;
			default: iconClass = 'text-gray-800 dark:text-white/90'; break;
		}

		let componentClass = 'flex items-center justify-center gap-1';
		switch (this.props.Size) {
			case 'ExtraSmall': componentClass += ' text-xs'; break;
			case 'Small': componentClass += ' text-sm'; break;
			case 'Normal': componentClass += ' text-base'; break;
			case 'Large': componentClass += ' text-base sm:text-lg font-semibold'; break;
			default: componentClass += ' text-base'; break;
		}

		if (formattedComponent.type === 'a') {
			componentClass += ` ${iconClass}`;
		} else {
			switch (this.props.TextColor) {
				case 'Normal': componentClass += ' text-gray-800 dark:text-white/90'; break;
				case 'Light': componentClass += ' text-gray-500 dark:text-gray-400'; break;
				case 'Inherit': componentClass += ''; break;
			}
		}


		let titleClass = '';
		switch (this.props.Align) {
			case 'Left': componentClass += ' justify-start'; titleClass = 'text-left'; break;
			case 'Center': componentClass += ' justify-center'; titleClass = 'text-center'; break;
			case 'Right': componentClass += ' justify-end'; titleClass = 'text-right'; break;
			default: componentClass += ' justify-start'; titleClass = 'text-left'; break;
		}


		switch (this.props.IconPlacement) {
			case 'Left': iconClass += ' mr-1'; break;
			case 'Right': iconClass += ' ml-1'; break;
			default: iconClass += ' mr-1'; break;
		}

		return (
			<Sizing {...this.props}>
				{this.props.Title &&
					<p className={`${titleClass} mb-1  text-xs ${this.props.TextColor !== 'Inherit' ? 'text-gray-500 dark:text-gray-400' : 'opacity-60'} sm:text-sm`}>
						{this.props.Title}
					</p>
				}

				<Component {...formattedComponent.props} className={`${componentClass}`}>
					{this.props.Icon && this.props.IconPlacement === 'Left' &&
						<i className={`${this.props.Icon} ${iconClass} text-sm flex items-center justify-center`} />
					}

					{this.getFormattedValue()}

					{this.props.Icon && this.props.IconPlacement === 'Right' &&
						<i className={`${this.props.Icon} ${iconClass} text-sm flex items-center justify-center`} />
					}
				</Component>
			</Sizing>
		)
	}

}