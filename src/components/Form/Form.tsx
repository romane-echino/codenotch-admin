import React from 'react';
import './Form.scss';
import { Box, IBoxProps } from '../Box/Box';
import { IPageInheritedProps } from '../Page/Page';
import { Sizing } from '../Sizing/Sizing';
import { Action, IChildrenInheritedProps } from '@echino/echino.ui.sdk';

interface IFormProps extends IBoxProps, IPageInheritedProps, IChildrenInheritedProps<{Field:string}> {
	HasLayout?: boolean;
	OnChange?:Action<any>;
}

interface IFormState {
	value:any;
}

export class Form extends React.Component<IFormProps, IFormState> {

	static defaultProps: IFormProps = {
		HasLayout: true,
		childrenProps:[],
	};

	constructor(props: IFormProps) {
		super(props);

		this.state = {
			value: {}
		}
	}

	fieldChanged(field:string, value:any) {
		let newValue = { ...this.state.value };
		if(field.includes('.')) {
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
		return React.Children.map(this.props.children, (child,index) => {
			let childProps = this.props.childrenProps[index] || {};
			if (React.isValidElement(child)) {
				// Clone the child and pass additional props
				return React.cloneElement(child, {
					...child.props,
					OnChange: childProps.Field ? (value: any) => this.fieldChanged(childProps.Field, value) : undefined,
				});
			}
			return child; // Return the child as is if it's not a valid React element
		});
	}

	render() {
		if (this.props.HasLayout) {
			return (
				<Sizing {...this.props}>
					<Box {...this.props}>
						<div className='grid grid-cols-12 gap-4 md:gap-6'>
							{this.props.children}
						</div>
					</Box>
				</Sizing>
			)
		}
		else {
			return (
				<>
					{this.props.children}
				</>
			)
		}

	}

}