import React from 'react';
import './Page.scss';
import { IChildrenInheritedProps } from '@echino/echino.ui.sdk';

export interface IPageProps extends IChildrenInheritedProps<IPageInheritedProps> {

	Layout: 'Grid' | 'Flow' | 'Full'
}

interface IPageState {
}

export interface IPageInheritedProps {
	ColSpan?: '1/2' | '1/3' | '1/4' | '2/3' | '3/4' | 'full';
	RowSpan?:number;
}

export class Page extends React.Component<IPageProps, IPageState> {

	static defaultProps: IPageProps = {
		Layout: 'Grid',
		childrenProps: [],
	}

	constructor(props: IPageProps) {
		super(props);

		this.state = {
		}
	}

	getChildren() {

		let children = React.Children.map(this.props.children, (child, index) => {
			//@ts-ignore
			let effectiveProps = child.props;
			effectiveProps.children.props = {
				...this.props.childrenProps[index],
				...effectiveProps.children.props
			}

			if (React.isValidElement(child)) {
				//@ts-ignore
				return React.cloneElement(child, effectiveProps);
			}
		});

		return children;
	}

	render() {
		if (!this.props.children)
			return <div>no child</div>;

		switch (this.props.Layout) {
			case 'Grid':

				return (
					<div className="p-4 mx-auto max-w-[1536px] md:p-6">
						<div className="grid grid-cols-12 gap-4 md:gap-6">
							{this.getChildren()}
						</div>
					</div>
				)
			case 'Flow':
				return (
					<div className="p-4 mx-auto max-w-[1536px] md:p-6">
						<div className="flex flex-col gap-4 md:gap-6">
							{this.getChildren()}
						</div>
					</div>
				)
			case 'Full':
				return (
					<div className="p-4 md:p-6">
						<div className="flex flex-col gap-4 md:gap-6">
							{this.getChildren()}
						</div>
					</div>
				)
		}

	}
}