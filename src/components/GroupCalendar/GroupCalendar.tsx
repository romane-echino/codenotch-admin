import React from 'react';
import './GroupCalendar.scss';
import { IPageInheritedProps } from '../Page/Page';
import { Box, IBoxProps } from '../Box/Box';
import dayjs from 'dayjs';
import { getColorFromName } from '../../utils/DefaultColorPalette';
import { ToggleButton } from '../ToggleButton/ToggleButton';
import { Md5 } from 'ts-md5';

interface IGroupCalendarProps extends IPageInheritedProps, IBoxProps {
	GroupBy: string;
	Source: any;

	StartField:string;
	EndField:string;
	TypeField:string;
	IdField:string;
	
	RowRenderer?: (as: string, data: any) => React.ReactNode;
}


const testData = [
	{
		"Id": "1",
		"User":{
			"Id": "1",
			"Firstname": "Romane",
			"Lastname": "Donnet",
			"Avatar": "https://randomuser.me/api/portraits/women/1.jpg",
			"Email": "romane.donnet@example.com",
			"Team": "Development",
		},
		"Start": "2025-01-14T09:00:00",
		"End": "2025-01-21T17:00:00",
		"Type": "Work"
	},
	{
		"Id": "2",
		"User": {
			"Id": "2",
			"Firstname": "Alice",
			"Lastname": "Smith",
			"Avatar": "https://randomuser.me/api/portraits/women/2.jpg",
			"Email": "alice.smith@example.com",
			"Team": "Design"
		},
		"Start": "2025-01-03T10:00:00",
		"End": "2025-01-05T12:00:00",
		"Type": "Meeting"
	},
	{
		"Id": "3",
		"User": {
			"Id": "3",
			"Firstname": "Bob",
			"Lastname": "Johnson",
			"Avatar": "https://randomuser.me/api/portraits/men/3.jpg",
			"Email": "bob.johnson@example.com",
			"Team": "Development"
		},
		"Start": "2025-07-03T13:00:00",
		"End": "2025-07-06T15:00:00",
		"Type": "Work"
	},
	{
		"Id": "4",
		"User": {
			"Id": "4",
			"Firstname": "Charlie",
			"Lastname": "Brown",
			"Avatar": "https://randomuser.me/api/portraits/men/4.jpg",
			"Email": "charlie.brown@example.com",
			"Team": "Development"
		},
		"Start": "2025-07-04T08:00:00",
		"End": "2025-07-08T10:00:00",
		"Type": "Break"
	},
	{
		"Id": "5",
		"User": {
			"Id": "5",
			"Firstname": "Diana",
			"Lastname": "Prince",
			"Avatar": "https://randomuser.me/api/portraits/women/5.jpg",
			"Email": "diana.prince@example.com",
			"Team": "Justice League"
		},
		"Start": "2025-10-05T11:00:00",
		"End": "2025-10-10T14:00:00",
		"Type": "Work"
	},
	{
		"Id": "6",
		"User": {
			"Id": "1",
			"Firstname": "Romane",
			"Lastname": "Donnet",
			"Avatar": "https://randomuser.me/api/portraits/women/1.jpg",
			"Email": "romane.donnet@example.com",
			"Team": "Development",
		},
		"Start": "2025-10-06T09:30:00",
		"End": "2025-10-12T11:30:00",
		"Type": "Meeting"
	},
	{
		"Id": "7",
		"User": {
			"Id": "7",
			"Firstname": "Fiona",
			"Lastname": "Gallagher",
			"Avatar": "https://randomuser.me/api/portraits/women/7.jpg",
			"Email": "fiona.gallagher@example.com",
			"Team": "Development"
		},
		"Start": "2025-10-07T12:00:00",
		"End": "2025-10-20T16:00:00",
		"Type": "Work"
	},
	{
		"Id": "8",
		"User": {
			"Id": "8",
			"Firstname": "George",
			"Lastname": "Costanza",
			"Avatar": "https://randomuser.me/api/portraits/men/8.jpg",
			"Email": "george.costanza@example.com",
			"Team": "Development"
		},
		"Start": "2025-10-08T14:00:00",
		"End": "2025-10-12T15:30:00",
		"Type": "Break"
	}
];

interface GroupCalendarBlock {
	id: string | number;
	x: number;
	y: number;
	width: number;
	color: string;
}

