import React from 'react';
import './Calendar.scss';

interface ICalendarProps {
}

interface ICalendarState {
}

export class Calendar extends React.Component<ICalendarProps, ICalendarState> {

	constructor(props: ICalendarProps) {
		super(props);

		this.state = {
		}
	}

	render() {
		return (
			<div className="calendar">Calendar</div>
		)
	}

}