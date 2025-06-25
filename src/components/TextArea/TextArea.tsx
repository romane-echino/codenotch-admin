import React from 'react';
import './TextArea.scss';

interface ITextAreaProps {
}

interface ITextAreaState {
}

export class TextArea extends React.Component<ITextAreaProps, ITextAreaState> {

	constructor(props: ITextAreaProps) {
		super(props);

		this.state = {
		}
	}

	render() {
		return (
			<div className="text-area">TextArea</div>
		)
	}

}