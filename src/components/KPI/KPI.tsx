import React from 'react';
import './KPI.scss';
import { Sizing } from '../Sizing/Sizing';
import { IPageInheritedProps } from '../Page/Page';
import { Box, IBoxProps } from '../Box/Box';
import { Action } from '@echino/echino.ui.sdk';

interface IKPIProps extends IPageInheritedProps, IBoxProps {
	Icon?: string;
	Label?: string;
	Count?: number;
	Rate?: number;

	OnClick?: Action;
}

interface IKPIState {
}

export class KPI extends React.Component<IKPIProps, IKPIState> {

	constructor(props: IKPIProps) {
		super(props);

		this.state = {
		}
	}

	render() {
		return (
			<Box {...this.props} Clickable={this.props.OnClick ? true : false} BoxClick={() => this.props.OnClick?.()}>
				{this.props.Icon &&
					<div className="flex h-12 w-12 items-center text-lg justify-center rounded-xl text-gray-800 dark:text-white/90 bg-gray-100 dark:bg-gray-800">
						<i className={`${this.props.Icon}`}></i>
					</div>
				}

				<div className="mt-5 flex items-end justify-between">
					<div>
						<span className="text-sm text-gray-500 dark:text-gray-400">
							{this.props.Label}
						</span>
						<h4 className="mt-2 text-3xl font-bold text-gray-800 dark:text-white/90">
							{this.props.Count?.toLocaleString()}
						</h4>
					</div>

					{this.props.Rate &&
						<span className={`flex items-center gap-1 rounded-full  py-0.5 pl-2 pr-2.5 text-sm font-medium ${this.props.Rate >=0 ? 'bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500': 'bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500'}`}>
							<svg className="fill-current" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path fill-rule="evenodd" clip-rule="evenodd" d="M5.56462 1.62393C5.70193 1.47072 5.90135 1.37432 6.12329 1.37432C6.1236 1.37432 6.12391 1.37432 6.12422 1.37432C6.31631 1.37415 6.50845 1.44731 6.65505 1.59381L9.65514 4.5918C9.94814 4.88459 9.94831 5.35947 9.65552 5.65246C9.36273 5.94546 8.88785 5.94562 8.59486 5.65283L6.87329 3.93247L6.87329 10.125C6.87329 10.5392 6.53751 10.875 6.12329 10.875C5.70908 10.875 5.37329 10.5392 5.37329 10.125L5.37329 3.93578L3.65516 5.65282C3.36218 5.94562 2.8873 5.94547 2.5945 5.65248C2.3017 5.35949 2.30185 4.88462 2.59484 4.59182L5.56462 1.62393Z" fill=""></path>
							</svg>

							{this.props.Rate?.toLocaleString()}%
						</span>
					}
				</div>

			</Box>
		)
	}

}