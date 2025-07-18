import React from 'react';
import './ToggleButton.scss';

interface IToggleButtonProps {

	Label?: string;
	Description?: string;
	Icon?: string;
}

interface IToggleButtonState {
}

export class ToggleButton extends React.Component<IToggleButtonProps, IToggleButtonState> {

	constructor(props: IToggleButtonProps) {
		super(props);

		this.state = {
		}
	}

	render() {
		return (
			<label className="flex cursor-pointer items-center gap-3 select-none">
				<div className="relative">
					<input type="checkbox" id="toggle2" className="sr-only" />
					<div className="block h-6 w-11 rounded-full bg-primary-500 dark:bg-primary-500" ></div>
					<div className="shadow-theme-sm absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white duration-300 ease-linear translate-x-full"></div>
				</div>

				<div className='text-sm font-medium text-gray-700  dark:text-gray-400'>
					{this.props.Label}
					{this.props.Description &&
						<p className='text-xs text-gray-500 dark:text-gray-400'>
							{this.props.Description}
						</p>
					}
				</div>
			</label>
		)
	}

}