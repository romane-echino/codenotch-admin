import React from 'react';
import './ImageInput.scss';
import { AbstractInput, IInputProps } from '../AbstractInput/AbstractInput';
import { Action, IBindableComponentProps, IProjectInfoProps } from '@echino/echino.ui.sdk';
import { Markdown } from '../Markdown/Markdown';

interface IImageInputProps extends IInputProps, IProjectInfoProps, IBindableComponentProps {
	OnChange?: Action<UploadedFile>;
}

export interface UploadedFile {
	url: string;
	name: string;
}

export const ImageInput: React.FC<IImageInputProps> = (props) => {

	const Icon = props.Icon || 'far fa-upload';
	const [focused, setFocused] = React.useState(false);
	//@ts-ignore
	const [file, setFile] = React.useState<UploadedFile | undefined>(props.Value ?? undefined);
	const [isUploading, setIsUploading] = React.useState(false);
	const refFileInput = React.useRef<HTMLInputElement | null>(null);

	const Endpoint = props._projectInfo.clusterUrl + '/portal/api/upload-image';
	const ContentTypeEndpoint = props._projectInfo.clusterUrl + '/portal/api/update-content-type';

	React.useEffect(() => {
		if (props.Value !== undefined && props.Value !== null && props.Value !== '') {

			let value: UploadedFile;
			if (typeof props.Value === 'string') {
				value = JSON.parse(props.Value);
			}
			else {
				//@ts-ignore
				value = props.Value as UploadedFile;
			}
			//@ts-ignore
			props.OnChange?.(value);
			props.onPropertyChanged('value', undefined, value);
			//@ts-ignore
			setFile(value);


			console.log('Value', props.Value)
		}
	}, [props.Value]);

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

			const reader = new FileReader();
			reader.onloadend = async () => {
				//data.append('file', new Blob([reader.result as ArrayBuffer], { type: file.type }), file.name);
				let response = await fetch(Endpoint, {
					method: 'POST',
					body: reader.result,
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

				if(contentTypeResponse.ok === false) {
					throw new Error(`${contentTypeResponse.status} ${await contentTypeResponse.text()}`);
				}
				
				setIsUploading(false);

				const result: UploadedFile = {
					url: jobject.DownloadUrl,
					name: file.name
				};
				props.OnChange?.(result);
				props.onPropertyChanged('value', undefined, result);
				setFile(result);
			};

			reader.onerror = (error) => {
				setIsUploading(false);
				console.error("File reading error", error);
			};
			reader.readAsArrayBuffer(file);


		}
		catch (e) {
			setIsUploading(false);
			console.error("upload", e);
		}
		finally {

		}
	}


	const getChild = () => {
		if (isUploading) {
			return (

				<i className="fa-solid fa-spinner fa-spin text-primary"></i>
			)
		}
		else if (file) {
			return (
				<div className='absolute inset-1'>
					<img className='w-full h-full object-cover rounded-lg' src={file.url} alt={file.name} />
					<div className='absolute bottom-0 right-0 bg-black/30 flex items-center justify-center'>
						<p className='text-white text-sm'>{file.name}</p>
					</div>
				</div>
			)
		}
		else {
			return (
				<div className="flex max-w-[260px] flex-col items-center gap-4 pointer-events-none">
					<div className={`inline-flex h-13 w-13 items-center justify-center rounded-full border transition-all 
						${focused ? 'text-primary border-primary -translate-y-2' : 'border-gray-200 dark:border-gray-800 text-gray-700  dark:text-gray-400'}`}>

						<i className={`${Icon} text-xl`}></i>
					</div>

					{props.Placeholder &&
						<p className="text-center text-sm text-gray-500 dark:text-gray-400">
							<Markdown Type='Normal'>{props.Placeholder}</Markdown>
						</p>
					}
				</div>
			)
		}
	}


	return (
		<AbstractInput Dashed={true} Focus={focused} {...props} Prefix={undefined} Suffix={undefined} Icon={undefined} Placeholder={undefined}>
			<input style={{ display: 'none' }} accept={'image/*'} onChange={(e) => onInputFileChange(e)} ref={refFileInput} type="file" />

			<div className="grow flex justify-center items-center p-10 cursor-pointer min-h-40"
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