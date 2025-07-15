import React from 'react';
import './Dropdown.scss';
import { AbstractInput, IAbstractInputProps, IInputProps } from '../AbstractInput/AbstractInput';
import { Listbox } from '@headlessui/react';
import { getDataFromSource, getIndexFromSource } from '../../utils/SourceHandling';
import { IBindableComponentProps } from '@echino/echino.ui.sdk';

interface IDropdownProps extends IAbstractInputProps, IBindableComponentProps {
	Source?: any;
	DisplayField: string;
	ValueField?: string;

	Renderer?: (value: any, index: number) => React.ReactNode;
	DisabledFunction?: (value: any, index: number) => boolean;
}

export const Dropdown: React.FC<IDropdownProps> = (props) => {

	const [selectedIndex, setSelected] = React.useState<number | null>(null);
	const [focus, setFocus] = React.useState<boolean>(false);
	const [data, setData] = React.useState<any[]>([]);

	const [popupPosition, setPopupPosition] = React.useState<'top' | 'bottom'>('bottom');
	const inputRef = React.useRef<HTMLButtonElement>(null);


	React.useEffect(() => {
		let src = getDataFromSource(props.Source);
		setData(src);

		let defaultIndex = getIndexFromSource(src, props.Value, props.ValueField);
		if (defaultIndex !== -1) {
			updateValue(src?.[defaultIndex], defaultIndex);
		}
	}, [props.Source, props.Value]);

	React.useEffect(() => {
		const calculatePosition = () => {
			if (!inputRef.current) return;

			const rect = inputRef.current.getBoundingClientRect();
			const inputMiddle = rect.top + rect.height / 2;
			const windowMiddle = window.innerHeight / 2;

			// If input is in the lower half of the screen, position popup above
			setPopupPosition(inputMiddle > windowMiddle ? 'top' : 'bottom');
		};

		if (focus) {
			calculatePosition();
			// Add event listeners when input is focused
			window.addEventListener('resize', calculatePosition);
			window.addEventListener('scroll', calculatePosition, true);
		}

		// Clean up
		return () => {
			window.removeEventListener('resize', calculatePosition);
			window.removeEventListener('scroll', calculatePosition, true);
		};
	}, [focus]);

	const updateValue = (value: any, index:number) => {
		if (value) {
			let result = props.ValueField ? value[props.ValueField] : value;
			props.onPropertyChanged('value', undefined, result)
			setSelected(index);
			props.OnSelect && props.OnSelect({ value: result, index: index });
		}
	}

	return (
		<AbstractInput {...props} Focus={focus}>
			<Listbox defaultValue={selectedIndex} onChange={(index: number) => {
				if (index !== undefined) {
					updateValue(data?.[index], index);
				}
			}}>

				<Listbox.Button
					ref={inputRef}
					className={`${props.Icon && 'pl-9'} text-left px-4 py-2.5 w-full focus:border-0 focus:outline-hidden placeholder:text-gray-400 dark:placeholder:text-white/30`}
					onBlur={() => setFocus(false)}
					onFocus={() => setFocus(true)}
				>
					{selectedIndex !== null ?
						<span>
							{props.DisplayField ?
								data?.[selectedIndex]?.[props.DisplayField] :
								data?.[selectedIndex]
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
					className={`absolute ${popupPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'} z-50 bg-white border border-gray-300 dark:border-gray-700 translate-y-0.5 rounded-lg shadow-lg overflow-hidden max-w-full`}>
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

