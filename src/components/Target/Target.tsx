import React from 'react';
import './Target.scss';

interface ITargetProps {
}

interface ITargetState {
}

export class Target extends React.Component<ITargetProps, ITargetState> {

	constructor(props: ITargetProps) {
		super(props);

		this.state = {
		}
	}

	render() {
		return (
			<div className="target">Target</div>
		)
	}

}