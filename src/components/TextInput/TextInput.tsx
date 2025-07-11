import React from 'react';
import './TextInput.scss';
import { Action, IBindableComponentProps, IUserInfoProps } from '@echino/echino.ui.sdk';
import { Sizing } from '../Sizing/Sizing';
import { IPageInheritedProps } from '../Page/Page';
import { AbstractInput, IInputProps } from '../AbstractInput/AbstractInput';

interface ITextInputProps extends IInputProps, IBindableComponentProps, IPageInheritedProps, IUserInfoProps {

	EditMode:(item:any) => boolean
}

export const TextInput: React.FC<ITextInputProps> = (props) => {
	const [focused, setFocused] = React.useState(false);


	React.useEffect(() => {
		// Handle any side effects or updates based on props or state changes
	}, [props, focused]);

	const updateValue = (value: string) => {
		props.onPropertyChanged('Value', undefined, value)
		if (props.OnChange) {
			props.OnChange(value);
		}
	}

	return (
		<AbstractInput Focus={focused} {...props}>
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