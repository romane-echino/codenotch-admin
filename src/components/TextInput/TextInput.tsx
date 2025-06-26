import React from 'react';
import './TextInput.scss';
import { Action, IBindableComponentProps } from '@echino/echino.ui.sdk';
import { Sizing } from '../Sizing/Sizing';
import { IPageInheritedProps } from '../Page/Page';
import { AbstractInput, IInputProps } from '../AbstractInput/AbstractInput';

interface ITextInputProps extends IInputProps, IBindableComponentProps, IPageInheritedProps {

}

interface ITextInputState {
	focused: boolean;
}

export class TextInput extends React.Component<ITextInputProps, ITextInputState> {

	inputRef: React.RefObject<HTMLInputElement> = React.createRef();

	constructor(props: ITextInputProps) {
		super(props);

		this.state = {
			focused: false,
		}
	}

	updateValue(value: string) {
		this.props.onPropertyChanged('Value', undefined, value)
		if (this.props.OnChange) {
			this.props.OnChange(value);
		}
	}

	render() {

		return (
			<AbstractInput Focus={this.state.focused} {...this.props}>
				<input type="text"
					ref={this.inputRef}
					placeholder={this.props.Placeholder}
					defaultValue={this.props.Value}
					disabled={this.props.Disabled}
					onChange={(e) => this.updateValue(e.target.value)}
					className={`${this.props.Icon && 'pl-9'} px-4 py-2.5 w-full focus:border-0 focus:outline-hidden placeholder:text-gray-400 dark:placeholder:text-white/30`}
					onBlur={(e) => this.setState({ focused: false })}
					onFocus={(e) => this.setState({ focused: true })} />
			</AbstractInput>
		)
		return (
			<Sizing {...this.props} Containered={true}>
				{this.props.Title &&
					<label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
						{this.props.Title}
					</label>
				}

				<div onClick={() => this.inputRef.current?.focus()} className={` cursor-text flex dark:bg-dark-900 h-11 w-full rounded-lg border  bg-transparent  text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 
					${this.state.focused && !this.props.Disabled ? 'border-primary-300 dark:border-primary-800 ring-primary-500/10 ring-3' : 'border-gray-300'}`}>

					{this.props.Prefix &&
						<span className="pointer-events-none flex items-center justify-center border-r border-gray-200 py-3 pr-3 pl-3.5  dark:border-gray-800">
							{this.props.Prefix}
						</span>
					}

					<div className='relative grow'>
						{this.props.Icon &&
							<span className="absolute pointer-events-none left-3 top-1/2 -translate-y-1/2">
								<i className={`${this.props.Icon} text-gray-500 dark:text-gray-400`}></i>
							</span>
						}
						<input type="text"
							ref={this.inputRef}
							placeholder={this.props.Placeholder}
							defaultValue={this.props.Value}
							disabled={this.props.Disabled}
							onChange={(e) => this.updateValue(e.target.value)}
							className={`${this.props.Icon && 'pl-9'} px-4 py-2.5 w-full focus:border-0 focus:outline-hidden placeholder:text-gray-400 dark:placeholder:text-white/30`}
							onBlur={(e) => this.setState({ focused: false })}
							onFocus={(e) => this.setState({ focused: true })} />
					</div>

					{this.props.Suffix &&
						<span className="pointer-events-none flex items-center justify-center border-l border-gray-200 py-3 pl-3 pr-3.5  dark:border-gray-800">
							{this.props.Suffix}
						</span>
					}
				</div>

			</Sizing>

		)
	}

}