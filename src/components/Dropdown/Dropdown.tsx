import React from 'react';
import './Dropdown.scss';
import { AbstractInput, IAbstractInputProps, IInputProps } from '../AbstractInput/AbstractInput';
import { Listbox } from '@headlessui/react';
import { getDataFromSource } from '../../utils/SourceHandling';
import { IBindableComponentProps } from '@echino/echino.ui.sdk';

interface IDropdownProps  extends IAbstractInputProps, IBindableComponentProps {
	Source?: any;
	DisplayField: string;
	ValueField?: string;

	Renderer?: (value: any, index: number) => React.ReactNode;
	DisabledFunction?: (value: any, index: number) => boolean;
}

export const Dropdown = (props: IDropdownProps) => {
	const [selectedIndex, setSelected] = React.useState<number | null>(null);
	const [focus, setFocus] = React.useState<boolean>(false);
	const [data, setData] = React.useState<any[]>([]);


	React.useEffect(() => {
		let src = getDataFromSource(props.Source);
		console.log('Dropdown data', src, props.Source);
		setData(src);
	}, [props.Source, props.Value]);

	return (
		<AbstractInput {...props} Focus={focus}>
			<Listbox value={selectedIndex} onChange={(index: number) => {

				
				if (index !== undefined) {
					alert('Dropdown selected index: ' + index);
					let value = props.Source?.[index]
					if (value) {
						setSelected(index);
						props.OnSelect && props.OnSelect({ value: value, index: index });
					}
				}
			}}>

				<Listbox.Button
					className={`${props.Icon && 'pl-9'} text-left px-4 py-2.5 w-full focus:border-0 focus:outline-hidden placeholder:text-gray-400 dark:placeholder:text-white/30`}
					onBlur={() => setFocus(false)}
					onFocus={() => setFocus(true)}
				>
					{selectedIndex !== null ?
						<span>
							{props.DisplayField ?
								props.Source?.[selectedIndex]?.[props.DisplayField] :
								props.Source?.[selectedIndex]
							}
						</span>
						:
						<span className='opacity-50'>{props.Placeholder} {data.length}</span>
					}


					<div className='absolute inset-y-0 right-0 flex items-center pr-2'>
						<i className="h-5 w-5 text-gray-400 fa-solid fa-angles-up-down"></i>
					</div>
				</Listbox.Button>

				<Listbox.Options
					className='absolute z-50 bg-white border border-gray-300 dark:border-gray-700 translate-y-0.5 rounded-lg shadow-lg overflow-hidden max-w-full'>
					{data.map((obj, objIndex) => (
						<Listbox.Option
							key={objIndex}
							value={objIndex}

							disabled={props.DisabledFunction ? props.DisabledFunction(obj, objIndex) : false}
							className={({ active }) => `relative cursor-default select-none py-2 pr-10 pl-4 ${active ? 'bg-primary-500 text-white' : 'text-gray-700'}`}>

							{({ selected, active }) => (
								<>
									<span className={`block truncate`}>
										{props.Renderer ?
											props.Renderer(obj, objIndex) :
											obj[props.DisplayField] || obj
										}

										{objIndex}
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

