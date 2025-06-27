import React from 'react';
import './Display.scss';
import { Sizing } from '../Sizing/Sizing';
import { Box, IBoxProps } from '../Box/Box';
import { IPageInheritedProps } from '../Page/Page';

interface IDisplayProps extends IPageInheritedProps, IBoxProps {
	Source?: any;
}

interface IDisplayState {
	fields: DisplayCustomColumns[];
}

interface DisplayCustomColumns {

	Field: string;
	Label: string;

}

export class Display extends React.Component<IDisplayProps, IDisplayState> {

	constructor(props: IDisplayProps) {
		super(props);

		this.state = {
			fields: []
		}
	}

	componentDidMount(): void {
		this.updateSource();
	}

	componentDidUpdate(prevProps: Readonly<IDisplayProps>, prevState: Readonly<IDisplayState>, snapshot?: any): void {
		if (JSON.stringify(prevProps.Source) !== JSON.stringify(this.props.Source)) {
			this.updateSource();
		}
	}

	updateSource() {
		if (!this.props.Source)
			return;

		let fields: DisplayCustomColumns[] = []

		let customFields = React.Children.toArray(this.props.children)
			.map(c => (c as any).props.children.props)
			.filter(c => c.componentDescription.tag.split(':')[1] === 'DisplayField')

		if (customFields.length > 0) {
			fields = customFields.map((col: any) => {
				return {
					Field: col.Field,
					Label: col.Label || col.field.charAt(0).toUpperCase() + col.field.slice(1)
				};
			});
			// When source is a direct array reference
		}
		else {
			fields = Object.keys(this.props.Source).filter(k => (typeof this.props.Source[k] !== 'object')).map((key) => {
				return {
					Field: key,
					Label: key.charAt(0).toUpperCase() + key.slice(1)
				};
			});

		}

		console.log('Display fields', fields);

		this.setState({ fields });
	}

	render() {
		if (!this.props.Source) {
			return null;
		}

		return (
			<Sizing {...this.props}>
				<Box {...this.props}>
					<div className="grid grid-cols-1 gap-4 justify-start lg:grid-cols-[auto_auto] lg:gap-7 2xl:gap-x-32">
						{this.state.fields.map((field, index) => {
							return (
								<div key={index}>
									<p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
										{field.Label}
									</p>
									<p className="text-sm font-medium text-gray-800 dark:text-white/90">
										{this.props.Source[field.Field] !== undefined ? this.props.Source[field.Field].toString() : 'N/A'}
									</p>
								</div>
							)
						})}
					</div>
				</Box>
			</Sizing>
		)
	}

}