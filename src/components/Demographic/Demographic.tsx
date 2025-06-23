import React from 'react';
import './Demographic.scss';

interface IDemographicProps {
}

interface IDemographicState {
}

export class Demographic extends React.Component<IDemographicProps, IDemographicState> {

	constructor(props: IDemographicProps) {
		super(props);

		this.state = {
		}
	}

	render() {
		return (
			<div className="demographic">Demographic</div>
		)
	}

}