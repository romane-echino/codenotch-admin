import React from 'react';
import './RadioButton.scss';
import { RadioGroup } from '@headlessui/react';
import { IBindableComponentProps, IChildrenInheritedProps } from '@echino/echino.ui.sdk';

interface IRadioButtonProps extends IBindableComponentProps, IChildrenInheritedProps<{ Label: string, Value:any, Icon?: string, Description?: string }> {
	Orientation?: 'Horizontal' | 'Vertical';
	Value?: any;
}


export const RadioButton = (props: IRadioButtonProps) => {
	const [selectedValue, setSelectedValue] = React.useState(props.Value);

	return (
		<RadioGroup as='div' className={`flex ${props.Orientation === 'Vertical' ? 'flex-col' : 'flex-row'}`} value={selectedValue} onChange={setSelectedValue}>
			<RadioGroup.Label>Plan</RadioGroup.Label>
			{props.childrenProps.map((child, index) => (
				<RadioGroup.Option key={index} value={child.Value}>
					{({ checked }) => (
						<div className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer`}>
							<div className={`hover:border-primary-500 dark:hover:border-primary-500 mr-3 flex h-5 w-5 items-center justify-center rounded-full border-[1.25px] ${checked ? 'border-primary-500 bg-primary-500' : 'bg-transparent border-gray-300 dark:border-gray-700'}`}>
                              <span className={`h-2 w-2 rounded-full bg-white ${checked ? 'bg-white' : 'bg-white dark:bg-[#171f2e]'}`}></span>
                            </div>
							{child.Icon && <i className={`${child.Icon} text-lg`}></i>}
							<div className="flex flex-col">
								<RadioGroup.Label className="text-sm font-medium text-gray-700 select-none dark:text-gray-400">{child.Label}</RadioGroup.Label>
								{child.Description && <p className="text-xs text-gray-500">{child.Description}</p>}
							</div>
						</div>
					)}
				</RadioGroup.Option>
			))}

		</RadioGroup>
	)
}
