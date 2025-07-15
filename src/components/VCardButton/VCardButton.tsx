import React from 'react';
import './VCardButton.scss';
import { Button, IButtonProps } from '../Button/Button';

interface IVCardButtonProps extends IButtonProps {
	Firstname?: string;
	Lastname?: string;
	Email?: string;
	Phone?: string;
	Organization?: string;
	JobTitle?: string;
}


export const VCardButton: React.FC<IVCardButtonProps> = (props) => {

	const generateVCard = () => {
		const vCard = [
			'BEGIN:VCARD',
			'VERSION:3.0',
			`FN:${props.Firstname} ${props.Lastname}`,
			`N:${props.Lastname};${props.Firstname};;;`,
			props.Email?`EMAIL:${props.Email}`:'',
			props.Phone?`TEL:${props.Phone}`:'',
			props.Organization?`ORG:${props.Organization}`:'',
			props.JobTitle?`TITLE:${props.JobTitle}`:'',
			'END:VCARD'
		].join('\n');

		const blob = new Blob([vCard], { type: "text/vcard" });
		const url = URL.createObjectURL(blob);

		const a = document.createElement("a");
		a.href = url;
		a.download = "jean-dupont.vcf";
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}

	return (
		<Button {...props} OnClick={() => generateVCard()}/>
	)
}
