import React from 'react';
import './List.scss';
import { Sizing } from '../Sizing/Sizing';
import { Box, IBoxProps } from '../Box/Box';
import { IPageInheritedProps } from '../Page/Page';

interface IListProps extends IPageInheritedProps, IBoxProps {
	Source: any[];
}

interface IListState {
	columns:{
		DisplayName?:string;
		Field:string;
		Output?:boolean;
		Renderer?: (item:any) => React.ReactNode;
	}[]
}

export class List extends React.Component<IListProps, IListState> {

	static defaultProps: IListProps = {
		Source: [
			{
				name: 'Macbook pro 13”',
				category: 'Laptop',
				amount: '$2399.00',
				status: 'Delivered',
			},
			{
				name: 'Apple Watch Ultra',
				category: 'Watch',
				amount: '$879.00',
				status: 'Pending',
			},
			{
				name: 'iPhone 15 Pro Max',
				category: 'SmartPhone',
				amount: '$1869.00',
				status: 'Delivered',
			},
			{
				name: 'iPad Pro 3rd Gen',
				category: 'Electronics',
				amount: '$1699.00',
				status: 'Canceled',
			},
			{
				name: 'Airpods Pro 2nd Gen',
				category: 'Accessories',
				amount: '$240.00',
				status: 'Delivered',
			}
		],
	}
	constructor(props: IListProps) {
		super(props);

		this.state = {
			columns:[]
		}
	}

	render() {
		return (
			<Sizing {...this.props}>
				<Box {...this.props}>
					<div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
								Recent Orders
							</h3>
						</div>

						<div className="flex items-center gap-3">
							<button className="text-theme-sm shadow-theme-xs inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
								<svg className="stroke-current fill-white dark:fill-gray-800" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M2.29004 5.90393H17.7067" stroke="" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
									<path d="M17.7075 14.0961H2.29085" stroke="" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
									<path d="M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z" fill="" stroke="" stroke-width="1.5"></path>
									<path d="M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z" fill="" stroke="" stroke-width="1.5"></path>
								</svg>

								Filter
							</button>

							<button className="text-theme-sm shadow-theme-xs inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
								See all
							</button>
						</div>
					</div>

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