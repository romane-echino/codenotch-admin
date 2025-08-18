import React, { useEffect } from 'react';
import { Sizing } from '../Sizing/Sizing';
import { Ii18nProps } from '@echino/echino.ui.sdk';
import { Box, IBoxProps } from '../Box/Box';
import { Popover } from '@headlessui/react';

import { Checkbox } from '../Checkbox/Checkbox'
import { Dropdown } from '../Dropdown/Dropdown'
import { CurrencyInput } from '../CurrencyInput/CurrencyInput'

interface IInstallmentsProps extends Ii18nProps, IBoxProps {
	BasePrice?: number;
	BaseFee?: number;
	BaseRenewal?: boolean;

	HasLayout?: boolean;
	Value?: IInstallmentsData;
	Durations?: number[];
	OnChange?: (data: IInstallmentsData) => void;
}

interface IInstallmentsData {
	[duration: number]: {
		[installment: number]: IInstallment
	};
}


interface IInstallment {
	fee: number;
	renewal: boolean;
	price: number;
	count: number;
	duration: number;
}

export const Installments: React.FC<IInstallmentsProps> = (props) => {
	const durations = props.Durations || [1, 2, 3, 4, 6, 12, 24];
	const basePrice = props.BasePrice || 10000;
	const baseFee = props.BaseFee || 0;
	const baseRenewal = props.BaseRenewal || false;

	const [data, setData] = React.useState<IInstallmentsData>({});

	const toggleDuration = (duration: number) => {
		const isSelected = data[duration] !== undefined;
		if (isSelected) {
			const newData = { ...data };
			delete newData[duration];
			setData(newData);
		} else {
			setData({
				...data,
				[duration]: {
					1: {
						fee: baseFee,
						renewal: baseRenewal,
						price: basePrice * duration,
						count: 1,
						duration
					}
				}
			});
		}
	};

	const addInstallment = (duration: number, nextInstallment: number) => {


		const newInstallment: IInstallment = {
			fee: baseFee,
			renewal: baseRenewal,
			price: basePrice * duration,
			count: nextInstallment,
			duration
		};

		setData((prevData) => ({
			...prevData,
			[duration]: {
				...prevData[duration],
				[nextInstallment]: newInstallment
			}
		}));
	};

	const removeInstallment = (duration: number, installment: number) => {
		setData((prevData) => {
			const newDurationData = { ...prevData[duration] };
			delete newDurationData[installment];

			if (Object.keys(newDurationData).length === 0) {
				const newData = { ...prevData };
				delete newData[duration];
				return {
					...newData
				};
			}
			else {
				return {
					...prevData,
					[duration]: newDurationData
				};
			}

		});
	};

	const getContent = () => (
		<div>
			{durations.map((duration, durationIndex) => {
				const isSelected = data[duration] !== undefined;
				const installmentData = data[duration] || undefined;

				const alreadySelected = isSelected ? Object.keys(data[duration]).map(Number) : [];
				const currentInstallments = getInstallments(duration);
				const availableInstallments = currentInstallments.filter(item => !alreadySelected.includes(item)).sort((a, b) => a - b);
				const nextInstallment = availableInstallments.length > 0 ? availableInstallments[0] : 1;


				return (
					(
						<div key={durationIndex} className='grid grid-cols-[auto_64px_2fr_auto] md:grid-cols-[auto_128px_2fr_auto] items-center gap-2 text-gray-700 dark:text-gray-400 py-2 px-4 border-b border-gray-200 dark:border-gray-800 last:border-b-0'>
							<div
								onClick={() => toggleDuration(duration)}
								className={`dark:bg-gray-900 cursor-pointer hover:border-primary-500 dark:hover:border-primary-500 hover:ring-3 hover:ring-primary/10 flex size-5 items-center justify-center rounded-md border
												 ${isSelected ? 'border-primary bg-primary dark:bg-primary' : 'border-gray-300 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500'} `}>
								{isSelected &&
									<i className="fa-solid fa-check text-white flex items-center justify-center"></i>
								}
							</div>


							<div className={`capitalize ${isSelected ? 'text-gray-700 dark:text-white' : ''}`}>
								{duration} Mois
							</div>

							<div className='text-right md:text-left flex gap-2 min-h-9 items-center flex-wrap '>
								{Object.keys(installmentData || {}).map((installmentKey) => {
									const installment = installmentData[installmentKey];
									return (
										<div key={installmentKey} className='flex bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 hover:ring-3 hover:ring-primary/10 border hover:border-primary hover:dark:border-primary rounded-lg'>
											<Installement
												installment={installment}
												OnChange={(updatedInstallment) => {
													setData((prevData) => ({
														...prevData,
														[duration]: {
															...prevData[duration],
															[installmentKey]: updatedInstallment
														}
													}));
												}}
												availableInstallments={availableInstallments}
												language={props.language} />

											<div className='flex items-center justify-center px-2 border-l border-gray-300 dark:border-gray-700' onClick={() => removeInstallment(duration, installment.count)}>
												<i className="fa-solid fa-trash text-sm text-alizarin cursor-pointer hover:opacity-80 flex items-center justify-center" ></i>
											</div>
										</div>
									);
								})}
							</div>

							{isSelected && availableInstallments.length > Object.keys(installmentData || {}).length ?
								<button
									onClick={() => addInstallment(duration, nextInstallment)}
									className='rounded-lg bg-primary size-6 text-white flex items-center justify-center cursor-pointer'>
									<i className="fa-solid fa-plus text-sm flex items-center justify-center"></i>
								</button>
								:
								<div className='size-6'></div>
							}
						</div>
					)
				)
			})}
		</div>
	)

	if (props.HasLayout !== undefined && props.HasLayout === false) {
		return (
			<Sizing>
				{getContent()}
			</Sizing>
		)
	}
	else {
		return (
			<Box {...props} DisablePadding={true}>
				{getContent()}


				<pre className='text-sm text-white'>
					{JSON.stringify(data, null, 2)}
				</pre>
			</Box>
		)
	}
}

