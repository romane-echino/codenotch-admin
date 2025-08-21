import React from 'react';
import './Page.scss';
import { IChildrenInheritedProps } from '@echino/echino.ui.sdk';
import { Header } from './Parts/Header';

export interface IPageProps extends IChildrenInheritedProps<IPageInheritedProps> {

	Layout: 'Grid' | 'Flow' | 'Full'
	Size:'Large'|'Medium';
	Header?:React.ReactNode;

	Title?:string;
	Subtitle?:string;
	Icon?:string;
	ParentPageTitle?: string;
	ParentPageRoute?: string;
}

interface IPageState {
}

export interface IPageInheritedProps {
	ColSpan?: '1/2' | '1/3' | '1/4' | '2/3' | '3/4' | 'full' | 'none';
	RowSpan?:number;
}

export class Page extends React.Component<IPageProps, IPageState> {

	static defaultProps: IPageProps = {
		Layout: 'Grid',
		Size: 'Large',
		childrenProps: [],
	}

	constructor(props: IPageProps) {
		super(props);

		this.state = {
		}
	}

	componentDidMount(): void {
		//alert(JSON.stringify(this.props.Header, null, 2));
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


		const classes = `px-4 pt-4 pb-16 mx-auto ${this.props.Size === 'Large' ? 'max-w-[1536px]' : 'max-w-[768px]'} md:p-6`;
		switch (this.props.Layout) {
			case 'Grid':

				return (
					<div className={classes}>
						<Header CustomHeader={this.props.Header} {...this.props}/>

						<div className="grid grid-cols-12 gap-4 md:gap-6 pb">
							{this.getChildren()}
						</div>
					</div>
				)
			case 'Flow':
				return (
					<div className={classes}>
						<Header CustomHeader={this.props.Header} {...this.props}/>

						<div className="flex flex-col gap-4 md:gap-6">
							{this.getChildren()}
						</div>
					</div>
				)
			case 'Full':
				return (
					<div className="p-4 md:p-6">
						<Header CustomHeader={this.props.Header} {...this.props}/>

						<div className="flex flex-col gap-4 md:gap-6">
							{this.getChildren()}
						</div>
					</div>
				)
		}

	}
}