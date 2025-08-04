import React, { PropsWithChildren } from 'react';

import { Sizing } from '../Sizing/Sizing';
import { IAbstractListAction, IInputProps } from '../AbstractInput/AbstractInput';
import { Helper } from '../AbstractInput/Helper';
import { IChildrenInheritedProps } from '@echino/echino.ui.sdk';

interface ITableProps extends IInputProps, IChildrenInheritedProps<{ Field: string }> {

}

export const Table: React.FC<ITableProps> = (props) => {
	const [rowCount, setRowCount] = React.useState(1);
	const [data, setData] = React.useState<any[]>([]);


	const handleUpdate = (index: number, colName: string, value: string) => {
		const newData = [...data];
		if (!newData[index]) {
			newData[index] = {};
		}
		newData[index][colName] = value;
		setData(newData);
	}

	const getChildren = (rowIndex: number) => {
		let children = React.Children.map(props.children, (child, index) => {

			//@ts-ignore
			let effectiveProps: any = { ...child.props };
			let field: string | undefined = props.childrenProps[index]?.Field;
			effectiveProps.children.props = {
				...props.childrenProps[index],
				...effectiveProps?.children?.props,
				Containered:true,
				OnChange: field ? (value: any) => handleUpdate(rowIndex, field, value) : undefined,
				OnSelect: field ? (value: IAbstractListAction) => handleUpdate(rowIndex, field, value.value) : undefined,
			}

			if (React.isValidElement(child)) {
				//@ts-ignore
				return React.cloneElement(child, effectiveProps);
			}
		});

		return children;
	}

	return (
		<Sizing {...props} Containered={true}>
			<div className='flex justify-between'>
				<div>
					{props.Title &&
						<label className={`${props.Subtitle ? '' : 'mb-1.5'} block text-sm font-medium text-gray-700 dark:text-gray-400`}>
							{props.Title}
						</label>
					}

					{props.Subtitle &&
						<label className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-500">
							{props.Subtitle}
						</label>
					}
				</div>

				{props.Helper &&
					<Helper>
						{props.Helper}
					</Helper>
				}
			</div>

			<div className='grid h-10 border-t border-l border-r border-gray-300 dark:border-gray-700 rounded-t-lg' style={{ gridTemplateColumns: `repeat(${props.childrenProps.length}, minmax(0, 1fr)) auto` }}>
				{props.childrenProps.map((col, index) => (
					<div key={index} className={`flex items-center justify-between px-4 py-2 border-r border-gray-200 dark:border-gray-800 ${index === props.childrenProps.length - 1 ? '' : 'border-r'}`}>
						<span className="text-sm font-medium text-gray-800 dark:text-white">{col.Field}</span>
					</div>
				))}


				<div className='size-10 flex items-center justify-center' onClick={() => setRowCount(rowCount + 1)}>
					<i className='fas fa-plus-circle text-green-500'></i>
				</div>
			</div>


			<div className={`dark:bg-dark-900 min-h-11 w-full rounded-b-lg border bg-transparent text-sm  dark:bg-gray-900 text-gray-800 dark:text-white/90 border-gray-300 dark:border-gray-700 grid`} style={{ gridTemplateColumns: `repeat(${props.childrenProps.length}, minmax(0, 1fr)) auto` }}>
				{Array.from({ length: rowCount }).map((_, rowIndex) => (
					<React.Fragment key={rowIndex}>
						{getChildren(rowIndex)?.map((child, childIndex) => (
							<div key={childIndex} className={`flex items-center justify-between px-4 py-2 border-r border-gray-200 dark:border-gray-800 ${childIndex === props.childrenProps.length - 1 ? '' : 'border-r'}`}>
								{child}
							</div>
						))}
						
						<div className='size-10 flex items-center justify-center' onClick={() => rowCount > 1 && setRowCount(rowCount - 1)}>
							<i className='fas fa-minus-circle text-red-500'></i>
						</div>
					</React.Fragment>
				))}
			</div>


			<pre>
				{JSON.stringify(data, null, 2)}
			</pre>
		</Sizing>
	);
}