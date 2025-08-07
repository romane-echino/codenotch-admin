import React from 'react';
import './Form.scss';
import { Box, IBoxProps } from '../Box/Box';
import { IPageInheritedProps } from '../Page/Page';
import { Action, IBindableComponentProps, IChildrenInheritedProps } from '@echino/echino.ui.sdk';
import { IAbstractListAction } from '../AbstractInput/AbstractInput';
import { Sizing } from '../Sizing/Sizing';

interface IFormProps extends IBoxProps, IPageInheritedProps, IBindableComponentProps, IChildrenInheritedProps<{ Field: string }> {
	HasLayout?: boolean;
	OnChange?: Action<any>;
	Lazy?: boolean;
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

	changeTimer: any = null;

	constructor(props: IFormProps) {
		super(props);

		this.state = {
			value: {}
		}


		this.props.declareFunction('disable', (value: boolean) => {
			this.setState({ disabled: value });
		});
	}

	fieldChanged(field: string, value: any) {
		this.setState((prevState) => {
			let newValue = { ...prevState.value };

			if (this.props.Lazy && this.changeTimer !== null) {
				clearTimeout(this.changeTimer);
				this.changeTimer = null;
			}

			// Split the field path using regex to handle both dot notation and array notation
			const pathParts = field.split(/\.|\[|\]/).filter(Boolean);

			let current = newValue;
			const lastIndex = pathParts.length - 1;

			for (let i = 0; i < lastIndex; i++) {
				const part = pathParts[i];
				const nextPart = pathParts[i + 1];
				const isNextPartArrayIndex = !isNaN(Number(nextPart));

				// If current part doesn't exist in the object, create it
				if (current[part] === undefined) {
					// If the next part is a number, create an array
					if (isNextPartArrayIndex) {
						current[part] = [];
					} else {
						current[part] = {};
					}
				}

				// Move to the next level
				current = current[part];

				// If current is an array and the next part is an array index
				if (Array.isArray(current) && isNextPartArrayIndex) {
					const index = parseInt(nextPart);

					// Ensure the array has enough elements
					while (current.length <= index) {
						current.push({});
					}

					// Skip the next part since we've already handled it
					if (i < lastIndex - 1) {
						current = current[index];
						i++;
					}
				}
			}

			// Set the value at the final path
			const lastPart = pathParts[lastIndex];
			current[lastPart] = value;

			this.props.onPropertyChanged('value', undefined, newValue);

			if (this.props.Lazy) {
				this.changeTimer = setTimeout(() => {
					if (this.props.OnChange) {
						this.props.OnChange(newValue);
					}
				}, 750);
			}
			else {
				if (this.props.OnChange) {
					this.props.OnChange(newValue);
				}
			}

			return { value: newValue };
		});
	}




	getChildren() {
		let children = React.Children.map(this.props.children, (child, index) => {

			//@ts-ignore
			let effectiveProps: any = { ...child.props };
			let field: string | undefined = this.props.childrenProps[index]?.Field;
			effectiveProps.children.props = {
				...this.props.childrenProps[index],
				...effectiveProps?.children?.props,
				OnChange: field ? (value: any) => this.fieldChanged(field, value) : undefined,
				OnSelect: field ? (value: IAbstractListAction) => this.fieldChanged(field, value.value) : undefined,
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
				<Box {...this.props}>
					<div className={classAttributes}>
						{this.getChildren()}
					</div>
				</Box>
			)
		}
		else {
			return (
				<Sizing {...this.props} Containered={true}>
					<div className={classAttributes}>
						{this.getChildren()}
					</div>
				</Sizing>
			)
		}

	}

}