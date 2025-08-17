import React, { useEffect } from 'react';
import './Schedule.scss';
import { Box, BoxTitle, IBoxProps } from '../Box/Box';
import { Sizing } from '../Sizing/Sizing';
import dayjs from 'dayjs';
import { Ii18nProps } from '@echino/echino.ui.sdk';
import { useLongPress } from 'use-long-press';

interface IScheduleProps extends Ii18nProps, IBoxProps {
}


export const Schedule = React.memo((props: IScheduleProps) => {
	const [selectedDay, setSelectedDay] = React.useState<number>(dayjs().day() === 0 ? 6 : dayjs().day() - 1);
	const [cellWidth, setCellWidth] = React.useState<number>(0);
	const [isMobile, setIsMobile] = React.useState<boolean>(false);
	const [cursorPosition, setCursorPosition] = React.useState<{ x: number; y: number } | null>(null);

	const [hoveredData, setHoveredData] = React.useState<{ hour: number; day: number } | null>(null);

	const scheduleContent = React.useRef<HTMLDivElement | null>(null);
	const handlers = useLongPress((e) => {
		e.preventDefault();
		// Your action here
		console.log('Long pressed!', e);
		//@ts-ignore
		updateHoveredData(e.clientX, e.clientY);
	}, {
		captureEvent: true,
		onStart: (e) => {
			console.log('Long press started!', e);
		},
		onMove: (e) => {
			console.log('Long press moved!', e);
		},
		onFinish: (e) => {
			console.log('Long press finished!', e);
		}
	});

	useEffect(() => {
		const updateCellWidth = () => {
			const scheduleElement = scheduleContent.current;
			if (scheduleElement) {
				setCellWidth((scheduleElement.clientWidth / 7) - 6);
			}
		};


		const updateIsMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};

		updateCellWidth();
		updateIsMobile();
		window.addEventListener('resize', updateCellWidth);
		window.addEventListener('resize', updateIsMobile);
		return () => {
			window.removeEventListener('resize', updateCellWidth);
			window.removeEventListener('resize', updateIsMobile);
		};
	}, [cellWidth]);



	const updateHoveredData = (x: number, y: number) => {
		console.log('Update hovered data');
		const scheduleElement = scheduleContent.current;
		if (scheduleElement) {
			const rect = scheduleElement.getBoundingClientRect();
			const mx = x - rect.left;
			const my = y - rect.top;
			const day = Math.floor(mx / cellWidth);
			const hour = Math.floor(my / 24);
			setHoveredData({ hour, day: isMobile ? selectedDay : day });
		}
	};


	const addZero = (num: number) => {
		return num < 10 ? `0${num}` : num;
	};

	const hasTitle = props.Title !== undefined || props.Subtitle !== undefined || props.Actions !== undefined || props.Icon !== undefined || props.Helper !== undefined

	return (
		<Sizing>
			<div className='border rounded-2xl border-gray-200 dark:border-gray-800 dark:bg-white/[0.03] bg-white text-gray-900 dark:text-gray-100 overflow-hidden'>
				{hasTitle && (
					<div className='px-5 md:px-6 pt-5 md:pt-6'>
						<BoxTitle {...props} />
					</div>
				)}

				<header className={`border-b border-gray-200 dark:border-gray-700 grid grid-cols-7 md:pl-10 ${hasTitle?'border-t':'rounded-t-2xl'}`}>
					{dayjs.weekdays(true).map((day, index) => (
						<div key={index} onClick={() => setSelectedDay(index)}
							className={`border-r border-gray-200 dark:border-gray-700 py-2 last:border-r-0 text-center cursor-pointer md:cursor-auto
						${selectedDay === index ? 'bg-primary md:bg-transparent' : ''}`}>
							<span className='hidden lg:block capitalize'>{day}</span>
							<span className='lg:hidden capitalize'>{day.substring(0, 2)}</span>
						</div>
					))}
				</header>


				<main
					ref={scheduleContent}
					className='grid grid-cols-1 md:grid-cols-7 relative md:pl-10'
					{...handlers()}
					onContextMenu={(e) => { e.preventDefault() }}
					onMouseLeave={() => setHoveredData(null)}
					onMouseMove={(e) => isMobile ?
						setCursorPosition({ x: e.clientX, y: e.clientY }) :
						updateHoveredData(e.clientX, e.clientY)}>

					{Array.from({ length: 7 }).map((_, index) => (
						<div key={index} className={`md:border-r last:border-r-0 border-gray-200 dark:border-gray-700
						${selectedDay === index ? 'block' : 'hidden md:block'}`}>

							{Array.from({ length: 24 }).map((_, hourIndex) => (
								<div key={hourIndex} className='border-b border-gray-200 dark:border-gray-700 h-6'>

								</div>
							))}
						</div>
					))}


					<div className='absolute left-0 inset-y-0'>
						{Array.from({ length: 24 }).map((_, hourIndex) => (
							<div key={hourIndex} className='border-b border-gray-200 dark:border-gray-700 h-6 text-xs flex items-center text-gray-500 dark:text-gray-400 pl-2'>
								{hourIndex % 2 === 0 && <span className=''>{hourIndex}:00</span>}
							</div>
						))}
					</div>


					{hoveredData &&
						<div className='absolute bg-primary rounded-lg text-white text-sm px-1 h-6 pointer-events-none flex items-center justify-center'
							style={{
								left: (isMobile ? 40 : 40 + (cellWidth * hoveredData.day)),
								top: (hoveredData.hour * 24),
								width: isMobile ? (scheduleContent.current ? scheduleContent.current?.clientWidth - 40 : 0) : cellWidth
							}}>
							<span>{addZero(hoveredData?.hour)}:00 - {addZero(hoveredData?.hour+1)}:00 {hoveredData?.day}</span>

							<div className='absolute -bottom-1/4 left-1 size-3 bg-primary border-3 borderwhite rounded-full'></div>
							<div className='absolute -top-1/4 right-1 size-3 bg-primary border-3 borderwhite rounded-full'></div>

						</div>
					}
				</main>
			</div>
		</Sizing>
	)
})