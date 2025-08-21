import React from 'react';
import './HiddenInput.scss';
import { Action, IBindableComponentProps } from '@echino/echino.ui.sdk';

interface IHiddenInputProps extends IBindableComponentProps {
	Value: any;
	OnChange?: Action<any>;
	_internalOnChange?: (value: any) => void;
}


export const HiddenInput: React.FC<IHiddenInputProps> = (props) => {
	const [value, setValue] = React.useState();

	React.useEffect(() => {

		if (props.Value !== undefined && props.Value !== value) {
			//console.log('UseEffect :: HiddenInput Value changed', props.Value, value);
			setValue(props.Value);
			props.onPropertyChanged('Value', undefined, props.Value)
			props.OnChange?.(props.Value);
			props._internalOnChange?.(value);
		}
	}, [props]);

	if (props.Value !== undefined && props.Value !== value) {
		//console.log('Render :: HiddenInput Value changed', props.Value, value);
		setValue(props.Value);
		props.onPropertyChanged('Value', undefined, props.Value)
		props.OnChange?.(props.Value);
		props._internalOnChange?.(value);
	}

	return <></>;
}