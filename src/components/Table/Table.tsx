import React from 'react';
import './Table.scss';

interface ITableProps {
}

interface ITableState {
}

export class Table extends React.Component<ITableProps, ITableState> {

	constructor(props: ITableProps) {
		super(props);

		this.state = {
		}
	}

	render() {
		return (
			<div className="table">Table</div>
		)
	}

}