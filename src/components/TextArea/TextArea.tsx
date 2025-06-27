import React from 'react';
import './TextArea.scss';
import { AbstractInput, IInputProps } from '../AbstractInput/AbstractInput';
import { IBindableComponentProps } from '@echino/echino.ui.sdk';
import { IPageInheritedProps } from '../Page/Page';

interface ITextAreaProps extends IInputProps, IBindableComponentProps, IPageInheritedProps {
}

interface ITextAreaState {
	focused: boolean;
}


export class TextArea extends React.Component<ITextAreaProps, ITextAreaState> {

	constructor(props: ITextAreaProps) {
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
				<textarea
					placeholder={this.props.Placeholder}
					defaultValue={this.props.Value}
					disabled={this.props.Disabled}
					onChange={(e) => this.updateValue(e.target.value)}
					className={`${this.props.Icon ? 'pl-9':''} -mb-1.5 px-4 py-2.5 w-full focus:border-0 focus:outline-hidden placeholder:text-gray-400 dark:placeholder:text-white/30`}
					onBlur={(e) => this.setState({ focused: false })}
					onFocus={(e) => this.setState({ focused: true })} />
			</AbstractInput>
		)
	}

}