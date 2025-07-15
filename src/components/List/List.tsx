import React from 'react';
import './List.scss';
import { Sizing } from '../Sizing/Sizing';
import { Box, IBoxProps } from '../Box/Box';
import { IPageInheritedProps } from '../Page/Page';
import { getColumnsFromSource, getDataFromSource } from '../../utils/SourceHandling';
import { MenuButton } from '../MenuButton/MenuButton';

interface IListProps extends IPageInheritedProps, IBoxProps {
	Source?: any;
	Take?: number;
	ItemActions?: (as: string, data: any) => React.ReactNode;
}

export interface IListColumn {
	DisplayName?: string;
	Field: string;
	Output?: boolean;
	Visible?: boolean;
	Renderer?: (as: string, data: any) => React.ReactNode;
}

export const List: React.FC<IListProps> = (props) => {
	const [columns, setColumns] = React.useState<IListColumn[]>([]);
	const [data, setData] = React.useState<any[]>([]);

	React.useEffect(() => {
		updateSource();
	}, [props.Source]);



	const updateSource = () => {
		if (!props.Source) return;

		let sourceCustomColumns = React.Children.toArray(props.children)
			.map(c => (c as any).props.children.props)
			.filter(c => c.componentDescription.tag.split(':')[1] === 'ListColumn')


		let customColumns: IListColumn[] | undefined = undefined;
		if (sourceCustomColumns && sourceCustomColumns.length > 0) {
			customColumns = sourceCustomColumns.map((col: any) => {
				return {
					DisplayName: col.DisplayName || col.Field.charAt(0).toUpperCase() + col.Field.slice(1),
					Field: col.Field,
					Output: col.Output !== undefined ? col.Output : true,
					Visible: col.Visible !== undefined ? col.Visible : true,
					Renderer: col.Renderer
				};
			});
		}


		let columns: IListColumn[] = customColumns ?? getColumnsFromSource(props.Source).map((field: string) => {
			return {
				DisplayName: field.charAt(0).toUpperCase() + field.slice(1),
				Field: field,
				Output: true,
				Visible: true,
			};
		});

		let data: any[] = getDataFromSource(props.Source);
		//console.log("List columns", columns, customColumns, data);
		setColumns(columns);
		setData(data);
	}

	return (
		<Box {...props}>
			<div className='flex flex-row '>
				<div className='grow grid overflow-x-auto' style={{ gridTemplateColumns: `repeat(${columns.filter(c => c.Visible === true).length}, minmax(auto, 1fr))` }}>
					{columns.filter(c => c.Visible === true).map((column, index) => (
						<div key={index} className={`px-6 py-3 border-b border-gray-100 dark:border-gray-800 whitespace-nowrap first:pl-0`}>
							<p className="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
								{column.DisplayName || column.Field}
							</p>
						</div>
					))}

					{data.slice(0, props.Take ?? data.length).map((item, itemIndex) => {
						return columns.filter(c => c.Visible === true).map((column, colIndex) => {
							return (
								<div className={`px-6 py-3 border-b border-gray-100 dark:border-gray-800 whitespace-nowrap ${colIndex === 0 ? 'pl-0' : ''}`} key={colIndex + itemIndex}>

									<p className="text-gray-500 text-theme-sm dark:text-gray-400">
										{column.Renderer ? column.Renderer('item', item[column.Field]) : item[column.Field] || ''}
									</p>
								</div>
							)
						})
					})}
				</div>

				{props.ItemActions &&
					<div className=''>
						<div className='h-[49px]  border-b border-gray-100 dark:border-gray-800'>&nbsp;</div>
						{data.slice(0, props.Take ?? data.length).map((item, index) => {
							return (
								<div className='h-[49px] pl-2 border-b border-gray-100 dark:border-gray-800 flex items-center' key={index}>
									<MenuButton>
										{props.ItemActions!('item', item)}
									</MenuButton>
								</div>
							)
						})}
					</div>
				}
			</div>
		</Box>
	)
}

export default List;