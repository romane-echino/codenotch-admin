import React from 'react';
import './Progressbar.scss';
import { Box, BoxTitle } from '../Box/Box';
import { Action } from '@echino/echino.ui.sdk';
import { Sizing } from '../Sizing/Sizing';

interface IProgressbarProps {
	Max: number;
	Current: number;

	Icon?: string;
	Title?: string;
	Subtitle?: string;

	Percentage?: boolean;
	HasLayout?: boolean;

	OnClick?: Action;
}

export const Progressbar: React.FC<IProgressbarProps> = (props) => {
	const {
		Title,
		Subtitle,
		Icon,
		Max = 100,
		Current = 0,
		HasLayout = true,
		Percentage,
		OnClick
	} = props;
	const finished = Current >= Max;


	const renderComponent = () => {
		return (
			<div className="flex items-center gap-4">
				<div className='grow rounded-full bg-gray-200 dark:bg-gray-700 h-4'>
					{Current > 0 &&
						<div className={`h-4 rounded-full ring-4 min-w-2
					${finished ? 'bg-success-500 ring-success-500/40' : 'bg-primary ring-primary/40'}  `}
							style={{ width: `${(Current / Max) * 100}%` }}></div>
					}
				</div>

				<div>
					{finished ?
						<i className='fas fa-check text-success-500 text-lg'></i>
						:
						<span className='text-gray-500 dark:text-gray-400 text-sm'>
							{Percentage ?
								`${Math.round((Current / Max) * 100)}%` :
								`${Current} / ${Max}`
							}
						</span>
					}
				</div>

				{props.OnClick &&
					<div>
						<i className='fas fa-chevron-right group-hover:text-primary text-gray-500 dark:text-gray-400'></i>
					</div>
				}
			</div>
		)
	}

	if (HasLayout) {
		return (
			<Box {...props} Clickable={OnClick !== undefined} >
				{renderComponent()}
			</Box>
		)
	}
	else {
		return (
			<Sizing {...props} Containered={true}>
				<div className={`group ${OnClick ? 'cursor-pointer' : ''}`}
					onClick={() => OnClick?.()}>
						<BoxTitle Icon={Icon} Title={Title} Subtitle={Subtitle} />
					{renderComponent()}
				</div>
			</Sizing>
		)
	}
}
