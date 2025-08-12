import React from 'react';
import './Box.scss';
import { Sizing } from '../Sizing/Sizing';
import { Markdown } from '../Markdown/Markdown';

export interface IBoxProps {

	Title?: string;
	Subtitle?: string;
	Icon?: string;

	Actions?: React.ReactNode;
	Footer?: React.ReactNode;

	HasLayout?: boolean;
	GridLayout?: boolean;

	/**
	 * If true, the box will be displayed as a modal.
	 * @hidden
	 */
	Modal?: boolean;
	Clickable?: boolean;
}

interface IBoxState {
}

export class Box extends React.Component<IBoxProps, IBoxState> {

	static defaultProps = {
		HasLayout: true
	};

	constructor(props: IBoxProps) {
		super(props);

		this.state = {
		}
	}


	renderChildren() {
		if (this.props.GridLayout) {
			return (
				<div className='grid grid-cols-12 gap-4 md:gap-6'>
					{this.props.children}
				</div>
			)
		}
		else {
			return this.props.children;
		}
	}

	renderBox(hasBorder: boolean = true) {
		if (this.props.HasLayout) {
			return (
				<div className={`group @container rounded-2xl bg-white p-5 dark:border-gray-800 md:p-6
			${this.props.Clickable ? 'cursor-pointer hover:shadow-lg hover:border-primary hover:ring-3 hover:ring-primary/10' : ''}  
				${(this.props.Modal === true && !this.props.Footer) ? 'relative w-full max-w-[700px]' : ' h-full grow'} 
				${hasBorder && 'border border-gray-200'}  
				${this.props.Footer ? 'dark:bg-gray-900' : 'dark:bg-white/[0.03]'}`}>
					<BoxTitle {...this.props} />

					{this.props.Modal ?
						<div className='max-h-[550px] pb-1 overflow-x-hidden px-1 overflow-y-auto cn-scroll'>
							{this.renderChildren()}
						</div> :
						this.renderChildren()
					}
				</div>
			)
		}
		else {
			return (
				<div className={`group @container`}>
					<BoxTitle {...this.props} />

					{this.props.Modal ?
						<div className='max-h-[550px] pb-1 overflow-x-hidden px-1 overflow-y-auto cn-scroll'>
							{this.renderChildren()}
						</div> :
						this.renderChildren()
					}
				</div>
			)
		}
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


interface IBoxTitleProps extends IBoxProps {
	Title?: string;
	Subtitle?: string;
	Actions?: React.ReactNode;
	DisableMargins?: boolean;
	Icon?: string;
}

/**
 * BoxTitle component displays the title and subtitle of a box.
 * @hidden
 */
export const BoxTitle: React.FC<IBoxTitleProps> = (props) => {

	const { Title, Subtitle, Actions, Icon, DisableMargins } = props;
	return (
		<>
			{(Title !== undefined || Subtitle !== undefined || Actions !== undefined) &&
				<div className={`flex items-center gap-2 ${DisableMargins ? '' : 'mb-4'}`}>
					{Icon &&
						<div className="flex h-12 w-12 items-center text-lg justify-center rounded-xl text-gray-800 dark:text-white/90 bg-gray-100 dark:bg-gray-800">
							<i className={`${Icon}`}></i>
						</div>
					}

					<div className='grow'>
						{Title &&
							<h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
								{Title}
							</h3>

						}
						{Subtitle &&
							<p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
								<Markdown Type='Normal'>{Subtitle}</Markdown>
							</p>
						}
					</div>

					{Actions &&
						<div className='flex items-center gap-3'>
							{Actions}
						</div>
					}
				</div>
			}
		</>
	)
}