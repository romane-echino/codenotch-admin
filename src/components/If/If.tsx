import { ComponentDescription } from '@echino/echino.ui.sdk';

export interface IIfProps {
	Condition: boolean,
	Then: ComponentDescription[],
	Else: ComponentDescription[]
}

export class If {

	public static prerender(childDescriptions: ComponentDescription[], props: IIfProps): ComponentDescription[]
	{
		// If the component has children, we are in the case where we ignore props
		if(childDescriptions && childDescriptions.length > 0)
		{
			if(props.Condition)
			{
				return childDescriptions;
			}
			else
			{
				return [];
			}
		}
		else
		{
			// Otherwise, we use 'Then' and 'Else' props content 

			if(props.Condition)
			{
				//render the 'Then' part
				return props.Then;
			}
			else
			{
				//render the 'Else' part
				return props.Else;
			}
		}
	}

	
}