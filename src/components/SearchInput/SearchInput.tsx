import React from 'react';
import { AbstractInput, IInputProps } from '../AbstractInput/AbstractInput';
import { Combobox } from '@headlessui/react';
import { getDataFromSource, getIndexFromSource } from '../../utils/SourceHandling';
import { Action, IBindableComponentProps } from '@echino/echino.ui.sdk';

interface ISearchInputProps extends IInputProps, IBindableComponentProps {
	Source?: any;
	DisplayField: string;
	ValueField?: string;
	AddText?: string;
	NoResultText?: string;

	OnAdd?: Action<string>;

	Renderer?: (as: string, data: any) => React.ReactNode;
}

export const SearchInput: React.FC<ISearchInputProps> = (props) => {
	const [selectedIndex, setSelected] = React.useState<number | null>(null);
	const [query, setQuery] = React.useState('');
	const [data, setData] = React.useState<any[]>([]);
	const [focus, setFocus] = React.useState(false);
	const [pendingValue, setPendingValue] = React.useState<string | null>(null);

	const [popupPosition, setPopupPosition] = React.useState<'top' | 'bottom'>('bottom');
	const inputRef = React.useRef<HTMLInputElement>(null);
	const buttonRef = React.useRef<HTMLButtonElement>(null);

	props.declareFunction('setValue', (value: any) => {
		const index = data.findIndex((item) => (props.ValueField ? item[props.ValueField] : item) === value)
		updateValue(data[index], index);
	});

	React.useEffect(() => {
		if (JSON.stringify(props.Source) !== JSON.stringify(data)) {
			let src = getDataFromSource(props.Source);
			setData(src);

			if (props.Value !== undefined && props.Value !== null) {
				let defaultIndex = getIndexFromSource(src, props.Value, props.ValueField);
				if (defaultIndex > -1) {
					console.log("Default index found in source", defaultIndex);
					updateValue(src?.[defaultIndex], defaultIndex);
					if (props.DisplayField) {
						setPendingValue(src?.[defaultIndex]?.[props.DisplayField]);
					}
					else {
						setPendingValue(src?.[defaultIndex]);
					}
				} else if (typeof (props.Value) === 'string' && props.Value !== '') {

					setPendingValue(props.Value);
				}
			}
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

	const updateValue = (value: any, index: number) => {

		if (value && index !== selectedIndex) {
			console.log("Updating value to", value, "at index", index);
			setSelected(index);
			let result = props.ValueField ? value[props.ValueField] : value;
			props.onPropertyChanged('value', undefined, result)

			if (props.DisplayField) {
				setPendingValue(value[props.DisplayField]);
			}
			else {
				setPendingValue(value);
			}

			props._internalOnChange?.(result);
			props.OnChange?.({ value: result, index: index });
		}
	}

	const getIndex = (filteredItem: any) => {
		let result = data.findIndex((item) => item === filteredItem);
		return result !== -1 ? result : null;
	}

	const getDisplayValue = (index: number | null): string => {
		if (pendingValue) {
			return pendingValue;
		}
		else if (index !== undefined && index !== null) {
			return props.DisplayField ? data?.[index]?.[props.DisplayField] : data?.[index];
		}

		return query;
	}


	const AddNew = () => {
		if (query !== '' && props.OnAdd !== undefined) {
			setPendingValue(query);
			props.OnAdd(query);
		}
	};

	const filteredData = query === ''
		? data
		: data.filter((item) =>
			typeof (item) === 'object' ?
				item[props.DisplayField]?.toLowerCase().includes(query.toLowerCase()) :
				item.toLowerCase().includes(query.toLowerCase())
		);

	return (
		<AbstractInput {...props} Focus={focus}>
			<Combobox value={selectedIndex} onChange={(index: number) => {
				if (index !== undefined) {
					console.log("Combobox value changed to", index);
					updateValue(data?.[index], index);
				}
			}}>

				<Combobox.Input
					ref={inputRef}
					className={`${props.Icon && 'pl-9'} text-left px-4 py-2.5 w-full focus:border-0 focus:outline-hidden placeholder:text-gray-400 dark:placeholder:text-white/30`}
					displayValue={(index: number) => getDisplayValue(index)}
					onChange={(event) => setQuery(event.target.value)}
					onFocus={(e) => setFocus(true)}
					onBlur={() => {setFocus(false); setQuery('');}}
					onKeyDown={(e) => {
						if (e.key === 'Enter' && query !== '' && filteredData.length === 0 && props.OnAdd !== undefined) {
							AddNew();
						}
						else if(e.key === 'Escape') {
							setQuery('');
						}
					}}
					autoComplete='off'
					autoCapitalize='off'
					autoCorrect='off'
					spellCheck='false'
					placeholder={props.Placeholder || 'Search...'}
				/>

				<Combobox.Button ref={buttonRef} className="absolute cursor-pointer inset-y-0 right-0 flex items-center pr-4 ">
					<i className="fa-solid fa-angle-down group-hover:hover:translate-y-1 transition-transform"></i>
				</Combobox.Button>


				<Combobox.Options className={`${popupPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'} popover cn-scroll`}>
					{filteredData.length === 0 && query !== '' ? (
						<div className="relative cursor-default select-none px-4 py-2 text-gray-700 dark:text-white/80">
							<div className="flex items-center justify-between ">
								<span>{props.NoResultText || 'No results found'}</span>
								{props.OnAdd &&
									<button
										className="ml-2 group flex gap-2"
										onClick={AddNew}
									>
										<span className='text-primary group-hover:underline'>{props.AddText || 'Add'} "{query}"</span>

										<div className='text-xs text-gray-400 dark:text-gray-600 border border-gray-400 dark:border-gray-700 rounded-md px-1 py-0.5'>ENTER</div>
									</button>
								}
							</div>
						</div>
					) : (
						filteredData.map((item) => {
							let index = getIndex(item);
							return (
								<Combobox.Option
									key={index}
									className={({ active }) => `relative text-sm cursor-default text-gray-700 dark:text-white/80 select-none py-2 pr-10 pl-4 ${active ? 'bg-primary-500 text-white' : 'text-gray-700'}`}
									value={index}
								>
									{({ selected, active }) => (
										<>
											<span className={`block truncate`}>
												{props.Renderer ?
													props.Renderer('item', item) :
													item[props.DisplayField] || item
												}

											</span>

											{index === selectedIndex &&
												<span className={`absolute inset-y-0 right-0 flex items-center pr-3  ${active ? 'text-white ' : 'text-gray-800 dark:text-white/90'}`}>
													<i className="fa-regular fa-circle-check flex justify-center items-center"></i>
												</span>
											}
										</>
									)}
								</Combobox.Option>
							)
						})
					)}
				</Combobox.Options>
			</Combobox>
		</AbstractInput>
	)
}