import React from 'react';
import './Dropdown.scss';

interface IDropdownProps {
}

interface IDropdownState {
}

export class Dropdown extends React.Component<IDropdownProps, IDropdownState> {

	constructor(props: IDropdownProps) {
		super(props);

		this.state = {
		}
	}

	render() {
		return (
			<div className="dropdown">Dropdown</div>
		)
	}

}