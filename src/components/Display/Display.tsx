import React from 'react';
import './Display.scss';
import { Sizing } from '../Sizing/Sizing';
import { Box, IBoxProps } from '../Box/Box';
import { IPageInheritedProps } from '../Page/Page';
import { AbstractInputTitle } from '../AbstractInput/AbstractInput';
import { IChildrenInheritedProps } from '@echino/echino.ui.sdk';
import { LabelType } from '../Label/Label';

interface IDisplayProps extends IPageInheritedProps, IBoxProps, IChildrenInheritedProps<DisplayCustomColumns> {
	Source?: any;
	HasLayout?: boolean;
	AllowCopy?: boolean;
}

interface IDisplayState {
	fields:DisplayCustomColumns[];
}

interface DisplayCustomColumns {
	Field: string;
	Label: string;
	Type?: LabelType;
}

export class Display extends React.Component<IDisplayProps, IDisplayState> {
	static defaultProps = {
		HasLayout: true,
		AllowCopy: false
	};

	constructor(props: IDisplayProps) {
		super(props);

		this.state = {
			fields: []
		}
	}

	componentDidMount(): void {
		const fields: { [field: string]: DisplayCustomColumns } = {};

		Object.entries(this.props.Source || {}).forEach(([key, value]) => {
			const customProps = this.props.childrenProps?.find(c => c.Field === key);

			if (customProps) {
				fields[key] = {
					Field: customProps.Field,
					Label: customProps.Label || key.charAt(0).toUpperCase() + key.slice(1),
					Type: customProps.Type
				};
			}
			else {
				if (typeof value !== 'object') {
					fields[key] = {
						Field: key,
						Label: key.charAt(0).toUpperCase() + key.slice(1),
						Type: undefined
					};
				}
			}
		});

		const result = Object.values(fields);
		console.log('result', result);
		this.setState({ fields: result });
	}

	getContent() {
		return (
			<div className={`grid grid-cols-1 gap-4 justify-start lg:grid-cols-2 lg:gap-7 2xl:gap-x-32 ${this.props.AllowCopy ? 'select-text' : 'select-none'}`}>
				{this.state.fields.map((field, index) => {
					return (
						<div key={index} className='group'>
							<p className="mb-2 leading-normal text-gray-500 dark:text-gray-400">
								{field.Label}
							</p>

							<div onClick={() => this.props.AllowCopy === true && navigator.clipboard.writeText(this.props.Source[field.Field].toString())}
								className={`font-medium text-gray-800 dark:text-white/90 flex gap-2 ${this.props.AllowCopy === true ? 'cursor-pointer active:text-primary' : ''}`}>
								<div>{this.props.Source[field.Field] !== undefined ? this.props.Source[field.Field].toString() : 'N/A'}</div>
								{this.props.AllowCopy === true &&
									<i className="fa-regular fa-copy opacity-0 group-hover:opacity-100 cursor-pointer"
										title="Copy to clipboard" />
								}
							</div>
						</div>
					)
				})}
			</div>
		);
	}

	render() {
		if (!this.props.Source) {
			return null;
		}
		if (this.props.HasLayout) {
			return (
				<Box {...this.props}>
					{this.getContent()}
				</Box>
			)
		}
		else {
			return (
				<Sizing {...this.props}>
					<AbstractInputTitle {...this.props} />
					{this.getContent()}
				</Sizing>
			)
		}
	}

}
