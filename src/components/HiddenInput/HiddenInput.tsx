import React from 'react';
import './HiddenInput.scss';
import { Action, IBindableComponentProps } from '@echino/echino.ui.sdk';

interface IHiddenInputProps extends IBindableComponentProps {
	Value: any;
	OnChange?: Action<any>;
}


export const HiddenInput: React.FC<IHiddenInputProps> = (props) => {
	const [value, setValue] = React.useState();

	React.useEffect(() => {
		
		if (props.Value !== undefined && props.Value !== value) {
			console.log('UseEffect :: HiddenInput Value changed', props.Value, value);
			setValue(props.Value);
			props.onPropertyChanged('Value', undefined, props.Value)
			if (props.OnChange) {
				props.OnChange(props.Value);
			}
		}
	}, [props]);

	if (props.Value !== undefined &&props.Value !== value) {
		console.log('Render :: HiddenInput Value changed', props.Value, value);
		setValue(props.Value);
		props.onPropertyChanged('Value', undefined, props.Value)
		if (props.OnChange) {
			props.OnChange(props.Value);
		}
	}

	return <></>;
}