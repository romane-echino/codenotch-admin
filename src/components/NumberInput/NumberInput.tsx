import React from 'react';
import './TextInput.scss';
import { IBindableComponentProps, IUserInfoProps } from '@echino/echino.ui.sdk';
import { IPageInheritedProps } from '../Page/Page';
import { AbstractInput, IInputProps } from '../AbstractInput/AbstractInput';

interface INumberInputProps extends IInputProps, IBindableComponentProps, IPageInheritedProps, IUserInfoProps {
	Min?: number;
	Max?: number;
	Step?: number;
	ErrorText?: string;
}

export const NumberInput: React.FC<INumberInputProps> = (props) => {
	const [focused, setFocused] = React.useState(false);
	const [error, setError] = React.useState<boolean>(false);

	React.useEffect(() => {
		if (props.Value !== undefined && props.Value !== null && props.Value !== '') {
			updateValue(props.Value as string);
		}
	}, [props.Value]);

	const updateValue = (value: string | number) => {
		if (props.Min !== undefined && props.Max !== undefined && props.Step !== undefined) {
			const numericValue = typeof value === 'number' ? value : parseFloat(value);
			if (isNaN(numericValue)) {
				setError(true);
			} else {
				if (numericValue < props.Min || numericValue > props.Max) {
					setError(true);
				} else {
					setError(false);
					props.onPropertyChanged('value', undefined, numericValue);
					props.OnChange?.(numericValue);
					props._internalOnChange?.(numericValue);
				}
			}
		}
	}

	return (
		<AbstractInput Focus={focused} Error={error} ErrorText={props.ErrorText} {...props}>
			<input type="number"
				placeholder={props.Placeholder}
				defaultValue={props.Value}
				disabled={props.Disabled}
				min={props.Min}
				max={props.Max}
				step={props.Step}
				onChange={(e) => updateValue(e.target.value)}
				className={`${props.Icon && 'pl-9'} px-4 py-2.5 w-full focus:border-0 focus:outline-hidden placeholder:text-gray-400 dark:placeholder:text-white/30`}
				onBlur={() => setFocused(false)}
				onFocus={() => setFocused(true)} />
		</AbstractInput>
	)
}
	