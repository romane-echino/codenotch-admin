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
	AwaitProps?: boolean;
	Value?: any;
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
			value: {},
			disabled: props.AwaitProps? true : false
		}


		this.props.declareFunction('disable', (value: boolean) => {
			this.setState({ disabled: value });
		});
	}


	componentDidMount(): void {
		if (this.props.Value !== undefined && this.props.Value !== null) {
			console.log("Setting initial value from props", this.props.Value);
			this.setState({ value: this.props.Value }, () => {
				this.props.onPropertyChanged('value', undefined, this.state.value);
				if (this.props.AwaitProps) {
					this.setState({ disabled: false });
				}
			});
		}
	}

	componentDidUpdate(prevProps: Readonly<IFormProps>, prevState: Readonly<IFormState>, snapshot?: any): void {
		if (this.props.Value !== undefined && this.props.Value !== null && JSON.stringify(this.props.Value) !== JSON.stringify(prevProps.Value)) {
			console.log("Updated value from props", this.props.Value);
			this.setState({ value: this.props.Value }, () => {
				this.props.onPropertyChanged('value', undefined, this.state.value);
				if (this.props.AwaitProps) {
					this.setState({ disabled: false });
				}
			});
		}
	}

	shouldComponentUpdate(nextProps: Readonly<IFormProps>, nextState: Readonly<IFormState>, nextContext: any): boolean {
		return JSON.stringify(this.props.Value) !== JSON.stringify(nextProps.Value) || JSON.stringify(this.state) !== JSON.stringify(nextState);
	}

	fieldChanged(field: string, value: any) {
		console.log("Field changed", field, value, this.state.value[field]);
		this.setState((prevState) => {
			let newValue = { ...prevState.value };

			if (this.props.Lazy && this.changeTimer !== null) {
				clearTimeout(this.changeTimer);
				this.changeTimer = null;
			}

			// Split the field path using regex to handle both dot notation and array notation
			const pathParts = field.split(/\.|\[|\]/).filter(Boolean);

			console.log("Path parts", pathParts);

			let current = {...newValue};
			console.log("-> current", JSON.stringify(current));
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
console.log("-> current", JSON.stringify(current));
				console.log("Current part", part, "Next part", nextPart, "Is next part array index?", isNextPartArrayIndex);
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

			console.log("-> current", JSON.stringify(current));

			console.log("Updated value", JSON.stringify(prevState.value), JSON.stringify(current));
			this.props.onPropertyChanged('value', undefined, current);
			if (JSON.stringify(prevState.value) === JSON.stringify(current)) {
				return { value: current };
			}

			if (this.state.disabled) {
				return { value: current };
			}



			if (this.props.Lazy) {
				this.changeTimer = setTimeout(() => {
					if (this.props.OnChange) {
						this.props.OnChange(current);
					}
				}, 750);
			}
			else {
				if (this.props.OnChange) {
					this.props.OnChange(current);
				}
			}

			return { value: current };
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