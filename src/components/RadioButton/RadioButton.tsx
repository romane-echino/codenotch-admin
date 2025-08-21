import React from 'react';
import './RadioButton.scss';
import { RadioGroup } from '@headlessui/react';
import { Action, IBindableComponentProps, IChildrenInheritedProps } from '@echino/echino.ui.sdk';
import { AbstractInputTitle } from '../AbstractInput/AbstractInput';

interface IRadioButtonProps extends IBindableComponentProps, IChildrenInheritedProps<{ Label: string, Value: any, Icon?: string, Description?: string }> {
	Orientation?: 'Horizontal' | 'Vertical';
	Value?: any;
	Title?: string;
	OnChange?: Action<any>;
	_internalOnChange?: (value: any) => void;
}


export const RadioButton = (props: IRadioButtonProps) => {
	const [selectedValue, setSelectedValue] = React.useState(props.Value);

	React.useEffect(() => {
		if (props.Value !== undefined && props.Value !== null && props.Value !== '') {
			updateValue(props.Value);
		}
	}, [props.Value]);

	const updateValue = (value: string) => {
		setSelectedValue(value);
		props.onPropertyChanged('value', undefined, value)
		props.OnChange?.(value);
		props._internalOnChange?.(value);
	}

	return (
		<div className='col-span-12 '>
			<AbstractInputTitle {...props} />

			<RadioGroup as='div'
				className={`rounded-lg flex ${props.Orientation === 'Vertical' ? 'flex-col' : 'flex-col sm:flex-row'}`}
				value={selectedValue}
				onChange={(value) => updateValue(value)}>

				{props.childrenProps.map((child, index) => (
					<RadioGroup.Option
						key={index}
						value={child.Value}
						as={React.Fragment}
					>
						{({ checked }) => (
							<div className={`flex border grow basis-0 dark:bg-gray-900
							${checked ? 'border-primary ring-primary-500/10 ring-3 z-10' : 'border-gray-300 dark:border-gray-700'}
							${props.Orientation === 'Vertical' ?
									'flex-col first:-mb-px last:-mt-px xs:flex-row first:rounded-t-lg last:rounded-b-lg' :
									'flex-col first:-mb-px last:-mt-px sm:first:mb-0 sm:last:mt-0 sm:-mr-px first:rounded-t-lg last:rounded-b-lg sm:last:rounded-bl-none sm:first:rounded-tr-none sm:first:rounded-l-lg sm:last:rounded-r-lg'} 
						 	items-center gap-3 p-4 cursor-pointer`}>

								<div className={`size-5 min-w-5 hover:border-primary-500 dark:hover:border-primary-500 flex items-center justify-center rounded-full border-[1.25px] ${checked ? 'border-primary-500 bg-primary-500' : 'bg-transparent border-gray-300 dark:border-gray-700'}`}>
									<span className={`size-2 rounded-full bg-white ${checked ? 'bg-white' : 'bg-white dark:bg-[#171f2e]'}`}></span>
								</div>

								{child.Icon &&
									<i className={`${child.Icon} text-2xl text-gray-800 dark:text-white`}></i>
								}

								<div className={`flex flex-col`}>
									<RadioGroup.Label className={`text-sm ${props.Orientation === 'Vertical' ? 'text-center xs:text-left' : 'text-center'} mb-1 font-medium text-gray-700 select-none dark:text-gray-400`}>{child.Label}</RadioGroup.Label>
									{child.Description && <p className="text-xs text-gray-500 text-center">{child.Description}</p>}
								</div>
							</div>
						)}
					</RadioGroup.Option>
				))}

			</RadioGroup>
		</div>
	)
}
