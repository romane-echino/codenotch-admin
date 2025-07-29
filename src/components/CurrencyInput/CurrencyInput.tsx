import React from 'react';
import {  IBindableComponentProps, IUserInfoProps } from '@echino/echino.ui.sdk';
import { IPageInheritedProps } from '../Page/Page';
import { AbstractInput, IInputProps } from '../AbstractInput/AbstractInput';

interface ICurrencyInputProps extends IInputProps, IBindableComponentProps, IPageInheritedProps, IUserInfoProps {
	Currency?: string; // Optional currency prop
}

export const CurrencyInput: React.FC<ICurrencyInputProps> = (props) => {
	const { Icon = 'fas fa-dollar-sign', Placeholder = '0.00', Currency = 'CHF' } = props;
	const [focused, setFocused] = React.useState(false);


	React.useEffect(() => {
		if (props.Value !== undefined && props.Value !== null && props.Value !== '') {
			updateValue(props.Value as number);
		}
	}, [props.Value]);

	const updateValue = (value: number) => {
		let numericValue = Math.floor(value * 100);
		props.onPropertyChanged('value', undefined, numericValue);
		if (props.OnChange) {
			props.OnChange(numericValue);
		}
	}

	return (
		<AbstractInput Focus={focused} {...props} Icon={Icon} Suffix={<div>{Currency}</div>}>
			<input type="number"
				placeholder={Placeholder}
				defaultValue={props.Value}
				disabled={props.Disabled}
				step=".01"
				onChange={(e) => updateValue(e.target.value)}
				className={`${Icon && 'pl-9'} px-4 py-2.5 w-full focus:border-0 focus:outline-hidden placeholder:text-gray-400 dark:placeholder:text-white/30`}
				onBlur={() => setFocused(false)}
				onFocus={() => setFocused(true)} />
		</AbstractInput>
	)
}