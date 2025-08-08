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
			disabled: props.AwaitProps ? true : false
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

	setValueAtPath(obj: any, parts: (string | number)[], val: any): any {
		//console.log("Setting value at path", parts, "Value", val);
		// Cas de base: on a atteint la fin du chemin
		if (parts.length === 0) {
			return val;
		}

		const currentPart = parts[0];
		const remainingParts = parts.slice(1);

		//console.log("Setting value at path", currentPart, "Remaining parts", remainingParts, "Value", val);

		// Déterminer si l'objet actuel doit être un tableau ou un objet
		const isArrayIndex = typeof currentPart === 'number' ||(typeof currentPart === 'string' && !isNaN(Number(currentPart)));
		const nextIsArrayIndex = parts.length > 1 &&
			(typeof parts[1] === 'number' ||
				(typeof parts[1] === 'string' && !isNaN(Number(parts[1]))));

		// Créer un objet vide ou un tableau si nécessaire
		if (obj === undefined || obj === null) {
			obj = isArrayIndex ? [] : {};
		}

		// Clone l'objet ou le tableau pour éviter de modifier directement l'état précédent
		const clone = Array.isArray(obj) ? [...obj] : { ...obj };

		// Préparer le sous-objet pour la prochaine partie du chemin
		let nextObj = clone[currentPart];
		if (nextObj === undefined) {
			nextObj = nextIsArrayIndex ? [] : {};
		}

		// Définir la valeur récursivement
		clone[currentPart] = this.setValueAtPath(nextObj, remainingParts, val);

		return clone;
	}

	fieldChanged(field: string, value: any) {
		//console.log("Field changed", field, value, this.state.value[field]);
		this.setState((prevState) => {
			let result = { ...prevState.value };

			//console.log("Current value", JSON.stringify(result));

			if (this.props.Lazy && this.changeTimer !== null) {
				clearTimeout(this.changeTimer);
				this.changeTimer = null;
			}

			const pathParts = field.split(/\.|\[|\]/).filter(Boolean);

			//console.log("Path parts", pathParts);

			// Convertir les index numériques de string vers number
			const normalizedParts = pathParts.map(part => {
				const num = parseInt(part);
				return isNaN(num) ? part : num;
			});


			//console.log("Normalized parts", normalizedParts);


			result = this.setValueAtPath(result, normalizedParts, value);


			//console.log("-> current", JSON.stringify(result));

			//console.log("Updated value", JSON.stringify(prevState.value), JSON.stringify(result));
			this.props.onPropertyChanged('value', undefined, result);
			if (JSON.stringify(prevState.value) === JSON.stringify(result) || this.state.disabled) {
				return { value: result };
			}


			if (this.props.Lazy) {
				this.changeTimer = setTimeout(() => {
					if (this.props.OnChange) {
						this.props.OnChange(result);
					}
				}, 750);
			}
			else {
				if (this.props.OnChange) {
					this.props.OnChange(result);
				}
			}

			return { value: result };
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