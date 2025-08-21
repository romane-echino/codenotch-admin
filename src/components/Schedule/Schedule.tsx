import React, { useEffect } from 'react';
import './Schedule.scss';
import { Box, IBoxProps } from '../Box/Box';
import dayjs from 'dayjs';
import { Ii18nProps } from '@echino/echino.ui.sdk';
import { Popover } from '@headlessui/react';
import { Sizing } from '../Sizing/Sizing';

interface IScheduleProps extends Ii18nProps, IBoxProps {
	ClosedText?: string;
	Value?: IScheduleData;
	OnChange?: (data: IScheduleData) => void;
	_internalOnChange?: (data: IScheduleData) => void;
	HasLayout?: boolean;
}


interface IScheduleData {
	[day: string]: {
		bound?: string;
		blocks: {
			from: number;
			to: number;
		}[];
	};
}

export const Schedule: React.FC<IScheduleProps> = (props) => {
	const [data, setData] = React.useState<IScheduleData>(props.Value || {});

	useEffect(() => {
		if (props.Value !== undefined && props.Value !== null && Object.keys(props.Value).length > 0) {
			setData(props.Value);
			props._internalOnChange?.(props.Value);
			props.OnChange?.(props.Value);
		}
	}, [props.Value]);


	const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

	const toggleDay = (day: string) => {
		if (data[day]) {
			const newData = { ...data };
			delete newData[day];

			for(const [key, value] of Object.entries(data)) {
				if (key !== day && value.bound === day) {
					delete newData[key];
				}
			}

			setData(newData);
		} else {
			setData((prevData) => ({
				...prevData,
				[day]: { blocks: [{ from: 0, to: 0 }] },
			}));
		}

		props._internalOnChange?.(data);
		props.OnChange?.(data);
	};


	const addBlock = (day: string) => {
		setData((prevData) => ({
			...prevData,
			[day]: {
				...prevData[day],
				blocks: [...(prevData[day]?.blocks || []), { from: 0, to: 0 }],
			},
		}));

		props._internalOnChange?.(data);
		props.OnChange?.(data);
	};


	const setTime = (day: string, blockIndex: number, time: number, which: 'from' | 'to') => {
		setData((prevData) => ({
			...prevData,
			[day]: {
				...prevData[day],
				blocks: prevData[day]?.blocks.map((block, index) => index === blockIndex ? { ...block, [which]: time } : block),
			},
		}));

		props._internalOnChange?.(data);
		props.OnChange?.(data);
	};

	const removeTime = (day: string, blockIndex: number) => {
		setData((prevData) => ({
			...prevData,
			[day]: {
				...prevData[day],
				blocks: prevData[day]?.blocks.filter((_, i) => i !== blockIndex),
			},
		}));

		props._internalOnChange?.(data);
		props.OnChange?.(data);
	};

	const bindDay = (day: string, blockIndex: number) => {
		setData((prevData) => {

			let boundIndex = blockIndex - 1;

			for (let i = boundIndex; i >= 0; i--) {
				console.log('Checking binding for day:', dayKeys[i]);
				if (data[dayKeys[i]].bound === undefined) {
					boundIndex = i;
				}
			}

			return {
				...prevData,
				[day]: {
					...prevData[day],
					bound: dayKeys[boundIndex],
				},
			};
		});

		props._internalOnChange?.(data);
		props.OnChange?.(data);
	};


	const getDayName = (dayIndex: number) => {
		//@ts-ignore
		const days = dayjs.weekdays(true);
		const day = days[dayIndex];
		const next = dayIndex < days.length - 1 ? data[dayKeys[dayIndex + 1]] : undefined;
		if (next && next.bound !== undefined) {
			let binding = next;
			let bindingIndex = dayIndex + 1;
			for (let i = bindingIndex; i < days.length; i++) {
				binding = data[dayKeys[i]];
				bindingIndex = i;
				if (binding === undefined) {
					bindingIndex--;
					break;
				}

				if (binding && binding.bound == undefined) {
					bindingIndex--;
					break;
				}
			}

			const lastDay = days[bindingIndex];
			return <>
				<span className='hidden md:block capitalize'>{day} - {lastDay}</span>
				<span className='md:hidden capitalize'>{day.substring(0, 2)} - {lastDay.substring(0, 2)}</span>
			</>
		}
		else {
			return <>
				<span className='hidden md:block capitalize'>{day}</span>
				<span className='md:hidden capitalize'>{day.substring(0, 2)}</span>
			</>
		}


	};


	const getContent = () => {
		return (
			<div>
				{/* @ts-ignore */}
				{dayjs.weekdays(true).map((day, dayIndex) => {

					const index = dayKeys[dayIndex]
					const isSelected = data[index];
					const blocks = data[index]?.blocks;
					const previous = dayIndex > 0 ? data[dayKeys[dayIndex - 1]] : undefined;
					const isBound = data[index]?.bound !== undefined;

					if (isBound) {
						return null;
					}

					return (
						(
							<div key={index} className='grid grid-cols-[auto_auto_64px_2fr_auto] md:grid-cols-[auto_auto_128px_2fr_auto] items-center gap-2 text-gray-700 dark:text-gray-400 py-2 px-4 border-b border-gray-200 dark:border-gray-800 last:border-b-0'>
								<div
									onClick={() => toggleDay(index)}
									className={`dark:bg-gray-900 cursor-pointer hover:border-primary-500 dark:hover:border-primary-500 hover:ring-3 hover:ring-primary/10 flex size-5 items-center justify-center rounded-md border
									 ${isSelected ? 'border-primary bg-primary dark:bg-primary' : 'border-gray-300 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500'} `}>
									{isSelected &&
										<i className="fa-solid fa-check text-white flex items-center justify-center"></i>
									}
								</div>


								{previous && !isSelected ? (
									<div onClick={() => bindDay(index, dayIndex)}
										className={`${isBound ? 'border-primary bg-primary dark:bg-primary' : 'border-gray-300 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500'} 
										cursor-pointer dark:bg-gray-900 hover:border-primary-500 dark:hover:border-primary-500 flex size-5 items-center justify-center rounded-md border-[1.25px] `}>
										<i key={`link-${index}`} className="fa-solid fa-link text-gray-700 dark:text-white flex items-center justify-center text-xs"></i>
									</div>
								) :
									<div className='size-5'></div>
								}

								<div className={`capitalize ${isSelected ? 'text-gray-700 dark:text-white' : ''}`}>
									{getDayName(dayIndex)}
								</div>

								<div className='text-right md:text-left flex gap-2 min-h-9 items-center flex-wrap '>
									{blocks && blocks.length > 0 ? (
										blocks.map((block, blockIndex) => (
											<div key={blockIndex} className='flex items-center bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 border rounded-lg'>
												<TimeInput Side='Left' onChange={(value) => setTime(index, blockIndex, value, 'from')} value={block.from} />

												<div className='px-2'>-</div>

												<TimeInput Side='Right' onChange={(value) => setTime(index, blockIndex, value, 'to')} value={block.to} />

												<div className='flex items-center justify-center px-2' onClick={() => { removeTime(index, blockIndex); }}>
													<i className="fa-solid fa-trash text-sm text-alizarin cursor-pointer hover:opacity-80 flex items-center justify-center" ></i>
												</div>
											</div>
										))
									) : (
										<div>{props.ClosedText || 'Closed'}</div>
									)}
								</div>

								{isSelected ?
									<button
										onClick={() => addBlock(index)}
										className='rounded-lg bg-primary size-6 text-white flex hover:ring-3 hover:ring-primary/10 items-center justify-center cursor-pointer'>
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
	}

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
			</Box>
		)
	}

}


interface ITimeInputProps {
	value: number;
	onChange: (value: number) => void;
	Side: 'Left' | 'Right';
}

const TimeInput: React.FC<ITimeInputProps> = (props) => {
	const [hours, setHours] = React.useState(Math.floor(props.value / 60));
	const [minutes, setMinutes] = React.useState(props.value % 60);

	React.useEffect(() => {
		props.onChange(hours * 60 + minutes);
	}, [hours, minutes]);

	return (
		<Popover className="relative">
			<Popover.Button as='div' className={`h-8 ${props.Side === 'Left' ? 'rounded-l-lg border-r' : 'border-x'} px-2 cursor-pointer border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white/90 flex items-center`}>
				{`${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}`}
			</Popover.Button>

			<Popover.Panel className="absolute z-10 top-full mt-1 flex text-gray-800 dark:text-white/90 bg-white border border-gray-300  dark:border-gray-700 dark:bg-gray-800 rounded-lg">
				<div className='overflow-y-auto max-h-96 py-1 cn-scroll'>
					{Array.from({ length: 24 }, (_, i) => (
						<div key={i} className='py-0.5 px-2 cursor-pointer' onClick={() => setHours(i)}>
							<div className={`px-2 py-0.5 ${hours === i ? 'bg-primary text-white' : 'text-gray-800 dark:text-white/90 hover:bg-gray-100 dark:hover:bg-gray-700'} text-center rounded-lg`}>
								{i < 10 ? `0${i}` : `${i}`}
							</div>
						</div>
					))}
				</div>

				<div className='overflow-y-auto max-h-96 py-1'>
					<div className='py-0.5 px-2 cursor-pointer' onClick={() => setMinutes(0)}>
						<div className={`px-2 py-0.5 ${minutes === 0 ? 'bg-primary text-white' : 'text-gray-800 dark:text-white/90 hover:bg-gray-100 dark:hover:bg-gray-700'} text-center rounded-lg`}>
							00
						</div>
					</div>
					<div className='py-0.5 px-2 cursor-pointer' onClick={() => setMinutes(15)}>
						<div className={`px-2 py-0.5 ${minutes === 15 ? 'bg-primary text-white' : 'text-gray-800 dark:text-white/90 hover:bg-gray-100 dark:hover:bg-gray-700'} text-center rounded-lg`}>
							15
						</div>
					</div>
					<div className='py-0.5 px-2 cursor-pointer' onClick={() => setMinutes(30)}>
						<div className={`px-2 py-0.5 ${minutes === 30 ? 'bg-primary text-white' : 'text-gray-800 dark:text-white/90 hover:bg-gray-100 dark:hover:bg-gray-700'} text-center rounded-lg`}>
							30
						</div>
					</div>
					<div className='py-0.5 px-2 cursor-pointer' onClick={() => setMinutes(45)}>
						<div className={`px-2 py-0.5 ${minutes === 45 ? 'bg-primary text-white' : 'text-gray-800 dark:text-white/90 hover:bg-gray-100 dark:hover:bg-gray-700'} text-center rounded-lg`}>
							45
						</div>
					</div>
				</div>
			</Popover.Panel>
		</Popover>
	)
}