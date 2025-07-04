import React from 'react';
import './TextInput.scss';
import { Action, IBindableComponentProps } from '@echino/echino.ui.sdk';
import { Sizing } from '../Sizing/Sizing';
import { IPageInheritedProps } from '../Page/Page';
import { AbstractInput, IInputProps } from '../AbstractInput/AbstractInput';

interface ITextInputProps extends IInputProps, IBindableComponentProps, IPageInheritedProps {

}

interface ITextInputState {
	focused: boolean;
}

export class TextInput extends React.Component<ITextInputProps, ITextInputState> {

	inputRef: React.RefObject<HTMLInputElement> = React.createRef();

	constructor(props: ITextInputProps) {
		super(props);

		this.state = {
			focused: false,
		}
	}

	updateValue(value: string) {
		this.props.onPropertyChanged('Value', undefined, value)
		if (this.props.OnChange) {
			this.props.OnChange(value);
		}
	}

	render() {

		return (
			<AbstractInput Focus={this.state.focused} {...this.props}>
				<input type="text"
					ref={this.inputRef}
					placeholder={this.props.Placeholder}
					defaultValue={this.props.Value}
					disabled={this.props.Disabled}
					onChange={(e) => this.updateValue(e.target.value)}
					className={`${this.props.Icon && 'pl-9'} px-4 py-2.5 w-full focus:border-0 focus:outline-hidden placeholder:text-gray-400 dark:placeholder:text-white/30`}
					onBlur={(e) => this.setState({ focused: false })}
					onFocus={(e) => this.setState({ focused: true })} />
			</AbstractInput>
		)
	}
}