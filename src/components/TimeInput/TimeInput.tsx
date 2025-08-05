import React from 'react';
import { AbstractInput, IInputProps } from '../AbstractInput/AbstractInput';
import { IBindableComponentProps } from '@echino/echino.ui.sdk';

interface ITimeInputProps extends IInputProps, IBindableComponentProps {
}


export const TimeInput: React.FC<ITimeInputProps> = (props) => {

	const [focused, setFocused] = React.useState(false);

	React.useEffect(() => {
		if (props.Value !== undefined && props.Value !== null && props.Value !== '') {
			updateValue(props.Value as string);
		}
	}, [props.Value]);

	const updateValue = (value: string) => {
		props.onPropertyChanged('value', undefined, value)
		props.OnChange?.(value);
	}

	return (
		<AbstractInput Focus={focused} {...props} Icon='fas fa-clock'>
			<input type="time"
				placeholder={props.Placeholder}
				defaultValue={props.Value}
				disabled={props.Disabled}
				onChange={(e) => updateValue(e.target.value)}
				className={`pl-9 px-4 py-2.5 w-full focus:border-0 focus:outline-hidden placeholder:text-gray-400 dark:placeholder:text-white/30`}
				onBlur={() => setFocused(false)}
				onFocus={() => setFocused(true)} />
		</AbstractInput>
	)
}