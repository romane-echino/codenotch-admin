import React, { useState, useRef, useEffect } from 'react';
import { AbstractInput, IInputProps } from '../AbstractInput/AbstractInput';
import { IBindableComponentProps } from '@echino/echino.ui.sdk';

interface SliderProps extends IInputProps, IBindableComponentProps {
	Min?: number;
	Max?: number;
	Step?: number;
	DefaultValue?: number;
	Value?: number;
	OnChange?: (value: number) => void;
	ShowValue?: boolean;
	ShowMinMax?: boolean;
	Unit?: string;
}

export const Slider: React.FC<SliderProps> = (props) => {
	const {
		Min = 0,
		Max = 100,
		Step = 1,
		Disabled = false,
		Value: PropsValue,
		ShowMinMax = true,
		ShowValue = true,
		Unit,
	} = props;
	const [focused, setFocused] = React.useState(false);
	const [internalValue, setInternalValue] = useState<number>(
		PropsValue !== undefined ? PropsValue : Min
	);

	useEffect(() => {
		if (PropsValue !== undefined) {
			setInternalValue(PropsValue);
			props.onPropertyChanged('value', undefined, PropsValue)
		}
	}, [PropsValue]);


	useEffect(() => {
		setInternalValue(PropsValue !== undefined ? PropsValue > Max ? Max : PropsValue < Min ? Min : PropsValue : Min);
	}, [Min, Max, Step]);

	const Value = PropsValue !== undefined ? PropsValue : internalValue;

	const percentage = ((Value - Min) / (Max - Min)) * 100;

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = parseFloat(e.target.value);
		setInternalValue(newValue);
		props.onPropertyChanged('value', undefined, newValue)
		if (props.OnChange) {
			props.OnChange(newValue);
		}
	};

	return (
		<AbstractInput Focus={focused} {...props} Title={ShowValue ? (props.Title ? props.Title + ' : ' : '') + `${Value}${Unit ? ' ' + Unit : ''}` : props.Title}>
			<div className={`w-full ${props.Icon && 'pl-9'} px-4  py-2.5`}>

				<div className="relative">
					{/* Track background */}
					<div
						className={`w-full h-3 rounded-lg bg-gray-200 dark:bg-gray-700`}
					></div>

					{/* Filled track */}
					<div
						className={`absolute left-0 top-0 h-3 rounded-lg bg-primary`}
						style={{ width: `${percentage}%` }}
					></div>

					{/* Input range */}
					<input
						type="range"
						min={Min}
						max={Max}
						step={Step}
						value={Value}
						onChange={handleChange}
						onFocus={() => setFocused(true)}
						onBlur={() => setFocused(false)}
						disabled={Disabled}
						className={`
            absolute top-0 w-full h-full opacity-0 cursor-pointer
            ${Disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
          `}
						style={{ margin: 0 }}
					/>

					{/* Thumb */}
					<div
						className={`absolute h-4 w-4 -mt-[14px] rounded-full bg-primary shadow-md transform -translate-x-1/2 pointer-events-none`}
						style={{ left: `${percentage}%` }}
					></div>
				</div>

				{/* Min/Max labels */}
				{ShowMinMax && (
					<div className="flex justify-between mt-1">
						<span className="text-xs text-gray-500 dark:text-gray-400">{Min} {Unit}</span>
						<span className="text-xs text-gray-500 dark:text-gray-400">{Max} {Unit}</span>
					</div>
				)}
			</div>
		</AbstractInput>
	);
};