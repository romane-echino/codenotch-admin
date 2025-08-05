import React from 'react';
import './Schedule.scss';

interface IScheduleProps {
}

interface IScheduleState {
}

export class Schedule extends React.Component<IScheduleProps, IScheduleState> {

	constructor(props: IScheduleProps) {
		super(props);

		this.state = {
		}
	}

	render() {
		return (
			<div className="schedule">Schedule</div>
		)
	}

}