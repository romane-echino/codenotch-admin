import React from 'react';
import './SearchInput.scss';

interface ISearchInputProps {
}

interface ISearchInputState {
}

export class SearchInput extends React.Component<ISearchInputProps, ISearchInputState> {

	constructor(props: ISearchInputProps) {
		super(props);

		this.state = {
		}
	}

	render() {
		return (
			<div className="searchinput">SearchInput</div>
		)
	}

}