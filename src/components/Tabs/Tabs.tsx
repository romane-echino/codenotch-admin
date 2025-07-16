import React from 'react';
import './Tabs.scss';
import { Tab } from '@headlessui/react';
import { Box, IBoxProps } from '../Box/Box';
import { IChildrenInheritedProps } from '@echino/echino.ui.sdk';
import { IPageInheritedProps } from '../Page/Page';

interface ITabsProps extends IBoxProps, IPageInheritedProps,  IChildrenInheritedProps<{ Title: string, Icon?: string, Badge?: string }> {
	Orientation?: 'Horizontal' | 'Vertical';
	HasLayout?: boolean;
}

interface ITabsState {
}

export class Tabs extends React.Component<ITabsProps, ITabsState> {

	static defaultProps = {
		HasLayout: true,
		Orientation: 'Horizontal'
	};

	constructor(props: ITabsProps) {
		super(props);

		this.state = {
		}
	}


	getChildren() {

		return (
			<Tab.Group as={'div'} className={`${this.props.Orientation === 'Vertical' ? 'flex flex-col md:flex-row gap-6' : ''}`}>
				<div className={`${this.props.Orientation === 'Vertical' ? '' : 'border-b border-gray-200 dark:border-gray-800'}`}>
					<Tab.List className={`-mb-px flex ${this.props.Orientation === 'Vertical' ? 'flex-col space-y-2' : 'space-x-2'} overflow-x-auto [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 dark:[&::-webkit-scrollbar-thumb]:bg-gray-600 dark:[&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:h-1.5`}>
						{this.props.childrenProps.map((child, index) => (
							<Tab key={index} as={React.Fragment}>
								{({ selected }) => (
									<button className={`inline-flex cursor-pointer outline-none items-center gap-2 ${this.props.Orientation === 'Vertical' ? 'rounded-lg' : 'border-b-2'} px-2.5 py-2 text-sm font-medium transition-colors duration-200 ease-in-out 
									${selected ? `${this.props.Orientation === 'Vertical' ? 'text-primary-500 dark:bg-primary-400/20 dark:text-primary-400 bg-primary-50' : 'text-primary-500 border-primary-500 dark:text-primary-400 dark:border-primary-400'}` : 
									'bg-transparent text-gray-500 border-transparent hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}>
										{child.Icon &&
											<i className={`${child.Icon} ${selected ? 'text-primary-500 dark:text-primary-400' : 'text-gray-500'}`}></i>
										}

										{child.Title}

										{child.Badge &&
											<span className="inline-block items-center justify-center rounded-full bg-primary-50 px-2 py-0.5 text-center text-xs font-medium text-primary-500 dark:bg-primary-500/15 dark:text-primary-400">
												{child.Badge}
											</span>}
									</button>
								)}
							</Tab>
						))}
					</Tab.List>
				</div>

				<Tab.Panels className={`${this.props.Orientation === 'Vertical' ? '' : 'pt-4'}`}>
					{React.Children.map(this.props.children, (child, index) => (
						<Tab.Panel key={index}>
							{child}
						</Tab.Panel>
					))}
				</Tab.Panels>
			</Tab.Group>
		)
	}

	render() {
		if (this.props.HasLayout) {
			return (
				<Box {...this.props}>
					<div>
						{this.getChildren()}
					</div>
				</Box>
			)
		}
		else {
			return (
				<div>
					{this.getChildren()}
				</div>
			)
		}
	}
}