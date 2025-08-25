import React from 'react';
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
	const [value, setValue] = React.useState<number | undefined>(parseFloat(props.Value as string) || undefined);
	const [error, setError] = React.useState<boolean>(false);

	React.useEffect(() => {
		if (props.Value !== undefined && props.Value !== null && props.Value !== '') {
			updateValue(props.Value as string);
		}
	}, [props.Value]);

	const updateValue = (value: string | number) => {

		const numericValue = typeof value === 'number' ? value : parseFloat(value);
		if (isNaN(numericValue)) {
			setError(true);
		} else {
			if (props.Min !== undefined && props.Max !== undefined && props.Step !== undefined) {
				if (numericValue < props.Min || numericValue > props.Max) {
					setError(true);
				}
				else {
					setError(false);
					props.onPropertyChanged('value', undefined, numericValue);
					props.OnChange?.(numericValue);
					props._internalOnChange?.(numericValue);
					setValue(numericValue);
				}
			}
			else {
				setError(false);
				props.onPropertyChanged('value', undefined, numericValue);
				props.OnChange?.(numericValue);
				props._internalOnChange?.(numericValue);
				setValue(numericValue);
			}
		}

	}

	const valueDelta = (delta: number) => {

		const result = (value || 0) + (delta * (props.Step || 1));
		console.log('valueDelta', delta, value, result);
		if (props.Min !== undefined && props.Max !== undefined) {
			if (result < props.Min) {
				updateValue(props.Min);
			} else if (result > props.Max) {
				updateValue(props.Max);
			} else {
				updateValue(result);
			}
		} else {
			updateValue(result);
		}
	}

	return (
		<AbstractInput Focus={focused} Error={error} ErrorText={props.ErrorText} {...props}>
			<input type="number"
				placeholder={props.Placeholder}
				value={value}
				disabled={props.Disabled}
				min={props.Min}
				max={props.Max}
				step={props.Step}
				onChange={(e) => updateValue(e.target.value)}
				className={`${props.Icon && 'pl-9'} px-4 py-2.5 w-full focus:border-0 focus:outline-hidden placeholder:text-gray-400 dark:placeholder:text-white/30`}
				onBlur={() => setFocused(false)}
				onFocus={() => setFocused(true)} />


			<div className='right-1 absolute flex gap-1 '>
				<button onClick={() => valueDelta(1)} tabIndex={-1} className='cursor-pointer hover:text-primary hover:border-primary hover:ring-3 hover:ring-primary/10 size-5 flex items-center justify-center border border-gray-300 dark:border-gray-700 rounded-md'>
					<i className="fa-solid fa-plus"></i>
				</button>
				<button onClick={() => valueDelta(-1)} tabIndex={-1} className='cursor-pointer hover:text-primary hover:border-primary hover:ring-3 hover:ring-primary/10 size-5 flex items-center justify-center border border-gray-300 dark:border-gray-700 rounded-md'>
					<i className="fa-solid fa-minus"></i>
				</button>
			</div>

		</AbstractInput>
	)
}
