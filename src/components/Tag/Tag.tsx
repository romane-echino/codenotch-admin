import React from 'react';
import './Tag.scss';
import { ColorPalette, getBackgroundColorFromName, getConstrastColorFromName } from '../../utils/DefaultColorPalette';

interface ITagProps {
	Label: string;
	Icon?: string;
	Color?: ColorPalette;
}

interface ITagState {
}

export class Tag extends React.Component<ITagProps, ITagState> {

	constructor(props: ITagProps) {
		super(props);

		this.state = {
		}
	}

	render() {
		if (!this.props.Label && !this.props.Icon) {
			return null;
		}
		
		return (
			<span className={`inline-flex items-center justify-center gap-1 rounded-full py-0.5 pl-2 
			pr-2.5 text-sm font-medium
			${this.props.Color ? getConstrastColorFromName(this.props.Color) : 'text-gray-500'}
			${this.props.Color ? getBackgroundColorFromName(this.props.Color) : 'bg-gray-200'}`}>

				{this.props.Icon &&
					<i className={`${this.props.Icon} text-xs`} />
				}

				{this.props.Label}
			</span>
		)
	}

}