const getPrice = (price: number, language: string) => {
	return new Intl.NumberFormat(language, { style: 'currency', currency: 'CHF' }).format(price / 100).replace('.00', '.-');
};

const getInstallments = (duration: number) => {
	return [1, 2, 3, 4, 6, 12, 24].filter((i) => i <= duration && duration % i === 0);
};

interface IInstallmentProps {
	language: string;
	installment: IInstallment;
	availableInstallments: number[];
	OnChange: (installment: IInstallment) => void;
}

const Installement: React.FC<IInstallmentProps> = (props) => {
	const [data, setData] = React.useState<IInstallment>(props.installment);
	const { OnChange } = props;

	return (
		<Popover className="relative">
			<Popover.Button as='div' className={`h-8 cursor-pointer text-sm border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white/90 flex divide-gray-300 dark:divide-gray-700 divide-x`}>
				<div className='flex items-center gap-0.5 px-2 '>
					<div>{data.count}</div>
					<i className="fa-solid fa-xmark text-xs flex items-end h-4"></i>
				</div>

				<div className='px-2 flex gap-1 items-center'>
					<span>{getPrice(data.price, props.language)}</span>
					<i className="fa-solid fa-money-bill-transfer text-xs"></i>
				</div>

				{data.fee > 0 &&
					<div className='flex px-2 gap-1 items-center'>
						<i className="fas fa-plus text-xs"></i>
						<span>{getPrice(data.fee, props.language)}</span>
						<i className="fas fa-money-bill-1 text-sm flex items-center"></i>
					</div>
				}

				{data.renewal &&
					<div className='flex items-center pl-2'><i className="fa-solid fa-arrows-repeat text-success-500"></i></div>
				}

			</Popover.Button>

			<Popover.Panel className="absolute z-10 top-full mt-1 flex flex-col gap-2 p-2 text-gray-800 dark:text-white/90 bg-white border border-gray-300  dark:border-gray-700 dark:bg-gray-800 rounded-lg">
				{props.availableInstallments.length > 1 && (
					<Dropdown Value={data.count} Source={props.availableInstallments} declareFunction={() => { }} onPropertyChanged={(v, o, n) => { setData({ ...data, count: n }); OnChange(data); }} />
				)}
				<CurrencyInput Value={data.price} declareFunction={() => { }} onPropertyChanged={(v, o, n) => { setData({ ...data, price: n }); OnChange(data); }} />
				<CurrencyInput Value={data.fee} declareFunction={() => { }} onPropertyChanged={(v, o, n) => { setData({ ...data, fee: n }); OnChange(data); }} />
				<Checkbox Value={data.renewal} declareFunction={() => { }} onPropertyChanged={(v, o, n) => { setData({ ...data, renewal: n }); OnChange(data); }} />
			</Popover.Panel>
		</Popover>
	)
}