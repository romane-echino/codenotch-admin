import React from 'react';
import './Form.scss';
import { Box, IBoxProps } from '../Box/Box';
import { IPageInheritedProps } from '../Page/Page';
import { Sizing } from '../Sizing/Sizing';
import { Action, IBindableComponentProps, IChildrenInheritedProps } from '@echino/echino.ui.sdk';

interface IFormProps extends IBoxProps, IPageInheritedProps,IBindableComponentProps, IChildrenInheritedProps<{ Field: string }> {
	HasLayout?: boolean;
	OnChange?: Action<any>;
}

interface IFormState {
	value: any;
	disabled?: boolean;
}

export class Form extends React.Component<IFormProps, IFormState> {

	static defaultProps = {
		HasLayout: true,
		childrenProps: [],
	};

	constructor(props: IFormProps) {
		super(props);

		this.state = {
			value: {}
		}

		this.props.declareFunction('disable',(value: boolean) => {
			this.setState({ disabled: value });
		});
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
		this.props.onPropertyChanged('value', undefined, newValue);

		if (this.props.OnChange) {
			this.props.OnChange(newValue);
		}
	}

	getChildren() {
		let children = React.Children.map(this.props.children, (child, index) => {
			
			//@ts-ignore
			let effectiveProps:any = { ...child.props };
			let field:string |undefined = this.props.childrenProps[index]?.Field;
			effectiveProps.children.props = {
				...this.props.childrenProps[index],
				...effectiveProps?.children?.props,
				OnChange:field ? (value: any) => this.fieldChanged(field, value) : undefined,
			}

			if (React.isValidElement(child)) {
				//@ts-ignore
				return React.cloneElement(child, effectiveProps);
			}
		});

		return children;
	}

	render() {

		let classAttributes = `grid grid-cols-12 gap-4 md:gap-6 @container 
		${this.state.disabled ? 'pointer-events-none opacity-50' : ''}`;
		
		if (this.props.HasLayout) {
			return (
				<Sizing {...this.props}>
					<Box {...this.props}>
						<div className={classAttributes}>
							{this.getChildren()}
						</div>
					</Box>
				</Sizing>
			)
		}
		else {
			return (
				<div className={classAttributes}>
					{this.getChildren()}
				</div>
			)
		}

	}

}