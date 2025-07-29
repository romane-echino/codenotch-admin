import React from 'react';
import { AbstractInput, IInputProps } from '../AbstractInput/AbstractInput';
import { IBindableComponentProps, IUserInfoProps } from '@echino/echino.ui.sdk';
import { IPageInheritedProps } from '../Page/Page';

interface IMailInputProps extends IInputProps, IBindableComponentProps, IPageInheritedProps, IUserInfoProps {
}

export const MailInput: React.FC<IMailInputProps> = (props) => {
	const { Icon = 'far fa-envelope', Placeholder = 'info@gmail.com'} = props;
	const [focused, setFocused] = React.useState(false);


	React.useEffect(() => {
		if (props.Value !== undefined && props.Value !== null && props.Value !== '') {
			updateValue(props.Value as string);
		}
	}, [props.Value]);

	const updateValue = (value: string) => {
		props.onPropertyChanged('value', undefined, value)
		if (props.OnChange) {
			props.OnChange(value);
		}
	}

	return (
		<AbstractInput Focus={focused} {...props} Icon={Icon}>
			<input type="email"
				placeholder={Placeholder}
				defaultValue={props.Value}
				disabled={props.Disabled}
				onChange={(e) => updateValue(e.target.value)}
				className={`${Icon && 'pl-9'} px-4 py-2.5 w-full focus:border-0 focus:outline-hidden placeholder:text-gray-400 dark:placeholder:text-white/30`}
				onBlur={() => setFocused(false)}
				onFocus={() => setFocused(true)} />
		</AbstractInput>
	)
}