import React from 'react';
import './DateRangeInput.scss';

interface IDateRangeInputProps {
}

interface IDateRangeInputState {
}

export class DateRangeInput extends React.Component<IDateRangeInputProps, IDateRangeInputState> {

	constructor(props: IDateRangeInputProps) {
		super(props);

		this.state = {
		}
	}

	render() {
		return (
			<div className="date-range-input">DateRangeInput</div>
		)
	}

}