import React from 'react';
import { Box, BoxTitle, IBoxProps } from '../Box/Box';
import { IPageInheritedProps } from '../Page/Page';
import { Action, IBindableComponentProps, IChildrenInheritedProps } from '@echino/echino.ui.sdk';
import { IAbstractListAction } from '../AbstractInput/AbstractInput';

interface IFormProps extends IBoxProps, IPageInheritedProps, IBindableComponentProps, IChildrenInheritedProps<{ Field: string }> {
	HasLayout?: boolean;
	OnChange?: Action<any>;
	_internalOnChange?: (value: any) => void;
	SortField?: string;
}

interface IFormState {
	value: any[];
	disabled?: boolean;
	childTemplates: React.ReactNode[];
	childrenInstances: React.ReactNode[][];

	isObject?: boolean;
}

export class FormAddList extends React.Component<IFormProps, IFormState> {

	static defaultProps = {
		HasLayout: true,
		childrenProps: [],
	};

	constructor(props: IFormProps) {
		super(props);

		this.state = {
			value: [],
			childTemplates: [],
			childrenInstances: [],
			isObject: true
		};

		this.props.declareFunction('disable', (value: boolean) => {
			this.setState({ disabled: value });
		});
	}

	componentDidMount(): void {
		// Capture les enfants comme templates
		const templates = React.Children.toArray(this.props.children);

		this.setState({
			childTemplates: templates,
			isObject: this.props.SortField !== undefined || templates.length > 1
		}, () => {
			// Ajoute automatiquement une première instance
			this.addInstance();
		});
	}


	// Ajouter une nouvelle instance des templates
	addInstance = () => {
		const { childTemplates, childrenInstances } = this.state;
		const instanceIndex = childrenInstances.length;

		// Clone chaque template avec des props mises à jour
		const newInstance = childTemplates.map((child, templateIndex) => {
			if (!React.isValidElement(child)) return child;

			// Récupérer les props spécifiques pour cet enfant
			//@ts-ignore
			let effectiveProps: any = { ...child.props };
			let field: string | undefined = this.props.childrenProps[templateIndex]?.Field;
			effectiveProps.children.props = {
				...this.props.childrenProps[templateIndex],
				...effectiveProps?.children?.props,
				_internalOnChange: field ? (value: any) => this.fieldChanged(field, value, instanceIndex) : undefined
			}

			return React.cloneElement(child, effectiveProps);
		});

		this.setState(prevState => ({
			childrenInstances: [...prevState.childrenInstances, newInstance],
			value: [...prevState.value, this.props.SortField ? {
				[this.props.SortField]: prevState.value.length
			} : undefined] // Ajouter un objet vide pour la nouvelle instance
		}), () => {
			this.props.onPropertyChanged('value', undefined, this.state.value);
			this.props._internalOnChange?.(this.state.value);
			this.props.OnChange?.(this.state.value);
		});
	};

	// Supprimer une instance spécifique
	removeInstance = (instanceIndex: number) => {
		this.setState(prevState => {
			const newInstances = [...prevState.childrenInstances];
			newInstances.splice(instanceIndex, 1);

			// Recalculer la valeur complète sans cette instance
			// Cette partie nécessiterait une logique plus complexe pour mettre à jour this.state.value

			return { childrenInstances: newInstances };
		});
	};

	fieldChanged(field: string, value: any, index: number) {

		if (!this.state.isObject) {
			this.setState({ value: [...this.state.value.slice(0, index), value, ...this.state.value.slice(index + 1)] }, () => {
				this.props.onPropertyChanged('value', undefined, this.state.value);
				if (this.props.OnChange) {
					this.props.OnChange(this.state.value);
				}
			});
			return;
		}

		let newValue = this.state.isObject ? { ...this.state.value[index] } : this.state.value[index];

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

		this.setState({ value: [...this.state.value.slice(0, index), newValue, ...this.state.value.slice(index + 1)] }, () => {
			this.props.onPropertyChanged('value', undefined, this.state.value);
			this.props._internalOnChange?.(this.state.value);
			this.props.OnChange?.(this.state.value);
		});


	}

	render() {
		const { childrenInstances } = this.state;

		let classAttributes = `w-full col-span-12 grid grid-cols-12 gap-4 md:gap-6 @container 
        ${this.state.disabled ? 'pointer-events-none opacity-50' : ''}`;

		const addButton = (
			<button
				onClick={this.addInstance}
				className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
			>
				<i className="fas fa-plus mr-2"></i>
				Ajouter
			</button>
		);

		let Component: any = this.props.HasLayout ? Box : 'div';
		let customProps = {};

		let actions = (
			<>
				{this.props.Actions}

				{addButton}
			</>
		);
		if (this.props.HasLayout) {
			customProps = {
				...this.props,
				Actions: actions,
			};
		} else {
			customProps = {
				className: 'w-full col-span-12',
			};
		}

		return (
			<Component {...customProps}>
				{!this.props.HasLayout &&
					<BoxTitle {...this.props} Actions={actions} />
				}

				<div className='@container divide-y divide-gray-200 dark:divide-gray-700 border-l border-gray-200 dark:border-gray-700'>
					{childrenInstances.map((instanceChildren, instanceIndex) => (
						<div className='flex items-center gap-4 py-4' key={`instance-${instanceIndex}`}>
							{this.props.SortField &&
								<div className='h-11 w-6 flex ml-2 items-center justify-center text-gray-800 dark:text-white/90'>
									<i className="fa-solid fa-grip-dots"></i>
								</div>
							}

							<div className={`grow ${classAttributes} ${this.props.SortField ? '' : 'ml-4'}`}>
								{instanceChildren}
							</div>

							<div className='h-11 w-6 flex items-center justify-center mr-2'>
								<div
									onClick={() => this.removeInstance(instanceIndex)}
									className=' bg-alizarin rounded-md px-2 py-1 text-white flex items-center text-sm justify-center cursor-pointer'>
									<i className="fa-regular fa-trash"></i>
								</div>
							</div>
						</div>
					))}
				</div>

			</Component>
		);


	}
}