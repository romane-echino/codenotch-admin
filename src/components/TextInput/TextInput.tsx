import React from 'react';
import './TextInput.scss';

interface ITextInputProps {
}

interface ITextInputState {
}

export class TextInput extends React.Component<ITextInputProps, ITextInputState> {

	constructor(props: ITextInputProps) {
		super(props);

		this.state = {
		}
	}

	render() {
		return (
			<div className="text-input">TextInput</div>
		)
	}

}