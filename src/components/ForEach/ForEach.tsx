import React from 'react';
import { ComponentDescription } from '@echino/echino.ui.sdk'
import _ from 'lodash';

export interface IForEachProps {
	In: any;
	As?: string;
	IndexAs?: string;
	KeyAs?: string;
}

export class ForEach {

	public static prerender(childDescriptions: ComponentDescription[], props: IForEachProps): ComponentDescription[] {

		if (!props.In || !childDescriptions || childDescriptions.length === 0) {
			return [];
		}

		let inNumber = NaN;
		try {
			inNumber = parseInt(props.In);
		}
		catch (error) { }

		let children: ComponentDescription[] = [];

		// Determine what kind of input data we have
		if (Array.isArray(props.In)) {

			// create an instance of the child for each element in 'in
			children = props.In.flatMap((e, index) =>
				ForEach.createChildren(props, childDescriptions, index, index, e)
			);

		}
		else if (!Number.isNaN(inNumber)) {

			// A number as 'in' means we have to duplicate the child n times
			for (let index = 0; index < inNumber; index++) {

				let subChildren = ForEach.createChildren(props, childDescriptions, index, index, {});
				children = children.concat(subChildren); // No data, only the index

			}
		}
		else {

			let keys: string[] = [];
			try {
				keys = Object.keys(props.In);

				if (keys.length > 0) {

					for (let index = 0; index < keys.length; index++) {

						let key = keys[index];

						let childObject = props.In[key];

						let subChildren = ForEach.createChildren(props, childDescriptions, index, key, childObject);
						children = children.concat(subChildren);
					}

				}
			}
			catch (error) {

				console.error(error);
			}
		}

		return children;
	}

	public static createChildren(props: IForEachProps, childDescriptions: ComponentDescription[], index: any, key: any, elementData: any): ComponentDescription[] {
		var children:any[] = [];

		for (var childDescription of childDescriptions) {
			var child = ForEach.createChild(props, childDescription, index, key, elementData);
			children.push(child);
		}

		return children;
	}

	private static createChild(props: IForEachProps, childDescription: ComponentDescription, index: any, key: any, elementData: any): ComponentDescription {
		
		let child = _.cloneDeep<ComponentDescription>(childDescription);

		// We have to make a clone so we won't modify the original
		child.storedData = JSON.parse(JSON.stringify(childDescription.storedData));

		// If the 'As' props has been defined, 
		if (props.As && props.As !== "") {
			// Add element's data
			child.storedData[props.As] = elementData;
		}

		// If the 'IndexAs' props has been defined, add the index
		if (props.IndexAs && props.IndexAs !== "") {
			child.storedData[props.IndexAs] = index;
		}

		// If the 'KeyAs' props has been defined, add the key
		if (props.KeyAs && props.KeyAs !== "") {
			child.storedData[props.KeyAs] = key;
		}

		// If neither As nor IndexAs is present, there is no additional data for the element

		return child;
	}
}