export const GroupCalendar: React.FC<IGroupCalendarProps> = (props) => {
	const [columns, setColumns] = React.useState<{ [month: string]: dayjs.Dayjs[]; }>({});
	const [rows, setRows] = React.useState<any[]>([]);
	const [data, setData] = React.useState<GroupCalendarBlock[]>([]);

	const height = 48;
	const width = 24;

	React.useEffect(() => {
		updateSource(testData, props.GroupBy);
	}, [props.Source]);

	const getBusinessDatesCount = (startDate: dayjs.Dayjs, endDate: dayjs.Dayjs) => {
		var count = 0;
		var curDate = dayjs(startDate);
		while (curDate <= endDate) {
			var dayOfWeek = curDate.weekday();
			var isWeekend = (dayOfWeek == 6) || (dayOfWeek == 0);
			if (!isWeekend)
				count++;
			curDate = curDate.add(1, 'day');
		}
		return count;
	}
	const updateSource = (source: any, groupBy: string) => {
		if (!source) return;

		let columns: { [month: string]: dayjs.Dayjs[]; } = {}
		let rows: any = {};
		let typeNames: any = {};
		let data: GroupCalendarBlock[] = [];
		let start = dayjs().startOf('year')
		let end = dayjs().endOf('year')

		for (var day = dayjs(start); day.isBefore(end); day = day.add(1, 'day')) {
			if (!columns[day.format('MMMM')]) {
				columns[day.format('MMMM')] = [];
			}
			if (day.weekday() !== 0 && day.weekday() !== 6) { // Exclude weekends
				columns[day.format('MMMM')].push(day);
			}
		}

		source.forEach((item: any) => {
			console.log('group', JSON.stringify(item[groupBy]))
			let groupHash = Md5.hashStr(JSON.stringify(item[groupBy])).toString();
			
			rows[groupHash] = item[groupBy];
			//typeNames[item[groupBy]] = 0;

			let monthdiff = dayjs(item.Start).diff(dayjs().startOf('year'), 'month');

			let daydiff = getBusinessDatesCount(dayjs().startOf('year'), dayjs(item.Start)) - 1;
			let durationdiff = getBusinessDatesCount(dayjs(item.Start), dayjs(item.End));
			let duration = parseFloat((durationdiff).toFixed(1));
			console.log("item",item.Id,monthdiff, daydiff, durationdiff , duration , item.Start);
			let x = (dayjs(item.Start).weekday() === 0 || dayjs(item.Start).weekday() === 6) ? width * (daydiff + 1) : width * daydiff;
			//console.log("item", x);
			x += monthdiff*2;
			//console.log("item", x);
			//x += daydiff;
			//console.log("item", x);
			data.push({
				id: item.Id,
				x: x,
				y: Object.keys(rows).indexOf(item[groupBy]) * height,
				width: duration * width,
				color: getColorFromName(item.Type.toLowerCase(), true)
			});
		});

		console.log("rows", Object.values(rows));
		setRows(Object.values(rows));
		setColumns(columns);
		setData(data);

		setTimeout(() => {
			document.getElementById(dayjs().format('YYYY-MM-DD'))?.scrollIntoView({
				behavior: 'instant',
				inline: 'center',
				block: 'nearest'
			});
		}, 10);
	}

	return (
		<Box {...props}>
			<div className='flex items-center justify-end mb-2'>
				<ToggleButton onPropertyChanged={(v,o,n) => {}} Source={['Days', 'Weeks', 'Months']} />
			</div>
			<div className="max-w-full ">
				<div className="min-w-full grid grid-cols-[auto_1fr]">
					<div className='pt-[60px] divide-gray-100 dark:divide-gray-800 divide-y' >
						{rows.map((row, index) => (
							<div key={index} style={{ height: `${height}px` }} className="pr-6 flex items-center whitespace-nowrap">
								<p className="text-gray-500 text-theme-xs dark:text-gray-400">
									{props.RowRenderer ? props.RowRenderer('row', row) : `#${index+1}`}
								</p>
							</div>
						))}

					</div>

					<div className='overflow-x-auto overflow-y-hidden border-l border-gray-200 dark:border-gray-700'>
						<div className="flex flex-row h-full relative">
							{Object.keys(columns).map((month, index) => (
								<div key={index} className="flex flex-col border-r-2 border-gray-200 dark:border-gray-700">
									<p className="h-10 font-medium border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 pl-4 flex items-center">
										{month}
									</p>
									<div className="flex flex-row h-full">
										{columns[month].map((day, dayIndex) => (
											<div
												id={day.format('YYYY-MM-DD')}
												key={dayIndex}
												className={`border-r last:border-0
													${day.weekday() === 5 ? 'border-gray-200 dark:border-gray-700' : 'border-gray-100 dark:border-gray-800'} `}
												style={{ width: `${width}px` }}>

												<div className={`${day.isSame(dayjs(), 'day') ? 'bg-primary-500 text-white' : ' text-gray-500 dark:text-gray-400'} 
													size-6 flex items-center justify-center font-medium text-xs`}>
													{day.format('D')}

												</div>
											</div>
										))}
									</div>
								</div>
							))}


							{data.map((block, blockIndex) => (
								<div key={blockIndex}
									style={{
										height: `${height}px`,
										width: `${block.width}px`,
										left: `${block.x}px`,
										top: `${(block.y + 60)}px`
									}}
									className={`absolute ${block.color} rounded-lg flex items-center justify-center`}>

									{block.id}

								</div>
							))}
						</div>


					</div>
				</div>
			</div>
		</Box>
	)
}

export default GroupCalendar;