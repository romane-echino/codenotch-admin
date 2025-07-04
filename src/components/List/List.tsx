import React from 'react';
import './List.scss';
import { Sizing } from '../Sizing/Sizing';
import { Box, IBoxProps } from '../Box/Box';
import { IPageInheritedProps } from '../Page/Page';
import { getColumnsFromSource, getDataFromSource } from '../../utils/SourceHandling';

interface IListProps extends IPageInheritedProps, IBoxProps {
	Source?: any;
	Take?: number;
}

interface IListState {
	columns: IListColumn[];

	data: any[];
}

export interface IListColumn {
	DisplayName?: string;
	Field: string;
	Output?: boolean;
	Visible?: boolean;
	Renderer?: (as: string, data: any) => React.ReactNode;
}


interface IDataRequest {
	data: any[];
	state: 'loading' | 'error' | 'success' | 'idle';
	meta: any;
}

export class List extends React.Component<IListProps, IListState> {

	constructor(props: IListProps) {
		super(props);

		this.state = {
			columns: [],
			data: []
		}
	}


	componentDidMount(): void {
		this.updateSource();
	}


	componentDidUpdate(prevProps: Readonly<IListProps>, prevState: Readonly<IListState>, snapshot?: any): void {
		if (JSON.stringify(prevProps.Source) !== JSON.stringify(this.props.Source)) {
			this.updateSource();
		}
	}


	updateSource() {
		if (!this.props.Source) return;

		let sourceCustomColumns = React.Children.toArray(this.props.children)
			.map(c => (c as any).props.children.props)
			.filter(c => c.componentDescription.tag.split(':')[1] === 'ListColumn')


		let customColumns: IListColumn[] | undefined = sourceCustomColumns.map((col: any) => {
			return {
				DisplayName: col.DisplayName || col.Field.charAt(0).toUpperCase() + col.Field.slice(1),
				Field: col.Field,
				Output: col.Output !== undefined ? col.Output : true,
				Visible: col.Visible !== undefined ? col.Visible : true,
				Renderer: col.Renderer
			};
		});


		let columns: IListColumn[] = getColumnsFromSource(this.props.Source, customColumns);
		let data: any[] = getDataFromSource(this.props.Source);
		this.setState({ columns: columns, data: data });
	}

	render() {
		return (
			<Box {...this.props}>

				<div className="max-w-full overflow-x-auto custom-scrollbar">
					<table className="min-w-full">

						<thead className="border-gray-100 border-y dark:border-gray-800">
							<tr>
								{this.state.columns.filter(c => c.Visible === true).map((column, index) => (
									<th key={index} className={`px-6 py-3 whitespace-nowrap first:pl-0`}>
										<div className="flex items-center">
											<p className="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
												{column.DisplayName || column.Field}
											</p>
										</div>
									</th>
								))}
							</tr>
						</thead>


						<tbody className="py-3 divide-y divide-gray-100 dark:divide-gray-800">

							{this.state.data.slice(0, this.props.Take ?? this.state.data.length).map((item, index) => {
								return (
									<tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
										{this.state.columns.filter(c => c.Visible === true).map((column, index) => {
											return (
												<td className="px-6 py-3 whitespace-nowrap first:pl-0">
													<div className="flex items-center">
														<p className="text-gray-500 text-theme-sm dark:text-gray-400">
															{column.Renderer ? column.Renderer('item', item[column.Field]) : item[column.Field] || ''}
														</p>
													</div>
												</td>
											)
										})}
									</tr>
								)
							})}

						</tbody>

					</table>
				</div>
			</Box>
		)
	}

}