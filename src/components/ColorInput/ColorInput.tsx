import React from 'react';
import './ColorInput.scss';
import { AbstractInput, IInputProps } from '../AbstractInput/AbstractInput';
import { IBindableComponentProps } from '@echino/echino.ui.sdk';
import { IPageInheritedProps } from '../Page/Page';
import { Menu } from '@headlessui/react';
import { DefaultColorPalette, DefaultColorPaletteNames, getNameFromHex } from '../../utils/DefaultColorPalette';
import { Button } from '../Button/Button';

interface IColorInputProps extends IInputProps, IBindableComponentProps, IPageInheritedProps {
}


export const ColorInput: React.FC<IColorInputProps> = (props) => {

	const inputRef = React.useRef<HTMLInputElement>(null);
	const [focused, setFocused] = React.useState(false);

	const [color, setColor] = React.useState<{
		value: string;
		name: string;
	} | null>(null);

	React.useEffect(() => {
		if (props.Value !== undefined && props.Value !== null && props.Value !== '') {
			setColor({ value: props.Value as string, name: getNameFromHex(props.Value as string) });
		}
	}, [props.Value]);

	const updateValue = (value: string, name: string) => {
		setColor({ value, name });
		props.onPropertyChanged('Value', undefined, value)
		props.OnChange?.(value);
		props._internalOnChange?.(value);
	}

	return (
		<AbstractInput Focus={focused} {...props}>
			<Menu as={React.Fragment}>
				<Menu.Button
					className={`${props.Icon ? 'pl-9' : ''} text-left relative grow  px-4 py-2.5 focus:border-0 focus:outline-hidden`}
					onBlur={() => setFocused(false)}
					onFocus={() => setFocused(true)}
				>

					{color !== null ?
						<div className="flex items-center gap-2">
							<div className="size-4" style={{ backgroundColor: color?.value }}>&nbsp;</div>
							{color?.name}
						</div>
						:
						<span className='opacity-50'>{props.Placeholder ?? 'Select a color...'}</span>
					}


					<div className='absolute inset-y-0 right-0 flex items-center pr-2'>
						<i className="h-5 w-5 text-gray-400 fa-solid fa-angles-up-down"></i>
					</div>
				</Menu.Button>

				<Menu.Items
					className='popover inset-x-0 top-full p-2'>

					<div className='flex flex-wrap gap-2 mb-2'>
						{DefaultColorPalette.map((o, i) => (
							<Menu.Item key={i} as={'div'} className="p-2 text-gray-600 dark:text-white/80 dark:text-gr flex items-center gap-2 cursor-pointer hover:bg-primary hover:text-white rounded-lg"
								onClick={() => {
									updateValue(o, DefaultColorPaletteNames[i]);
								}}>
								<div className="size-4" style={{ backgroundColor: o }}>&nbsp;</div> {DefaultColorPaletteNames[i]}
							</Menu.Item>
						))}
					</div>


					<Button Label='Autre couleur' Type='Secondary' OnClick={() => inputRef.current?.click()} />
					<input
						style={{ height: '0', width: '0', opacity: 0, position: 'absolute' }}
						ref={inputRef}
						type="color" onChange={(e) => {
							const value = e.target.value;
							updateValue(value, 'Custom Color');
						}} />
				</Menu.Items>
			</Menu>
		</AbstractInput>
	)
}