import React from 'react';
import './DateInput.scss';

interface IDateInputProps {
}

interface IDateInputState {
}

export class DateInput extends React.Component<IDateInputProps, IDateInputState> {

	constructor(props: IDateInputProps) {
		super(props);

		this.state = {
		}
	}

	render() {
		return (
			<div className="date-input">DateInput</div>
		)
	}

}