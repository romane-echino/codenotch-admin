import React, { useRef } from 'react';
import './Checkbox.scss';
import { Sizing } from '../Sizing/Sizing';
import { Action, IBindableComponentProps } from '@echino/echino.ui.sdk';
import { Helper } from '../AbstractInput/Helper';
import { AbstractInputTitle } from '../AbstractInput/AbstractInput';

interface ICheckboxProps extends IBindableComponentProps {
	Title?: string;
	Subtitle?: string;
	Value?: boolean;
	ColSpan?: '1/2' | '1/3' | '1/4' | '2/3' | '3/4' | 'full' | 'none';
	Icon?: string;
	Disabled?: boolean;
	Helper?: string;
	Layout?: 'Inline' | 'Input';

	EnabledText?: string;
	DisabledText?: string;

	OnChange?: Action<boolean>;
	_internalOnChange?: (value: boolean) => void;
}

export const Checkbox: React.FC<ICheckboxProps> = (props) => {
	const [selected, setSelected] = React.useState<boolean>(props.Value || false);
	const { Layout = 'Inline' } = props;
	React.useEffect(() => {
		if (props.Value !== undefined && props.Value !== null) {
			updateValue(props.Value);
		}
	}, [props.Value]);

	const updateValue = (value: boolean) => {
		console.log('Checkbox value changed:', JSON.stringify(value), props.OnChange ? 'yes' : 'no');
		setSelected(value);
		props.onPropertyChanged('value', undefined, value)
		props.OnChange?.(value);
		props._internalOnChange?.(value);
	}

	const columnTemplate = `auto ${props.Icon ? 'auto ' : ''}1fr ${(props.EnabledText || props.DisabledText) ? 'auto ' : ''}${props.Helper ? 'auto' : ''}`;
	if (Layout === 'Input') {
		return (
			<Sizing {...props} Containered={true}>
				<AbstractInputTitle {...props} />

				<div
					onClick={() => updateValue(!selected)}
					className={`flex min-h-11 w-full cursor-pointer rounded-lg border border-gray-300 dark:border-gray-700 ${props.Disabled ? 'opacity-50 pointer-events-none' : ''}  bg-transparent text-sm text-gray-800 dark:text-white/90 border-gray-300 dark:border-gray-700`}>
					<div className='relative grow group flex items-center '>
						{props.Icon &&
							<span className="absolute min-w-4 flex items-center justify-center pointer-events-none left-3 top-1/2 -translate-y-1/2">
								<i className={`${props.Icon} text-gray-500 dark:text-gray-400`}></i>
							</span>
						}

						<div className='pl-4 py-2.5 w-full flex gap-1'>

							<div tabIndex={0}
								onKeyUp={(e) => {
									if (e.key === 'Enter' || e.key === ' ') {
										updateValue(!selected);
									}
								}}
								className={` ${selected ? 'border-primary bg-primary dark:bg-primary' : 'border-gray-300 dark:border-gray-700 hover:border-primary dark:hover:border-primary'}
					 					dark:bg-gray-900  mr-3 flex h-5 w-5 items-center justify-center rounded-md border `}>
								{selected &&
									<i className="fa-solid fa-check text-white"></i>
								}
							</div>


							<div>

						{ selected && <span className='text-gray-500 dark:text-white'>{props.EnabledText ?? 'Enabled'}</span>}
						{!selected && <span className='text-gray-300 dark:text-white/30'>{props.DisabledText ?? 'Disabled'}</span>}
							</div>
						</div>
					</div>
				</div>
			</Sizing>
		)
	}
	return (
		<Sizing {...props} Containered={true}>
			<div onClick={() => updateValue(!selected)}
				style={{ gridTemplateColumns: columnTemplate }}
				className={`grid cursor-pointer items-center text-sm font-medium  text-gray-700 select-none dark:text-gray-400 
				${props.Disabled ? 'opacity-50 pointer-events-none' : ''}`}>

				<div tabIndex={0}
					onKeyUp={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							updateValue(!selected);
						}
					}}
					className={`${selected ? 'border-primary bg-primary dark:bg-primary' : 'border-gray-300 dark:border-gray-700 hover:border-primary dark:hover:border-primary'}
					 dark:bg-gray-900  mr-3 flex h-5 w-5 items-center justify-center rounded-md border `}>
					{selected &&
						<i className="fa-solid fa-check text-white"></i>
					}
				</div>

				{props.Icon &&
					<span className="mr-3">
						<i className={props.Icon}></i>
					</span>
				}

				<div className={`flex flex-col gap-1 pointer-events-none ${props.Helper ? 'mr-2' : ''}`}>
					<label className={`text-sm font-medium text-gray-700 select-none dark:text-gray-400`}>{props.Title}</label>
					{props.Subtitle && <p className="text-xs text-gray-500">{props.Subtitle}</p>}
				</div>

				{(props.EnabledText || props.DisabledText) && (
					<div className=''>
						{props.EnabledText && selected && <span className='text-gray-500 dark:text-white'>{props.EnabledText}</span>}
						{props.DisabledText && !selected && <span className='text-gray-300 dark:text-white/30'>{props.DisabledText}</span>}
					</div>
				)}

				{props.Helper &&
					<Helper>
						{props.Helper}
					</Helper>
				}
			</div>
		</Sizing>
	)
}