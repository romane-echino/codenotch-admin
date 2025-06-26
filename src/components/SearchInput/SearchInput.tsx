import React from 'react';
import { AbstractInput, IAbstractInputProps } from '../AbstractInput/AbstractInput';

interface ISearchInputProps extends IAbstractInputProps {
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
			<AbstractInput {...this.props}>
				SearchInput
			</AbstractInput>
		)
	}

}