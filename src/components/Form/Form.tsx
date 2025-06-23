import React from 'react';
import './Form.scss';

interface IFormProps {
}

interface IFormState {
}

export class Form extends React.Component<IFormProps, IFormState> {

	constructor(props: IFormProps) {
		super(props);

		this.state = {
		}
	}

	render() {
		return (
			<div className="form">Form</div>
		)
	}

}