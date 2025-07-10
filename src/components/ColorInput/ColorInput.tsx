import React from 'react';
import './ColorInput.scss';
import { AbstractInput, IInputProps } from '../AbstractInput/AbstractInput';
import { IBindableComponentProps } from '@echino/echino.ui.sdk';
import { IPageInheritedProps } from '../Page/Page';

interface IColorInputProps extends IInputProps, IBindableComponentProps, IPageInheritedProps {
}


export const ColorInput: React.FC<IColorInputProps> = (props) => {

	const inputRef = React.useRef<HTMLInputElement>(null);
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
				ref={inputRef}
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