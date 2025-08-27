import React from 'react';
import './TabItem.scss';
import { BoxTitle, HasTitle, IBoxProps } from '../Box/Box';
import { Sizing } from '../Sizing/Sizing';

interface ITabItemProps extends IBoxProps {

}

interface ITabItemState {
}

export class TabItem extends React.Component<ITabItemProps, ITabItemState> {

	constructor(props: ITabItemProps) {
		super(props);

		this.state = {
		}
	}

	render() {
		return (
			<>
				<Sizing>
					<BoxTitle {...this.props} DisableMargins={true} />
				</Sizing>

				{this.props.children}
			</>
		)
	}

}