import React from 'react';
import './TextInput.scss';
import { Action, IBindableComponentProps, IUserInfoProps } from '@echino/echino.ui.sdk';
import { Sizing } from '../Sizing/Sizing';
import { IPageInheritedProps } from '../Page/Page';
import { AbstractInput, IInputProps } from '../AbstractInput/AbstractInput';

interface ITextInputProps extends IInputProps, IBindableComponentProps, IPageInheritedProps, IUserInfoProps {
	Regex?: string;
	ErrorText?: string;
}

export const TextInput: React.FC<ITextInputProps> = (props) => {
	const [focused, setFocused] = React.useState(false);
	const [error, setError] = React.useState<boolean>(false);

	React.useEffect(() => {
		if (props.Value !== undefined && props.Value !== null && props.Value !== '') {
			updateValue(props.Value as string);
		}
	}, [props.Value]);

	const updateValue = (value: string) => {
		if (props.Regex) {
			const regexp = new RegExp(props.Regex);
			if( value && regexp.test(value) === false) {
				setError(true);
			}
			else{
				setError(false);
				props.onPropertyChanged('value', undefined, value);
				props.OnChange?.(value);
			}
		}
		else {
			props.onPropertyChanged('value', undefined, value)
			props.OnChange?.(value);
		}

	}

	return (
		<AbstractInput Focus={focused} Error={error} ErrorText={props.ErrorText} {...props}>
			<input type="text"
				placeholder={props.Placeholder}
				defaultValue={props.Value}
				disabled={props.Disabled}
				onChange={(e) => updateValue(e.target.value)}
				className={`${props.Icon && 'pl-9'} px-4 py-2.5 w-full focus:border-0 focus:outline-hidden placeholder:text-gray-400 dark:placeholder:text-white/30`}
				onBlur={() => setFocused(false)}
				onFocus={() => setFocused(true)} />
		</AbstractInput>
	)
}