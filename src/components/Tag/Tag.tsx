import React, { useEffect } from 'react';
import { ColorPalette, getBackgroundColorFromName, getConstrastColorFromName, getTextColorFromName } from '../../utils/DefaultColorPalette';

interface ITagProps {
	Label: string;
	Icon?: string;
	Color?: ColorPalette;

	IconPlacement?: 'Left' | 'Right';
	Light?: boolean;
}

export const Tag = (props: ITagProps) => {

	const { Label, Icon, Color, IconPlacement = 'Left', Light = false } = props;

	useEffect(() => {

	}, [props]);


	if (!Label && !Icon) {
		return null;
	}

	return (
		<span className={`inline-flex items-center justify-center gap-1 rounded-full py-0.5 pl-2 
			pr-2.5 text-sm font-medium
			${Color ? (Light ? getTextColorFromName(Color) : getConstrastColorFromName(Color)) : 'text-gray-500'}
			${Color ? getBackgroundColorFromName(Color) + (Light ? '/15' : '') : 'bg-gray-200'}`}>

			{Icon && IconPlacement === 'Left' &&
				<i className={`${Icon} text-xs`} />
			}

			{Label}

			{Icon && IconPlacement === 'Right' &&
				<i className={`${Icon} text-xs`} />
			}
		</span>
	)
}