import React from 'react';
import './List.scss';
import { Sizing } from '../Sizing/Sizing';
import { Box, IBoxProps } from '../Box/Box';
import { IPageInheritedProps } from '../Page/Page';

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
		if (!this.props.Source)
			return;

		let sourceCustomColumns = React.Children.toArray(this.props.children)
			.map(c => (c as any).props.children.props)
			.filter(c => c.componentDescription.tag.split(':')[1] === 'ListColumn')

		let columns: IListColumn[] = [];
		let customColumns: IListColumn[] | undefined = undefined;

		//When custom columns are provided
		if (sourceCustomColumns.length > 0) {
			customColumns = sourceCustomColumns.map((col: any) => {
				return {
					DisplayName: col.DisplayName || col.Field.charAt(0).toUpperCase() + col.Field.slice(1),
					Field: col.Field,
					Output: col.Output !== undefined ? col.Output : true,
					Visible: col.Visible !== undefined ? col.Visible : true,
					Renderer: col.Renderer
				};
			});
			// When source is a direct array reference
		}
		
		if (Array.isArray(this.props.Source) && this.props.Source.length > 0) {
			columns = customColumns ?? Object.keys(this.props.Source[0]).map((key) => {
				return {
					DisplayName: key.charAt(0).toUpperCase() + key.slice(1),
					Field: key,
					Output: true,
					Visible: true,
				};
			});

			this.setState({ columns: columns, data: this.props.Source });
		}
		// When source is a query API / SIOQL
		else if (typeof this.props.Source === 'object' && this.props.Source !== null) {
			let request = this.props.Source as IDataRequest;


			if (request.state === 'success' && request.data) {
				//For API object data structure
				if (Array.isArray(request.data)) {
					columns = customColumns ?? Object.keys(request.data[0]).map((key) => {
						return {
							DisplayName: key.charAt(0).toUpperCase() + key.slice(1),
							Field: key,
							Output: true,
							Visible: true,
						};
					});

					this.setState({ columns: columns, data: request.data });
				}
				//For SIOQL object data structure
				else if (typeof request.data === 'object' && request.data !== null) {
					let arrayKey = Object.keys(request.data).find(key => Array.isArray(request.data[key]));
					console.log('arrayKey', arrayKey, request.data[arrayKey!], Object.keys(request.data[arrayKey!][0]));
					if (arrayKey) {
						columns = customColumns ?? Object.keys(request.data[arrayKey][0]).map((key) => {
							return {
								DisplayName: key.charAt(0).toUpperCase() + key.slice(1),
								Field: key,
								Output: true,
								Visible: true,
							};
						});

						this.setState({ columns: columns, data: request.data[arrayKey] });
					}
					else {
						this.setState({ columns: columns, data: [] });
						console.warn('No array found in SIOQL data structure', request.data);
					}
				}
			} else {
				this.setState({ columns: columns, data: [] });
			}
		}
	}

	render() {
		return (
			<Sizing {...this.props}>
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
			</Sizing>
		)
	}

}