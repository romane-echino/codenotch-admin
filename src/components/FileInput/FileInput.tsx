import React from 'react';
import './FileInput.scss';
import { AbstractInput, IInputProps } from '../AbstractInput/AbstractInput';
import { Action, IBindableComponentProps, IProjectInfoProps } from '@echino/echino.ui.sdk';

interface IFileInputProps extends IInputProps, IProjectInfoProps, IBindableComponentProps {
	Accept?: string;
	OnUploaded?: Action<{ url: string; name: string }>;
	OnChange?: Action<string>;
}

export const FileInput: React.FC<IFileInputProps> = (props) => {
	const [focused, setFocused] = React.useState(false);
	const [fileName, setFileName] = React.useState<string | undefined>(props.Value as string);
	const [showDropZone, setShowDropZone] = React.useState(false);
	const [isUploading, setIsUploading] = React.useState(false);
	const refFileInput = React.useRef<HTMLInputElement | null>(null);


	const Endpoint = props._projectInfo.clusterUrl + '/portal/api/upload';
	const ContentTypeEndpoint = props._projectInfo.clusterUrl + '/portal/api/update-content-type';

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
			let contentTypeResponse = await fetch(ContentTypeEndpoint, {
				method: 'POST',
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					"filename": jobject.FileName,
					"contentType": file.type
				})
			});

			if (contentTypeResponse.ok === false) {
				throw new Error(`${contentTypeResponse.status} ${await contentTypeResponse.text()}`);
			}

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


	const prefix = (
		<div className='self-stretch flex items-center'>Choose a file</div>
	)

	return (
		<AbstractInput Focus={focused} {...props} Prefix={prefix}>
			<input style={{ display: 'none' }} accept={props.Accept} onChange={(e) => onInputFileChange(e)} ref={refFileInput} type="file" />

			<input
				onDrop={onDrop.bind(this)}
				disabled={props.Disabled}
				onBlur={() => setFocused(false)}
				onFocus={() => { setFocused(true) }}
				onClick={() => refFileInput.current?.click()}

				onDragEnter={onDragEnter.bind(this)}
				onDragLeave={onDragLeave.bind(this)}
				onDragOver={(e) => e.preventDefault()}
				readOnly={true}
				spellCheck={false}
				value={fileName}
				placeholder={props.Placeholder}
				className={`${props.Icon && 'pl-9'} cursor-pointer px-4 py-2.5 w-full focus:border-0 focus:outline-hidden placeholder:text-gray-400 dark:placeholder:text-white/30`}
				type="text" />


			{isUploading && (
				<div className='absolute inset-y-0 right-0 w-10 flex items-center justify-center'>
					<i className="fa-solid fa-spinner fa-spin text-primary"></i>
				</div>
			)}

			{showDropZone && (
				<div className='absolute rounded-md inset-0 text-white/50 gap-1 border-2 border-dashed flex items-center justify-center border-white/30 pointer-events-none'>
					<i className="fa-regular fa-file"></i>
					<span>Drop zone</span>
				</div>
			)}
		</AbstractInput>
	)
}