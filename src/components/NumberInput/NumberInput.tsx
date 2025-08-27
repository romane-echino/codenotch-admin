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


	const isValid = (value: number | undefined): boolean => {
		if (value === undefined) return false;
		if (props.Min !== undefined && value < props.Min) return false;
		if (props.Max !== undefined && value > props.Max) return false;
		return true;
	};

	const updateValue = (value: string | number) => {
		const numericValue = typeof value === 'number' ? value : parseFloat(value);
		if (isNaN(numericValue)) {
			setError(true);
			setValue(undefined);
		}
		else if (!isValid(numericValue)) {
			setError(true);
			setValue(numericValue);
		} else {
			setError(false);
			props.onPropertyChanged('value', undefined, numericValue);
			props.OnChange?.(numericValue);
			props._internalOnChange?.(numericValue);
			setValue(numericValue);
		}

	}

	const valueDelta = (delta: number) => {

		let result = (value || 0) + (delta * (props.Step || 1));
		if (props.Step) {
			result = Math.round(result / props.Step) * props.Step;
		}
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
				onChange={(e) => updateValue(e.target.value)}
				className={`${props.Icon && 'pl-9'} px-4 py-2.5 w-full focus:border-0 focus:outline-hidden placeholder:text-gray-400 dark:placeholder:text-white/30`}
				onBlur={() => {
					setFocused(false);
					if (!isValid(value)) {
						setValue('' as any);
						setError(false)
					}
				}}
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
