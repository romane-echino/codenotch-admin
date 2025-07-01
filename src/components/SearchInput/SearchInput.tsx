import React from 'react';
import { AbstractInput, IAbstractInputProps } from '../AbstractInput/AbstractInput';
import { Combobox } from '@headlessui/react';

interface ISearchInputProps extends IAbstractInputProps {
	Source: any[];
}

interface ISearchInputState {
}

export const SearchInput: React.FC<ISearchInputProps> = (props) => {
	const [selected, setSelected] = React.useState(null);
	const [query, setQuery] = React.useState('');

	const filteredPeople = []

	return (
		<AbstractInput {...props}>
			<Combobox value={selected} onChange={setSelected}>
				<div className="relative ">
					<div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
						<Combobox.Input
							className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
							displayValue={(person:any) => person}
							onChange={(event) => setQuery(event.target.value)}
						/>
						<Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
							CHEV
						</Combobox.Button>
					</div>
				
						<Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
							{filteredPeople.length === 0 && query !== '' ? (
								<div className="relative cursor-default select-none px-4 py-2 text-gray-700">
									Nothing found.
								</div>
							) : (
								filteredPeople.map((person) => (
									<Combobox.Option
										key={person}
										className={({ active }) =>
											`relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-teal-600 text-white' : 'text-gray-900'
											}`
										}
										value={person}
									>
										{({ selected, active }) => (
											<>
												<span
													className={`block truncate ${selected ? 'font-medium' : 'font-normal'
														}`}
												>
													{person}
												</span>
												{selected ? (
													<span
														className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-teal-600'
															}`}
													>
														CHECK
													</span>
												) : null}
											</>
										)}
									</Combobox.Option>
								))
							)}
						</Combobox.Options>
				</div>
			</Combobox>
		</AbstractInput>
	)
}