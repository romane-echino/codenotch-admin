import React from 'react';
import './Box.scss';
import { Sizing } from '../Sizing/Sizing';
import { Markdown } from '../Markdown/Markdown';
import { Action } from '@echino/echino.ui.sdk';
import { Helper } from '../AbstractInput/Helper';

export interface IBoxProps {

	Title?: string;
	Subtitle?: string;
	Icon?: string;
	Helper?: string;


	Actions?: React.ReactNode;
	Footer?: React.ReactNode;

	HasLayout?: boolean;
	GridLayout?: boolean;
	DisablePadding?: boolean;
	/**
	 * If true, the box will be displayed as a modal.
	 * @hidden
	 */
	Modal?: boolean;
	Clickable?: boolean;
	BoxClick?: Action;
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
				<div
					onClick={() => this.props.BoxClick?.()}
					className={`@container rounded-2xl bg-white
			${this.props.Clickable ? 'cursor-pointer hover:shadow-lg hover:border-primary hover:ring-3 hover:ring-primary/10' : ''}  
				${(this.props.Modal === true && !this.props.Footer) ? 'relative w-full max-w-[700px]' : ' h-full grow'} 
				${hasBorder && 'border border-gray-200 dark:border-gray-800'}  
				${this.props.Footer ? 'dark:bg-gray-900' : 'dark:bg-white/[0.03]'}`}>
					<BoxTitle {...this.props} />

					{this.props.Modal ?
						<div className={`max-h-[700px] overflow-x-hidden overflow-y-auto cn-scroll ${this.props.DisablePadding ? '' : 'p-5 md:p-6'}`}>
							{this.renderChildren()}
						</div>
						:
						<div className={`${this.props.DisablePadding ? '' : 'p-5 md:p-6'}`}>
							{this.renderChildren()}
						</div>

					}
				</div>
			)
		}
		else {
			return (
				<div className={`@container`}>
					<BoxTitle {...this.props} />

					{this.props.Modal ?
						<div className='max-h-[700px] pb-1 overflow-x-hidden px-1 overflow-y-auto cn-scroll'>
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
	Helper?: string;
}

export const HasTitle = (props:IBoxTitleProps):boolean => {
	return (props.Title !== undefined || props.Subtitle !== undefined || props.Actions !== undefined || props.Icon !== undefined || props.Helper !== undefined);
}

/**
 * BoxTitle component displays the title and subtitle of a box.
 * @hidden
 */
export const BoxTitle: React.FC<IBoxTitleProps> = (props) => {

	const { Title, Subtitle, Actions, Icon, DisableMargins } = props;
	return (
		<>
			{HasTitle(props) &&
				<div className={`flex items-center gap-4 ${DisableMargins?'py-4 md:py-6':'p-4 md:p-6'} border-b border-gray-200 dark:border-gray-800`}>
					{Icon &&
						<div className="flex size-[42px] items-center text-lg justify-center rounded-xl text-gray-800 dark:text-white/90 bg-gray-100 dark:bg-gray-800">
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
							<p className="mt-1 text-sm text-gray-500 dark:text-gray-700">
								<Markdown Type='Normal'>{Subtitle}</Markdown>
							</p>
						}
					</div>

					{Actions &&
						<div className='flex items-center gap-3'>
							{Actions}
						</div>
					}

					{props.Helper &&
						<Helper Size='large'>{props.Helper}</Helper>
					}
				</div>
			}
		</>
	)
}