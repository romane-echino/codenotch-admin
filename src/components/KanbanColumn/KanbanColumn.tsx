import React from 'react';
import './KanbanColumn.scss';

interface IKanbanColumnProps  {
}

interface IKanbanColumnState {
}

export class KanbanColumn extends React.Component<IKanbanColumnProps, IKanbanColumnState> {

	constructor(props: IKanbanColumnProps) {
		super(props);

		this.state = {
		}
	}

	render() {
		return (
			<div className="kanban-column">KanbanColumn</div>
		)
	}

}