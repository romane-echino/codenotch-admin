import React from 'react';
import { AbstractInput, IAbstractInputProps } from '../AbstractInput/AbstractInput';
import { Combobox } from '@headlessui/react';
import { getDataFromSource, getIndexFromSource } from '../../utils/SourceHandling';
import { Action, IBindableComponentProps } from '@echino/echino.ui.sdk';

interface ISearchInputProps extends IAbstractInputProps, IBindableComponentProps {
	Source?: any;
	DisplayField: string;
	ValueField?: string;

	OnAdd?: Action<string>;

	Renderer?: (as: string, data: any) => React.ReactNode;
}

export const SearchInput: React.FC<ISearchInputProps> = (props) => {
	const [selectedIndex, setSelected] = React.useState<number | null>(null);
	const [query, setQuery] = React.useState('');
	const [data, setData] = React.useState<any[]>([]);
	const [focus, setFocus] = React.useState(false);

	const [popupPosition, setPopupPosition] = React.useState<'top' | 'bottom'>('bottom');
	const inputRef = React.useRef<HTMLInputElement>(null);
	const buttonRef = React.useRef<HTMLButtonElement>(null);

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

	const updateValue = (value: any, index: number) => {
		if (value) {
			let result = props.ValueField ? value[props.ValueField] : value;
			props.onPropertyChanged('value', undefined, result)
			setSelected(index);
			props.OnSelect && props.OnSelect({ value: result, index: index });
		}
	}

	const getIndex = (filteredItem: any) => {
		let result = data.findIndex((item) => item === filteredItem);
		return result !== -1 ? result : null;
	}

	const getDisplayValue = (index: number | null): string => {
		if (index !== undefined && index !== null) {
			return props.DisplayField ? data?.[index]?.[props.DisplayField] : data?.[index];
		}
		return query;
	}

	const filteredData = query === ''
		? data
		: data.filter((item) =>
			item[props.DisplayField].toLowerCase().includes(query.toLowerCase())
		);

	return (
		<AbstractInput {...props} Focus={focus}>
			<Combobox value={selectedIndex} onChange={(index: number) => {
				if (index !== undefined) {
					updateValue(data?.[index], index);
				}
			}}>

				<Combobox.Input
					ref={inputRef}
					className={`${props.Icon && 'pl-9'} text-left px-4 py-2.5 w-full focus:border-0 focus:outline-hidden placeholder:text-gray-400 dark:placeholder:text-white/30`}
					displayValue={(index: number) => {
						if (index !== undefined && index !== null) {
							return getDisplayValue(index);
						}
						return '';
					}}
					onChange={(event) => setQuery(event.target.value)}
					onFocus={(e) => setFocus(true)}
					onBlur={() => setFocus(false)}
					autoComplete='off'
					autoCapitalize='off'
					autoCorrect='off'
					spellCheck='false'
					placeholder={props.Placeholder || 'Search...'}
				/>

				<Combobox.Button ref={buttonRef} className="absolute cursor-pointer inset-y-0 right-0 flex items-center pr-4 ">
					<i className="fa-solid fa-angle-down group-hover:hover:translate-y-1 transition-transform"></i>
				</Combobox.Button>


				<Combobox.Options className={`absolute ${popupPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'} z-50 bg-white border border-gray-300 dark:border-gray-700 translate-y-0.5 rounded-lg shadow-lg overflow-hidden max-w-full`}>
					{filteredData.length === 0 && query !== '' ? (
						<div className="relative cursor-default select-none px-4 py-2 text-gray-700">
							<div className="flex items-center justify-between">
								<span>No results found for "{query}"</span>
								{props.OnAdd &&
									<button
										className="ml-2 text-primary hover:underline"
										onClick={() => props.OnAdd!(query)}
									>
										Add "{query}"
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
									className={({ active }) => `relative text-sm cursor-default select-none py-2 pr-10 pl-4 ${active ? 'bg-primary-500 text-white' : 'text-gray-700'}`}
									value={index}
								>
									{({ selected, active }) => (
										<>
											<span className={`block truncate`}>
												{props.Renderer ?
													props.Renderer(item, index) :
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