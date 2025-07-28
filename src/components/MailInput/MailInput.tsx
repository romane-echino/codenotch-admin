import React from 'react';
import './MailInput.scss';

interface IMailInputProps {
}

interface IMailInputState {
}

export class MailInput extends React.Component<IMailInputProps, IMailInputState> {

	constructor(props: IMailInputProps) {
		super(props);

		this.state = {
		}
	}

	render() {
		return (
			<div className="mail-input">MailInput</div>
		)
	}

}