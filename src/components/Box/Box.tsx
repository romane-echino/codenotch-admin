import React from 'react';
import './Box.scss';
import { Sizing } from '../Sizing/Sizing';

export interface IBoxProps {

	Title?: string;
	Subtitle?: string;
	Actions?: React.ReactNode;
	Footer?: React.ReactNode;
	Modal?: boolean;
}

interface IBoxState {
}

export class Box extends React.Component<IBoxProps, IBoxState> {

	constructor(props: IBoxProps) {
		super(props);

		this.state = {
		}
	}

	renderBox(hasBorder: boolean = true) {
		return (
			<div className={`rounded-2xl bg-white p-5 dark:border-gray-800 md:p-6  
				${(this.props.Modal === true && !this.props.Footer) ? 'relative w-full max-w-[700px]' : ' h-full grow'} 
				${hasBorder && 'border border-gray-200'}  
				${this.props.Footer ? 'dark:bg-gray-900' : 'dark:bg-white/[0.03]'}`}>
				<BoxTitle {...this.props} />

				{this.props.Modal ?
					<div className='max-h-[550px] pb-1 overflow-x-hidden px-1 overflow-y-auto cn-scroll'>
						{this.props.children}
					</div> :
					this.props.children
				}
			</div>
		)
	}

	render() {
		if (this.props.Footer) {
			return (
				<Sizing {...this.props}>
					<div className='dark:bg-gray-900 rounded-2xl shadow-2xl h-full'>
						<div className={`border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03] border rounded-2xl ${this.props.Modal ? 'relative w-full max-w-[700px]' : 'h-full'} flex flex-col`}>
							{this.renderBox(false)}

							<div className={`px-6 py-3.5 sm:py-5 flex ${this.props.Modal ? '*:grow' : ' justify-center'} items-center gap-5 sm:gap-8 `}>
								{this.props.Footer}
							</div>
						</div>
					</div>
				</Sizing>
			)

		}
		else {
			return (
				<Sizing {...this.props}>
					{this.renderBox()}
				</Sizing>
			)
		}

	}

}


export const BoxTitle: React.FC<IBoxProps> = (props) => {
	return (
		<>
			{(props.Title !== undefined || props.Subtitle !== undefined || props.Actions !== undefined) &&
				<div className='flex flex-col sm:flex-row gap-2 sm:justify-between mb-4 sm:items-center'>
					<div>
						{props.Title &&
							<h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
								{props.Title}
							</h3>

						}
						{props.Subtitle &&
							<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
								{props.Subtitle}
							</p>
						}
					</div>

					{props.Actions &&
						<div className='flex items-center gap-3'>
							{props.Actions}
						</div>
					}
				</div>
			}
		</>
	)
}