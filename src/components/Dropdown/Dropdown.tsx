import React from 'react';
import './Dropdown.scss';
import { AbstractInput, IInputProps } from '../AbstractInput/AbstractInput';
import { Listbox } from '@headlessui/react';

interface IDropdownProps extends IInputProps {
	Source?: any[];
	OptionRenderer?: (value: any, index: number) => React.ReactNode;
	LabelRenderer?: (value: any, index: number) => string;
	DisabledRenderer?: (value: any, index: number) => boolean;
}

export const Dropdown = (props: IDropdownProps) => {
	const [selectedIndex, setSelected] = React.useState<number | null>(null);
	const [focused, setFocused] = React.useState<boolean>(false);

	return (
		<AbstractInput Focus={focused} {...props}>
			<Listbox value={selectedIndex} onChange={(index: number) => {
				if (index !== undefined) {
					let value = props.Source?.[index]
					if (value) {
						setSelected(index);
						props.OnSelect && props.OnSelect({ value: value, index: index });
					}
				}
			}}>

				<Listbox.Button
					className={`${props.Icon && 'pl-9'} text-left px-4 py-2.5 w-full focus:border-0 focus:outline-hidden placeholder:text-gray-400 dark:placeholder:text-white/30`}
					onBlur={() => setFocused(false)}
					onFocus={() => setFocused(true)}
				>
					{selectedIndex !== null ?
						<span>
							{props.LabelRenderer ?
								props.LabelRenderer(props.Source?.[selectedIndex], selectedIndex) :
								props.Source?.[selectedIndex]
							}
						</span>
						:
						<span className='opacity-50'>{props.Placeholder}</span>
					}


					<div className='absolute inset-y-0 right-0 flex items-center pr-2'>
						<i className="h-5 w-5 text-gray-400 fa-solid fa-angles-up-down"></i>
					</div>
				</Listbox.Button>

				<Listbox.Options
					className='absolute z-50 bg-white border border-gray-300 dark:border-gray-700 translate-y-0.5 rounded-lg shadow-lg overflow-hidden max-w-full'>
					{props.Source?.map((obj, objIndex) => (
						<Listbox.Option
							key={objIndex}
							value={objIndex}

							disabled={props.DisabledRenderer ? props.DisabledRenderer(obj, objIndex) : false}
							className={({ active }) => `relative cursor-default select-none py-2 pr-10 pl-4 ${active ? 'bg-primary-500 text-white' : 'text-gray-700'}`}>

							{({ selected, active }) => (
								<>
									<span className={`block truncate`}>
										{props.OptionRenderer ?
											props.OptionRenderer(obj, objIndex) :
											obj
										}
									</span>

									{objIndex === selectedIndex &&
										<span className={`absolute inset-y-0 right-0 flex items-center pr-3  ${active ? 'text-white ' : 'text-gray-800 dark:text-white/90'}`}>
											<i className="fa-regular fa-circle-check flex justify-center items-center"></i>
										</span>
									}
								</>
							)}
						</Listbox.Option>
					))}
				</Listbox.Options>
			</Listbox>
		</AbstractInput>
	)
}

