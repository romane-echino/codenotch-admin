import React from 'react';
import './List.scss';
import { Sizing } from '../Sizing/Sizing';
import { Box, IBoxProps } from '../Box/Box';
import { IPageInheritedProps } from '../Page/Page';

interface IListProps extends IPageInheritedProps, IBoxProps {
	Source: any;
}

interface IListState {
	columns:{
		DisplayName?:string;
		Field:string;
		Output?:boolean;
		Renderer?: (item:any) => React.ReactNode;
	}[];

	data: any[];
}


interface IDataRequest {
	data: any[];
	state:'loading' | 'error' | 'success'| 'idle';
	meta:any;
}

export class List extends React.Component<IListProps, IListState> {

	constructor(props: IListProps) {
		super(props);

		this.state = {
			columns:[],
			data:[]
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


	updateSource(){
		if(Array.isArray(this.props.Source) && this.props.Source.length > 0) {
			const columns = Object.keys(this.props.Source[0]).map((key) => {
				return {
					DisplayName: key.charAt(0).toUpperCase() + key.slice(1),
					Field: key,
					Output: true
				};
			});
			this.setState({ columns, data: this.props.Source });
		}
		else if (typeof this.props.Source === 'object' && this.props.Source !== null) {
			let request = this.props.Source as IDataRequest;
			if (request.state === 'success' && Array.isArray(request.data)) {
				const columns = Object.keys(request.data[0]).map((key) => {
					return {
						DisplayName: key.charAt(0).toUpperCase() + key.slice(1),
						Field: key,
						Output: true
					};
				});
				this.setState({ columns, data: request.data });
			}
			else if (request.state === 'loading') {
				this.setState({ data: [] });
			}
		}
	}

	render() {
		return (
			<Sizing {...this.props}>
				<Box {...this.props}>

					<pre>{JSON.stringify(this.state.columns)}</pre>
					<pre>{JSON.stringify(this.state.data)}</pre>

					<div className="max-w-full overflow-x-auto custom-scrollbar">
						<table className="min-w-full">

							<thead className="border-gray-100 border-y dark:border-gray-800">
								<tr>

									<th className="px-6 py-3 whitespace-nowrap first:pl-0">
										<div className="flex items-center">
											<p className="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
												Products
											</p>
										</div>
									</th>
									<th className="px-6 py-3 whitespace-nowrap">
										<div className="flex items-center">
											<p className="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
												Category
											</p>
										</div>
									</th>
									<th className="px-6 py-3 whitespace-nowrap">
										<div className="flex items-center">
											<p className="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
												Price
											</p>
										</div>
									</th>
									<th className="px-6 py-3 whitespace-nowrap">
										<div className="flex items-center">
											<p className="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
												Status
											</p>
										</div>
									</th>
								</tr>
							</thead>


							<tbody className="py-3 divide-y divide-gray-100 dark:divide-gray-800">
								<tr>
									<td className="px-6 py-3 whitespace-nowrap first:pl-0">
										<div className="flex items-center">
											<div className="flex items-center gap-3">
												<div className="h-[50px] w-[50px] overflow-hidden rounded-md">
													<img src="src/images/product/product-01.jpg" alt="Product" />
												</div>
												<div>
													<p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
														Macbook pro 13”
													</p>
													<span className="text-gray-500 text-theme-xs dark:text-gray-400">
														2 Variants
													</span>
												</div>
											</div>
										</div>
									</td>
									<td className="px-6 py-3 whitespace-nowrap first:pl-0">
										<div className="flex items-center">
											<p className="text-gray-500 text-theme-sm dark:text-gray-400">
												Laptop
											</p>
										</div>
									</td>
									<td className="px-6 py-3 whitespace-nowrap first:pl-0">
										<div className="flex items-center">
											<p className="text-gray-500 text-theme-sm dark:text-gray-400">
												$2399.00
											</p>
										</div>
									</td>
									<td className="px-6 py-3 whitespace-nowrap first:pl-0">
										<div className="flex items-center">
											<p className="bg-success-50 text-theme-xs text-success-600 dark:bg-success-500/15 dark:text-success-500 rounded-full px-2 py-0.5 font-medium">
												Delivered
											</p>
										</div>
									</td>
								</tr>
								<tr>
									<td className="px-6 py-3 whitespace-nowrap first:pl-0">
										<div className="flex items-center col-span-4">
											<div className="flex items-center gap-3">
												<div className="h-[50px] w-[50px] overflow-hidden rounded-md">
													<img src="src/images/product/product-02.jpg" alt="Product" />
												</div>
												<div>
													<p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
														Apple Watch Ultra
													</p>
													<span className="text-gray-500 text-theme-xs dark:text-gray-400">
														1 Variants
													</span>
												</div>
											</div>
										</div>
									</td>
									<td className="px-6 py-3 whitespace-nowrap first:pl-0">
										<div className="flex items-center col-span-2">
											<p className="text-gray-500 text-theme-sm dark:text-gray-400">
												Watch
											</p>
										</div>
									</td>
									<td className="px-6 py-3 whitespace-nowrap first:pl-0">
										<div className="flex items-center col-span-2">
											<p className="text-gray-500 text-theme-sm dark:text-gray-400">
												$879.00
											</p>
										</div>
									</td>
									<td className="px-6 py-3 whitespace-nowrap first:pl-0">
										<div className="flex items-center col-span-2">
											<p className="bg-warning-50 text-theme-xs text-warning-600 dark:bg-warning-500/15 rounded-full px-2 py-0.5 font-medium dark:text-orange-400">
												Pending
											</p>
										</div>
									</td>
								</tr>
								<tr>
									<td className="px-6 py-3 whitespace-nowrap first:pl-0">
										<div className="flex items-center col-span-4">
											<div className="flex items-center gap-3">
												<div className="h-[50px] w-[50px] overflow-hidden rounded-md">
													<img src="src/images/product/product-03.jpg" alt="Product" />
												</div>
												<div>
													<p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
														iPhone 15 Pro Max
													</p>
													<span className="text-gray-500 text-theme-xs dark:text-gray-400">
														2 Variants
													</span>
												</div>
											</div>
										</div>
									</td>
									<td className="px-6 py-3 whitespace-nowrap first:pl-0">
										<div className="flex items-center col-span-2">
											<p className="text-gray-500 text-theme-sm dark:text-gray-400">
												SmartPhone
											</p>
										</div>
									</td>
									<td className="px-6 py-3 whitespace-nowrap first:pl-0">
										<div className="flex items-center col-span-2">
											<p className="text-gray-500 text-theme-sm dark:text-gray-400">
												$1869.00
											</p>
										</div>
									</td>
									<td className="px-6 py-3 whitespace-nowrap first:pl-0">
										<div className="flex items-center col-span-2">
											<p className="bg-success-50 text-theme-xs text-success-600 dark:bg-success-500/15 dark:text-success-500 rounded-full px-2 py-0.5 font-medium">
												Delivered
											</p>
										</div>
									</td>
								</tr>
								<tr>
									<td className="px-6 py-3 whitespace-nowrap first:pl-0">
										<div className="flex items-center col-span-4">
											<div className="flex items-center gap-3">
												<div className="h-[50px] w-[50px] overflow-hidden rounded-md">
													<img src="src/images/product/product-04.jpg" alt="Product" />
												</div>
												<div>
													<p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
														iPad Pro 3rd Gen
													</p>
													<span className="text-gray-500 text-theme-xs dark:text-gray-400">
														2 Variants
													</span>
												</div>
											</div>
										</div>
									</td>
									<td className="px-6 py-3 whitespace-nowrap first:pl-0">
										<div className="flex items-center col-span-2">
											<p className="text-gray-500 text-theme-sm dark:text-gray-400">
												Electronics
											</p>
										</div>
									</td>
									<td className="px-6 py-3 whitespace-nowrap first:pl-0">
										<div className="flex items-center col-span-2">
											<p className="text-gray-500 text-theme-sm dark:text-gray-400">
												$1699.00
											</p>
										</div>
									</td>
									<td className="px-6 py-3 whitespace-nowrap first:pl-0">
										<div className="flex items-center col-span-2">
											<p className="bg-error-50 text-theme-xs text-error-600 dark:bg-error-500/15 dark:text-error-500 rounded-full px-2 py-0.5 font-medium">
												Canceled
											</p>
										</div>
									</td>
								</tr>
								<tr>
									<td className="px-6 py-3 whitespace-nowrap first:pl-0">
										<div className="flex items-center col-span-4">
											<div className="flex items-center gap-3">
												<div className="h-[50px] w-[50px] overflow-hidden rounded-md">
													<img src="src/images/product/product-05.jpg" alt="Product" />
												</div>
												<div>
													<p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
														Airpods Pro 2nd Gen
													</p>
													<span className="text-gray-500 text-theme-xs dark:text-gray-400">
														1 Variants
													</span>
												</div>
											</div>
										</div>
									</td>
									<td className="px-6 py-3 whitespace-nowrap first:pl-0">
										<div className="flex items-center col-span-2">
											<p className="text-gray-500 text-theme-sm dark:text-gray-400">
												Accessories
											</p>
										</div>
									</td>
									<td className="px-6 py-3 whitespace-nowrap first:pl-0">
										<div className="flex items-center col-span-2">
											<p className="text-gray-500 text-theme-sm dark:text-gray-400">
												$240.00
											</p>
										</div>
									</td>
									<td className="px-6 py-3 whitespace-nowrap first:pl-0">
										<div className="flex items-center col-span-2">
											<p className="bg-success-50 text-theme-xs text-success-700 dark:bg-success-500/15 dark:text-success-500 rounded-full px-2 py-0.5 font-medium">
												Delivered
											</p>
										</div>
									</td>
								</tr>
							</tbody>

						</table>
					</div>
				</Box>
			</Sizing>
		)
	}

}