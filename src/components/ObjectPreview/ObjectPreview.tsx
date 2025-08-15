import React, { useEffect } from 'react';
import './ObjectPreview.scss';
import { Sizing } from '../Sizing/Sizing';
import { Box } from '../Box/Box';

interface IObjectPreviewProps {
	Source?: any;
}


export const ObjectPreview: React.FC<IObjectPreviewProps> = (props) => {
	const [source, setSource] = React.useState(props.Source);


	useEffect(() => {
		setSource(props.Source);
	}, [props.Source]);


	const defaultSpan = (content) => <div className='text-gray-500 dark:text-gray-400 truncate w-full flex gap-1 items-center'>{content}</div>;

	const getValue = (key: string, value: any) => {
		let color = 'bg-wisteria';
		let icon = 'fas fa-square-question';
		let valueDisplay = defaultSpan('null');


		switch (typeof value) {
			case 'string':
				if (value.charAt(0) === "#") {
					color = 'bg-pomegranate';
					icon = 'fas fa-palette';
					valueDisplay = defaultSpan(
						<>
							<div className='size-4' style={{ backgroundColor: value }}>&nbsp;</div>
							<div>{value}</div>
						</>
					);
				}
				else if (value.startsWith('http://') || value.startsWith('https://')) {
					color = 'bg-orange';
					icon = 'fas fa-link';
					valueDisplay = <a href={value} target='_blank' rel='noopener noreferrer' className='text-primary'>
						Link
					</a>;
				}
				//test if date iso string
				else if (value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/)) {
					color = 'bg-sunflower';
					icon = 'fas fa-calendar';
					valueDisplay = defaultSpan(new Date(value).toLocaleString());
				}
				else {
					color = 'bg-emerald';
					icon = 'fas fa-input-text';
					valueDisplay = defaultSpan(value);
				}
				break;
			case 'number':
				color = 'bg-pomegranate';
				icon = 'fas fa-input-numeric';
				valueDisplay = defaultSpan(value.toString());
				break;
			case 'boolean':
				color = 'bg-emerald';
				icon = 'fas fa-object-subtract';
				valueDisplay = defaultSpan(value ? 'true' : 'false');
				break;
		}


		return (
			<div className='overflow-hidden'>
				<div className='grid grid-cols-[auto_1fr_1fr_auto] gap-2 items-center bg-white dark:bg-gray-800 p-2 rounded-md shadow-sm'>
					<div className={`size-6 ${color} text-white flex items-center justify-center rounded-lg`}>
						<i className={`${icon} flex items-center justify-center`}></i>
					</div>
					<div className='grow font-medium text-gray-600 dark:text-gray-400'>
						{key}
					</div>
					<div>
						{valueDisplay}
					</div>
					<div className='size-6 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400'>
					</div>
				</div>
			</div>
		)
	};

	const getStructure = (obj: any): any => {
		if (!obj || typeof obj !== 'object') return obj;

		if (Array.isArray(obj)) {
			return obj.map(item => getStructure(item));
		}

		const result = (
			<div className='flex flex-col gap-2'>
				{Object.entries(obj).sort(([keyA], [keyB]) => keyA.localeCompare(keyB)).map(([key, value]) => {
					if (typeof value === 'object') {
						return (
							<div key={key} className='overflow-hidden'>
								<div className='grid grid-cols-[auto_1fr_auto] gap-2 items-center bg-white dark:bg-gray-800 p-2 rounded-md shadow-sm'>
									<div className='size-6 bg-wisteria text-white flex items-center justify-center rounded-lg'>
										<i className="far fa-cube flex items-center justify-center"></i>
									</div>
									<div className='grow font-medium text-gray-600 dark:text-gray-400'>
										{key}
									</div>
									<div className='size-6 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400'>
										{'{'}{Object.keys(value!).length}{'}'}
									</div>
								</div>
								{Object.keys(value!).length > 0 && (
									<div className='flex flex-row ml-4 mt-2 mb-4'>
										<div className='border-l border-gray-200 dark:border-gray-800'></div>
										<div className='ml-4 grow'>{getStructure(value)}</div>
									</div>
								)}
							</div>
						);
					} else if (Array.isArray(value)) {
						return (
							<div key={key} className='flex flex-row gap-2'>
								<strong>{key}:</strong> <div className='ml-2'>{getStructure(value)}</div>
							</div>
						);
					}
					else {
						return getValue(key, value);
					}

				})}
			</div>
		)

		return result;
	};

	if (!source) {
		return null;
	}

	return (
		<Box>
			{getStructure(source)}
		</Box>
	)
}
