import React from 'react';
import './Rule.scss';

interface IRuleProps {
}

interface IRuleState {
}

export class Rule extends React.Component<IRuleProps, IRuleState> {

	constructor(props: IRuleProps) {
		super(props);

		this.state = {
		}
	}

	render() {
		return (
			<hr className='my-2 border-b border-gray-100 dark:border-gray-800 col-span-12' />
		)
	}

}