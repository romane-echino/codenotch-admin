import React from 'react';
import './ImageInput.scss';
import { AbstractInput, IInputProps } from '../AbstractInput/AbstractInput';
import { Action, IBindableComponentProps, IProjectInfoProps } from '@echino/echino.ui.sdk';
import { Markdown } from '../Markdown/Markdown';

interface IImageInputProps extends IInputProps, IProjectInfoProps, IBindableComponentProps {
	OnUploaded?: Action<{ url: string; name: string }>;
	OnChange?: Action<string>;
}


export const ImageInput: React.FC<IImageInputProps> = (props) => {

	const Icon = props.Icon || 'far fa-upload';
	const [focused, setFocused] = React.useState(false);
	const [fileName, setFileName] = React.useState<string | undefined>(props.Value as string);
	const [isUploading, setIsUploading] = React.useState(false);
	const refFileInput = React.useRef<HTMLInputElement | null>(null);

	const Endpoint = props._projectInfo.clusterUrl + '/portal/api/upload-image';

	const onDrop = async (e: React.DragEvent<HTMLInputElement>) => {
		e.preventDefault();
		e.stopPropagation();
		onDragLeave(e);

		if (props.Disabled !== true && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
			await uploadFile(e.dataTransfer.files[0]);
		}
	}
	const onDragEnter = (e: React.DragEvent<HTMLInputElement>) => {
		e.preventDefault();
		setFocused(true);
	}
	const onDragLeave = (e: React.DragEvent<HTMLInputElement>) => {
		e.preventDefault();
		setFocused(false);
	}

	const onInputFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files === null || e.target.files.length === 0)
			return;

		let file = e.target.files[0];
		await uploadFile(file);
	}


	const uploadFile = async (file: File) => {
		setIsUploading(true);
		try {
			if (Endpoint === undefined || `${Endpoint}`.trim() === '') {
				throw new Error('Upload enpoint is missing.');
			}

			let data = new FormData()
			data.append('file', file);

			let response = await fetch(Endpoint, {
				method: 'POST',
				body: data,
				headers: {
					"Content-Type": "application/octet-stream"
				}
			});

			if (response.ok === false) {
				throw new Error(`${response.status} ${await response.text()}`);
			}

			let jobject = await response.json();
			setIsUploading(false);
			props.OnUploaded?.({ url: jobject.DownloadUrl, name: file.name });
			props.OnChange?.(jobject.DownloadUrl);
			props.onPropertyChanged('value', undefined, jobject.DownloadUrl);

		}
		catch (e) {
			setIsUploading(false);
			console.error("upload", e);
		}
		finally {
			setFileName(file.name);
		}
	}


	const getChild = () => {
		if (isUploading) {
			return (
				<div className='absolute inset-y-0 right-0 w-10 flex items-center justify-center'>
					<i className="fa-solid fa-spinner fa-spin text-primary"></i>
				</div>
			)
		}
		else if (fileName) {
			return (
				<div className='absolute inset-y-0 right-0 w-10 flex items-center justify-center'>
					<i className="fa-solid fa-check text-success-500"></i>
				</div>
			)
		}
		else {
			return (
				<div className="flex max-w-[260px] flex-col items-center gap-4">
					<div className={`inline-flex h-13 w-13 items-center justify-center rounded-full border transition-all 
						${focused ? 'text-primary border-primary -translate-y-2' : 'border-gray-200 dark:border-gray-800 text-gray-700  dark:text-gray-400'}`}>

						<i className={`${Icon} text-xl`}></i>
					</div>
					<p className="text-center text-sm text-gray-500 dark:text-gray-400">
						<Markdown Type='Normal'>{props.Helper}</Markdown>
					</p>
				</div>
			)
		}
	}


	return (
		<AbstractInput Dashed={true} Focus={focused} {...props} Prefix={undefined} Suffix={undefined} Helper={undefined} Icon={undefined} Placeholder={undefined}>
			<input style={{ display: 'none' }} accept={'image/*'} onChange={(e) => onInputFileChange(e)} ref={refFileInput} type="file" />

			<div className="grow flex justify-center p-10 cursor-pointer min-h-40"
				onClick={() => refFileInput.current?.click()}
				onDrop={onDrop.bind(this)}
				onDragEnter={onDragEnter.bind(this)}
				onDragLeave={onDragLeave.bind(this)}
				onDragOver={(e) => e.preventDefault()}
			>
				{getChild()}
			</div>
		</AbstractInput>


	)
}