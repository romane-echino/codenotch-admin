import React from 'react';
import './List.scss';
import { Sizing } from '../Sizing/Sizing';
import { Box, IBoxProps } from '../Box/Box';
import { IPageInheritedProps } from '../Page/Page';
import { getColumnsFromSource, getDataFromSource } from '../../utils/SourceHandling';
import { MenuButton } from '../MenuButton/MenuButton';
import { Action, IChildrenInheritedProps } from '@echino/echino.ui.sdk';

interface IListProps extends IPageInheritedProps, IBoxProps, IChildrenInheritedProps<IListColumn> {
	Source?: any;
	Take?: number;
	ItemActions?: (as: string, data: any) => React.ReactNode;
	OnClick?: Action<{ index: number, item: any }>;
}

export interface IListColumn {
	DisplayName?: string;
	Field: string;
	Output?: boolean;
	Visible?: boolean;
	Align?: 'Left' | 'Right' | 'Center';
	Renderer?: (as: string, data: any) => React.ReactNode;
}

export const List: React.FC<IListProps> = (props) => {
	const [columns, setColumns] = React.useState<IListColumn[]>([]);
	const [outputFields, setOutputFields] = React.useState<string[]>([]);
	const [data, setData] = React.useState<any[]>([]);

	React.useEffect(() => {
		updateSource();
	}, [props.Source]);



	const updateSource = () => {
		const source = props.Source ?? [];
		const outputFields: string[] = [];
		let sourceCustomColumns = React.Children.toArray(props.children)
			.map(c => (c as any).props.children.props)
			.filter(c => c.componentDescription.tag.split(':')[1] === 'ListColumn')


		let customColumns: IListColumn[] | undefined = undefined;
		if (sourceCustomColumns && sourceCustomColumns.length > 0) {
			customColumns = sourceCustomColumns.map((col: any) => {
				if (col.Output !== undefined) {
					outputFields.push(col.Field);
				}

				return {
					DisplayName: col.DisplayName || col.Field.charAt(0).toUpperCase() + col.Field.slice(1),
					Field: col.Field,
					Output: col.Output !== undefined ? col.Output : true,
					Visible: col.Visible !== undefined ? col.Visible : true,
					Renderer: col.Renderer
				};
			});
		}


		let columns: IListColumn[] = customColumns ?? getColumnsFromSource(source).map((field: string) => {
			return {
				DisplayName: field.charAt(0).toUpperCase() + field.slice(1),
				Field: field,
				Output: true,
				Visible: true,
			};
		});

		let data: any[] = getDataFromSource(source);
		//console.log("List columns", columns, customColumns, data);
		setColumns(columns);
		setOutputFields(outputFields);
		setData(data);
	}


	const handleClick = (index: number) => {
		if (props.OnClick === undefined) return;

		if (outputFields.length > 0) {

			console.log("Handling click for item", index, "with output fields", outputFields);
			if (outputFields.length === 1) {
				props.OnClick?.({ index, item: data[index][outputFields[0]] });
			}
			else {
				const obj = data[index];
				const result = {};

				for (const field of outputFields) {
					if (obj[field] !== undefined) {
						result[field] = obj[field];
					}
				}

				props.OnClick?.({ index, item: result });
			}
		}
		else {
			props.OnClick?.({ index, item: data[index] });
		}
	}


	return (
		<Box {...props}>

			<div className='overflow-x-auto cn-scroll overflow-y-hidden'>

				<table className='w-full'>
					<thead>
						<tr className='border-b border-gray-100 dark:border-gray-800'>
							{columns.filter(c => c.Visible === true).map((column, index) => {
								const columnAlign = column.Align === 'Left' ? 'text-left' : column.Align === 'Right' ? 'text-right' : 'text-center';
								return(
									<td key={index} className={`px-6 py-3  whitespace-nowrap first:pl-0 font-medium text-gray-500 dark:text-gray-400 ${columnAlign}`}>
									{column.DisplayName || column.Field}
								</td>
								)
							})}

							{props.ItemActions &&
								<td className='size-12'>&nbsp;</td>
							}
						</tr>
					</thead>

					<tbody>
						{data.slice(0, props.Take ?? data.length).map((item, itemIndex) => {
							return (
								<tr
									onClick={() => handleClick(itemIndex)}
									className={`border-b border-gray-100 dark:border-gray-800 ${props.OnClick !== undefined ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.03]' : ''}`}>
									{columns.filter(c => c.Visible === true).map((column, colIndex) => {
										return (
											<td className={`px-6 py-3  whitespace-nowrap text-gray-500 dark:text-gray-400 ${colIndex === 0 ? 'pl-0' : ''}`}
												onClick={() => handleClick(itemIndex)}
												key={colIndex + itemIndex}>
												{column.Renderer ? column.Renderer('item', item[column.Field]) : item[column.Field] || <i className="fa-solid fa-empty-set text-sm opacity-80"></i>}
											</td>
										)
									})}

									{props.ItemActions &&
										<td className='px-6 py-3 whitespace-nowrap text-right size-12'>
											<MenuButton>
												{props.ItemActions('item', item)}
											</MenuButton>
										</td>
									}
								</tr>
							)
						})}
					</tbody>
				</table>
			</div>
		</Box>
	)
}

export default List;