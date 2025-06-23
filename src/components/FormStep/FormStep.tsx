import React from 'react';
import './FormStep.scss';

interface IFormStepProps {
}

interface IFormStepState {
}

export class FormStep extends React.Component<IFormStepProps, IFormStepState> {

	constructor(props: IFormStepProps) {
		super(props);

		this.state = {
		}
	}

	render() {
		return (
			<div className="form-step">FormStep</div>
		)
	}

}