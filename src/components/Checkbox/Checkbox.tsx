import React, { useRef } from 'react';
import './Checkbox.scss';
import { Sizing } from '../Sizing/Sizing';
import { Action, IBindableComponentProps } from '@echino/echino.ui.sdk';
import { Helper } from '../AbstractInput/Helper';

interface ICheckboxProps extends IBindableComponentProps {
	Title: string;
	Subtitle?: string;
	Value?: boolean;
	Icon?: string;
	Disabled?: boolean;
	Helper?: string;
	OnChange?: Action<any>;
}

export const Checkbox: React.FC<ICheckboxProps> = (props) => {
	const [selected, setSelected] = React.useState<boolean>(props.Value || false);

	React.useEffect(() => {
		if (props.Value !== undefined && props.Value !== null) {
			updateValue(props.Value);
		}
	}, [props.Value]);

	const updateValue = (value: boolean) => {
		setSelected(value);
		props.onPropertyChanged('value', undefined, value)
		if (props.OnChange) {
			props.OnChange(value);
		}
	}

	return (
		<Sizing {...props}>
			<div onClick={() => updateValue(!selected)} className={`flex cursor-pointer items-center text-sm font-medium text-gray-700 select-none dark:text-gray-400 ${props.Disabled ? 'opacity-50 pointer-events-none' : ''}`}>

				<div className={`${selected ? 'border-primary bg-primary dark:bg-primary' : 'border-gray-300 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500'}
					 dark:bg-gray-900  mr-3 flex h-5 w-5 items-center justify-center rounded-md border `}>
					{selected &&
						<i className="fa-solid fa-check text-white"></i>
					}
				</div>

				{props.Icon &&
					<span className="mr-2">
						<i className={props.Icon}></i>
					</span>
				}

				<div className={`flex flex-col gap-1 pointer-events-none ${props.Helper ? 'mr-2' : ''}`}>
					<label className={`text-sm font-medium text-gray-700 select-none dark:text-gray-400`}>{props.Title}</label>
					{props.Subtitle && <p className="text-xs text-gray-500">{props.Subtitle}</p>}
				</div>

				{props.Helper &&
					<Helper>
						{props.Helper}
					</Helper>
				}
			</div>
		</Sizing>
	)
}