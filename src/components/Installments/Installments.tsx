import React, { useEffect } from 'react';

import { Sizing } from '../Sizing/Sizing';
import { CurrencyInput } from '../CurrencyInput/CurrencyInput'
import { Ii18nProps } from '@echino/echino.ui.sdk';

interface IInstallmentsProps extends Ii18nProps {
}

interface IInstallmentsData {
	[duration: number]: {
		[installment: number]: {
			hasFee: boolean;
			hasCustomPrice: boolean;
			fee: number;
			renewal: boolean;
			price: number;
			installment: number;
			duration: number;
			isOpen: boolean;
		}
	};
}

export const Installments: React.FC<IInstallmentsProps> = (props) => {
	const durations = [1, 2, 3, 4, 6, 12, 24];
	const installments = [1, 2, 3, 4, 6, 12, 24];
	const [basePrice, setBasePrice] = React.useState<number>(10000);
	const [baseFee, setBaseFee] = React.useState<number>(0);

	const [selectedDurations, setSelectedDurations] = React.useState<number[]>([]);
	const [installmentsData, setInstallmentsData] = React.useState<IInstallmentsData>({});

	const toggleDuration = (duration: number) => {
		setSelectedDurations((prev) => {
			if (prev.includes(duration)) {
				setInstallmentsData((prev) => {
					const newData = { ...prev };
					delete newData[duration];
					return newData;
				});
				return prev.filter((d) => d !== duration);
			} else {
				setInstallmentsData((prev) => {
					return { ...prev, [duration]: {} };
				});
				return [...prev, duration];
			}
		});
	};


	const toggleInstallment = (duration: number, installment: number) => {
		setInstallmentsData((prev) => {
			const newData = { ...prev };
			if (newData[duration]) {
				if (newData[duration][installment]) {
					delete newData[duration][installment];
				} else {
					newData[duration][installment] = {
						fee: baseFee,
						renewal: false,
						price: basePrice * duration / installment,
						installment: installment,
						duration: duration,
						hasFee: false,
						hasCustomPrice: false,
						isOpen: false,
					};
				}
			}
			return newData;
		});
	};


	const setInstallementField = (duration: number, installment: number, field: string, value: any) => {
		setInstallmentsData((prev) => {
			const newData = { ...prev };
			if (newData[duration]) {
				if (newData[duration][installment]) {
					newData[duration][installment][field] = value;
				}
			}
			return newData;
		});
	};

	const getInstallments = (duration: number) => {
		return installments.filter((i) => i <= duration && duration % i === 0);
	};


	const getPrice = (price: number) => {
		return new Intl.NumberFormat(props.language, { style: 'currency', currency: 'CHF' }).format(price / 100);
	};

	const suffix = (
		<div>CHF / mois</div>
	);
	return (
		<Sizing >
			<div className='grid grid-cols-2 gap-2'>

				<CurrencyInput ColSpan='none' Title="Base price" Subtitle='Input your monthly base price' Value={basePrice} onPropertyChanged={(v, o, n) => setBasePrice(n)} declareFunction={() => { }} Suffix={suffix} />
				<CurrencyInput ColSpan='none' Title="Base fee" Subtitle='Input your default fee amout' Value={baseFee} onPropertyChanged={(v, o, n) => setBaseFee(n)} declareFunction={() => { }} Suffix={suffix} />


				<hr className='my-2 col-span-2 border-gray-400' />

				<div className='flex flex-col gap-2 col-span-2 '>
					{durations.map((duration) => {
						const isSelected = selectedDurations.includes(duration);
						return (
							<div>
								<div key={duration} className={`flex items-center justify-between gap-2 rounded-2xl bg-white text-gray-700 dark:text-gray-400 dark:bg-white/[0.03] cursor-pointer py-2 px-4 hover:shadow-lg hover:border-primary hover:ring-3 hover:ring-primary/10 border border-gray-200 dark:border-gray-800
								${isSelected ? 'rounded-b-none' : ''}`} onClick={() => toggleDuration(duration)}>
									<div className='grow'>{duration} month</div>

									{isSelected &&
										<div>{getPrice(basePrice * duration)}</div>
									}
									<Switch defaultChecked={isSelected} />
								</div>

								{isSelected && (
									<div className='rounded-b-2xl bg-white text-gray-700 dark:text-gray-400 dark:bg-white/[0.03] border-l border-b border-r border-gray-200 dark:border-gray-800'>

										{getInstallments(duration).map((installment) => {
											const data = installmentsData[duration][installment];
											const isInstallmentSelected = data !== undefined;
											return (
												<div key={installment}

													className='grid grid-cols-[1fr_auto] items-center gap-2 py-2 px-4 border-b border-gray-200 dark:border-gray-800'>
													<div className='flex gap-2'>
														<div className={`${isInstallmentSelected ? '' : 'grow'} cursor-pointer`} onClick={() => toggleInstallment(duration, installment)}>{installment}x</div>
														{isInstallmentSelected && (
															<>
																<div className='grow'>{getPrice(data.price)} {data.hasFee && <span>+ ({getPrice(data.fee)})</span>}</div>
																{data.renewal &&
																	<div className={` size-6 flex items-center justify-center rounded-lg  text-white bg-primary `}>
																		<i className="fas fa-arrows-repeat flex justify-center items-center"></i>
																	</div>
																}

																<div className={` size-6 flex items-center justify-center rounded-lg  
																${data.isOpen ? 'border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-400' : 'text-white bg-primary'}`}
																	onClick={() => setInstallementField(duration, installment, 'isOpen', !data.isOpen)}>
																	<i className="fas fa-angle-up flex justify-center items-center" style={{ transform: data.isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}></i>
																</div>
															</>
														)}
													</div>
													<Switch defaultChecked={isInstallmentSelected} onClick={() => toggleInstallment(duration, installment)} />

													{isInstallmentSelected && data.isOpen && (
														<div>


															<CurrencyInput
																ColSpan='none'
																Title='Custom price'
																onPropertyChanged={(v, o, n) => setInstallementField(duration, installment, 'price', n)}
																declareFunction={() => { }}
																Value={data.hasCustomPrice ? data.price : ((basePrice * duration) / installment)} />

															


															<CurrencyInput
															Title='Subscription fee'
																ColSpan='none'
																onPropertyChanged={(v, o, n) => setInstallementField(duration, installment, 'fee', n)}
																declareFunction={() => { }}
																Value={data.hasFee ? data.fee : 0} />

															


															<label className={`block text-sm font-medium text-gray-700 dark:text-gray-400`}>
																Allow to renew
															</label>
															<Switch defaultChecked={data.renewal} onClick={() => setInstallementField(duration, installment, 'renewal', !data.renewal)} />
														</div>
													)}
												</div>
											)
										})}
									</div>
								)}
							</div>
						)
					})}
				</div>


				<pre className='text-white text-sm col-span-2'>{JSON.stringify(installmentsData, null, 2)}</pre>
			</div>
		</Sizing>
	)
}


export const Switch: React.FC<{ defaultChecked: boolean, onClick?: () => void }> = ({ defaultChecked = false, onClick }) => {

	return (
		<div className="relative cursor-pointer" onClick={() => onClick && onClick()}>
			<input type="checkbox" id="toggle2" className="sr-only" defaultChecked={defaultChecked} />
			<div className={`block h-6 w-11 rounded-full ${defaultChecked ? 'bg-primary' : 'bg-gray-200 dark:bg-white/10'}`}></div>
			<div className={`shadow-sm absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white duration-150 ease-linear ${defaultChecked ? 'translate-x-full' : 'translate-x-0'}`}></div>
		</div>
	)
}