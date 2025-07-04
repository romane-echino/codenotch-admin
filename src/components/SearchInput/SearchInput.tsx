import React from 'react';
import { AbstractInput, IAbstractInputProps } from '../AbstractInput/AbstractInput';
import { Combobox } from '@headlessui/react';
import { getDataFromSource } from '../../utils/SourceHandling';
import { Action, IBindableComponentProps } from '@echino/echino.ui.sdk';

interface ISearchInputProps extends IAbstractInputProps, IBindableComponentProps {
	Source?: any;
	DisplayField: string;
	ValueField?: string;
	OnAdd?: Action<string>;

	Renderer?: (as: string, data: any) => React.ReactNode;

}

export const SearchInput: React.FC<ISearchInputProps> = (props) => {
	const [selected, setSelected] = React.useState<any>(null);
	const [query, setQuery] = React.useState('');
	const [data, setData] = React.useState<any[]>([]);
	const [focus, setFocus] = React.useState(false);

	function updateSource() {
		if (!props.Source) return;
		let data: any[] = getDataFromSource(props.Source);
		setData(data);
	}

	React.useEffect(() => {
		updateSource();
	}, [props.Source]);

	const filteredData = query === ''
		? data
		: data.filter((item) =>
			item[props.DisplayField].toLowerCase().includes(query.toLowerCase())
		);

	return (
		<AbstractInput {...props} Focus={focus}>
			<Combobox value={selected} onChange={(item) => {
				setSelected(item);
				props.onPropertyChanged('value', undefined, item);
				props.OnSelect && props.OnSelect({ value: props.ValueField ? item[props.ValueField] : item, index: data.indexOf(item) });
			}}>


				<Combobox.Input
					className={`${props.Icon && 'pl-9'} px-4 py-2.5 w-full focus:border-0 focus:outline-hidden placeholder:text-gray-400 dark:placeholder:text-white/30`}
					displayValue={(item: any) => item ? item[props.DisplayField] : undefined}
					onChange={(event) => setQuery(event.target.value)}
					onFocus={() => setFocus(true)}
					onBlur={() => setFocus(false)}
					autoComplete='off'
					autoCapitalize='off'
					autoCorrect='off'
					spellCheck='false'
					placeholder={props.Placeholder || 'Search...'}
				/>

				<Combobox.Button className="absolute hover:translate-y-1 transition-transform cursor-pointer inset-y-0 right-0 flex items-center pr-4 ">
					<i className="fa-solid fa-angle-down"></i>
				</Combobox.Button>


				<Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
					{filteredData.length === 0 && query !== '' ? (
						<div className="relative cursor-default select-none px-4 py-2 text-gray-700">
							{props.OnAdd ? (
								<div className="flex items-center justify-between">
									<span>No results found for "{query}"</span>
									<button
										className="ml-2 text-primary hover:underline"
										onClick={() => props.OnAdd!(query)}
									>
										Add "{query}"
									</button>
								</div>
							) : (
								<span>No results found for "{query}"</span>
							)}
						</div>
					) : (
						filteredData.map((item) => (
							<Combobox.Option
								key={item}
								className={({ active }) =>
									`relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-primary-600 text-white' : 'text-gray-900'
									}`
								}
								value={item}
							>
								{({ selected, active }) => (
									<>
										<span
											className={`flex items-center justify-between truncate ${selected ? 'font-medium' : 'font-normal'
												}`}
										>
											{props.Renderer ? props.Renderer('item', item) : item[props.DisplayField]}
										</span>
										{selected ? (
											<span
												className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-primary-600'
													}`}
											>
												<i className="fa-regular fa-circle-check"></i>
											</span>
										) : null}
									</>
								)}
							</Combobox.Option>
						))
					)}
				</Combobox.Options>
			</Combobox>
		</AbstractInput>
	)
}