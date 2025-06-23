import React from 'react';
import './Box.scss';

export interface IBoxProps {

	Title?: string;
	Subtitle?: string;
	Actions?: React.ReactNode;
	Footer?: React.ReactNode;
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
			<div className={`rounded-2xl h-full grow ${hasBorder && 'border border-gray-200'} bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6`}>
				{(this.props.Title!== undefined || this.props.Subtitle!== undefined || this.props.Actions !== undefined) &&
					<div className='flex justify-between'>
						<div>
							{this.props.Title &&
								<h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
									{this.props.Title}
								</h3>

							}
							{this.props.Subtitle &&
								<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
									{this.props.Subtitle}
								</p>
							}
						</div>

						{this.props.Actions &&
							<div className='flex items-center gap-3'>
								{this.props.Actions}
							</div>
						}
					</div>
				}

				{this.props.children}

			</div>
		)
	}

	render() {
		if (this.props.Footer) {
			return (
				<div className='border-gray-200 border bg-gray-100 rounded-2xl h-full flex flex-col'>
					{this.renderBox(false)}

					<div className='px-6 py-3.5 sm:py-5 flex items-center justify-center gap-5 sm:gap-8'>
						{this.props.Footer}
					</div>
				</div>
			)

		}
		else {
			return (
				<>
					{this.renderBox()}
				</>
			)
		}

	}

}