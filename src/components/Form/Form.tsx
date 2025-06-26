import React from 'react';
import './Form.scss';
import { Box, IBoxProps } from '../Box/Box';
import { IPageInheritedProps } from '../Page/Page';
import { Sizing } from '../Sizing/Sizing';
import { Action, IChildrenInheritedProps } from '@echino/echino.ui.sdk';

interface IFormProps extends IBoxProps, IPageInheritedProps, IChildrenInheritedProps<{ Field: string }> {
	HasLayout?: boolean;
	OnChange?: Action<any>;
}

interface IFormState {
	value: any;
}

export class Form extends React.Component<IFormProps, IFormState> {

	static defaultProps: IFormProps = {
		HasLayout: true,
		childrenProps: [],
	};

	constructor(props: IFormProps) {
		super(props);

		this.state = {
			value: {}
		}
	}

	fieldChanged(field: string, value: any) {
		let newValue = { ...this.state.value };
		if (field.includes('.')) {
			// Handle nested fields
			const keys = field.split('.');
			let current = newValue;
			for (let i = 0; i < keys.length - 1; i++) {
				if (!current[keys[i]]) {
					current[keys[i]] = {};
				}
				current = current[keys[i]];
			}
			current[keys[keys.length - 1]] = value;
		}
		else {
			newValue[field] = value;
		}

		this.setState({ value: newValue });

		if (this.props.OnChange) {
			this.props.OnChange(newValue);
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
		if (this.props.HasLayout) {
			return (
				<Sizing {...this.props}>
					<Box {...this.props}>
						<div className='grid grid-cols-12 gap-4 md:gap-6 @container'>
							{this.getChildren()}
						</div>
					</Box>
				</Sizing>
			)
		}
		else {
			return (
				<div className='grid grid-cols-12 gap-4 md:gap-6 @container'>
					{this.getChildren()}
				</div>
			)
		}

	}

}