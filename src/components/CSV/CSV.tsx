import React, { useState, useRef, useCallback, useEffect } from 'react';
import Papa from 'papaparse';
import { Sizing } from '../Sizing/Sizing';
import { Action, IBindableComponentProps, IChildrenInheritedProps, IProjectInfoProps } from '@echino/echino.ui.sdk';
import { AbstractInput } from '../AbstractInput/AbstractInput';
import { Box, BoxTitle, IBoxProps } from '../Box/Box';
import { Dropdown } from '../Dropdown/Dropdown';
import { Button } from '../Button/Button';
import { isColumnEmpty, transformCSV } from './CSVTransform';
import { sendCSV } from './CSVSend';
import { UploadedFile } from '../ImageInput/ImageInput';
import { TableFromJson } from '../Table/TableFromJson';

// Types
interface ICSVImportProps extends IChildrenInheritedProps<ICSVMapping>, IBoxProps, IProjectInfoProps, IBindableComponentProps {
  Value?: UploadedFile;
  OnChange: Action<UploadedFile>;
  PreviewRecords?: number;
}

export interface ICSVMapping {
  Field: string;
  DisplayName: string;
  Type: TransformType;
  Helper?: string;
  Required?: boolean;
}

interface ICSVColumn {
  [key: number]: ICSVColumnData;
}

export interface ICSVColumnData {
  Id: number;
  Name: string;
  Mapping?: ICSVMapping;
}

export type TransformType = 'text' | 'gender' | 'date' | 'phone' | 'email' | 'street' | 'number';
export type CSVState = 'awaitFile' | 'process' | 'map' | 'upload' | 'preview';
export interface ICSVRecord {
  [key: string]: string;
}

// Column Card component
const CSVColumnCard: React.FC<{
  data: ICSVColumnData;
  previewValues?: string[];
  availableFields?: ICSVMapping[];
  onMappingChange?: (mapping: ICSVMapping | undefined) => void;
}> = ({ data, previewValues, availableFields, onMappingChange }) => {
  const actions = data.Mapping ? <i className='fas fa-circle-check text-success-500'></i> : null;

  const getValue = (value: string) => {
    if (data.Mapping) {
      const transform = transformCSV(value, data.Mapping.Type);
      if (transform === undefined) {
        return <i className="fa-solid fa-empty-set text-alizarin"></i>;
      }
      if (data.Mapping.Type === 'date') {
        return <span className='bg-primary text-white px-1.5 rounded-full'>{transform?.format('L')}</span>;
      }
      if (typeof (transform) === 'object') {
        return Object.values(transform).map((v, i) => <span className='bg-primary text-white py-0.5 px-1 rounded-full' key={i}>{v}</span>);
      } else if (data.Mapping.Type === 'gender') {
        if (transform === 0) {
          return <i className="fa-solid fa-mars text-peter-river"></i>;
        } else if (transform === 1) {
          return <i className="fa-solid fa-venus text-amethyst"></i>;
        } else {
          return <i className="fa-solid fa-mars-and-venus text-emerald"></i>;
        }
      }
      else {
        return <span className='bg-primary text-white py-0.5 px-1 rounded-full'>{transform.toString()}</span>;
      }
    }
    return '-';
  }
  return (
    <>
      {/* @ts-ignore */}
      <Box Title={data.Name} ColSpan="1/4" Actions={actions}>
        {data.Mapping ?
          <div
            onClick={() => onMappingChange?.(undefined)}
            className=' cursor-pointer group hover:border-primary hover:ring-primary/10 hover:ring-3 px-4 py-2.5 h-11 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-500 dark:text-gray-400 text-sm flex gap-2'>
            <span className='grow'>{data.Mapping.DisplayName}</span>
            <i className='fas fa-circle-xmark text-md'></i>
          </div>
          :
          <Dropdown
            OnChange={(e) => {
              console.log('Selected mapping', e);
              onMappingChange?.(e);
            }}
            onPropertyChanged={(v, o, n) => {
              console.log('Property changed', v, o, n);
              onMappingChange?.(n);
            }}
            declareFunction={() => { }}
            DisplayField='DisplayName'

            Source={availableFields ?? []}
            Placeholder='Select a field' />
        }


        <div className="mt-2 border grid grid-cols-[auto_1fr_1fr] border-gray-300 dark:border-gray-700 rounded-lg">

          <div className='text-sm  py-1 px-2 border-r border-b border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400'>
            Row
          </div>
          <div className='text-sm  py-1 px-2 border-r border-b border-gray-300 dark:border-gray-700 whitespace-nowrap text-gray-500 dark:text-gray-400 truncate'>
            Data
          </div>
          <div className='text-sm  py-1 px-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap text-gray-500 dark:text-gray-400 truncate'>
            Result
          </div>

          {previewValues?.map((value, idx) => (
            <React.Fragment key={idx}>
              <div className='text-sm  py-1 px-2 border-r border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 h-8 flex items-center '>
                {idx + 1}
              </div>
              <div className='text-sm  py-1 px-2 whitespace-nowrap text-gray-500 dark:text-gray-400 truncate h-8 flex items-center '>
                {value || <i className="fa-solid fa-empty-set text-sm opacity-80"></i>}
              </div>
              <div className='text-sm  py-1 px-2 whitespace-nowrap text-gray-500 dark:text-gray-400 truncate h-8 flex gap-1 items-center '>
                {getValue(value)}
              </div>
            </React.Fragment>
          ))}
        </div>
      </Box>
    </>
  );
};

// Main component
export const CSV: React.FC<ICSVImportProps> = (props) => {
  const { childrenProps, PreviewRecords = 5, OnChange, _projectInfo, Value } = props;
  const fields: ICSVMapping[] = childrenProps;

  const [state, setState] = useState<CSVState>(Value ? 'preview' : 'awaitFile');
  const [value, setValue] = useState<UploadedFile | null>(Value ?? null);

  const [file, setFile] = useState<File | null>(null);
  const [columns, setColumns] = useState<ICSVColumn>({});
  const [data, setData] = useState<ICSVRecord[]>([]);
  const [progress, setProgress] = useState<{ count?: number, text: string } | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [focused, setFocused] = React.useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const recordsRef = useRef<ICSVRecord[]>([]);


  useEffect(() => {
    if (Value !== undefined) {
      setValue(Value);
      setState('preview');
    }
  }, [Value]);

  // Handle drag events
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setFocused(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setFocused(false);
  }, []);

  // Check if a column is empty (all values are empty, null, or undefined)


  // Process the CSV file in chunks to avoid memory issues
  const processCSV = useCallback((file: File) => {
    setState('process')
    setError(null);
    setColumns([]);
    setData([]);
    recordsRef.current = [];

    // Use PapaParse to process the file with streaming to handle large files
    Papa.parse(file, {
      header: true,
      encoding: "ISO-8859-1",
      skipEmptyLines: true,
      preview: PreviewRecords, // Only load a limited number for preview
      chunk: (results) => {
        if (results.data && results.data.length > 0) {
          const newRecords = results.data as ICSVRecord[];
          recordsRef.current = [...recordsRef.current, ...newRecords];
        }
      },
      complete: () => {
        const allRecords = recordsRef.current;
        if (allRecords.length > 0) {
          const columnResult: ICSVColumn = {};
          //try to match columns?
          Object.keys(allRecords[0] || {}).forEach((col, colIndex) => {
            if (col.trim() !== '' && !isColumnEmpty(allRecords, col)) {
              columnResult[colIndex] = {
                Id: colIndex,
                Name: col
              };
            }
          });
          setColumns(columnResult);
          setData(allRecords);
        }
        setState('map');
      },
      error: (err) => {
        setError(`Error parsing CSV: ${err.message}`);
        setState('awaitFile');
      }
    });
  }, [PreviewRecords, isColumnEmpty]);

  // Handle file drop
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setFocused(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        setFile(file);
        processCSV(file);
      } else {
        setError('Please upload a CSV file');
      }
    }
  }, [processCSV]);

  // Handle file selection via file input
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        setFile(file);
        processCSV(file);
        setState('map');
      } else {
        setError('Please upload a CSV file');
      }
    }
  }, [processCSV]);

  // Handle mapping changes
  const handleMappingChange = useCallback((columnIndex: number, mappedField: ICSVMapping | undefined) => {
    setColumns(prev => {
      const next = { ...prev };
      const column = next[columnIndex];
      if (column) {
        column.Mapping = mappedField;
      }
      return next;
    });
  }, []);

  const getMissingFields = useCallback(() => {
    const missing: string[] = [];
    fields.filter(field => field.Required === true).forEach(field => {
      if (Object.values(columns).every(c => c.Mapping?.Field !== field.Field)) {
        missing.push(field.DisplayName);
      }
    });
    return missing;
  }, [columns]);

  // Complete import button handler
  const handleComplete = useCallback(() => {
    if (file) {
      setState('upload');
      sendCSV(
        _projectInfo.clusterUrl,
        file,
        Object.values(columns).filter(c => c.Mapping !== undefined),
        setProgress,
        (data) => {

          console.log('CSV upload complete', data);
          props.onPropertyChanged('value', undefined, data);
          props.OnChange?.(data);
          setValue(data);
          setState('preview');
        }
      );
    }

  }, [data, OnChange, columns]);

  // Get preview values for each column
  const getColumnPreviewValues = (header: string): string[] => {
    return data.slice(0, PreviewRecords).map(record => record[header] || '');
  };

  // Get remaining fields that are not already mapped
  const getAvailableFields = (currentHeader: string): ICSVMapping[] => {
    const usedFields = new Set(Object.values(columns).map(c => c.Mapping?.Field).filter(Boolean));
    return fields.filter(f => !usedFields.has(f.Field));
  };


  switch (state) {
    case 'awaitFile':
      return (
        <Box {...props}>
          <AbstractInput Dashed={true} Focus={focused} Prefix={undefined} Suffix={undefined} Icon={undefined} Placeholder={undefined}>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".csv"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />

            <div className="grow flex justify-center items-center p-10 cursor-pointer min-h-40 flex-col"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >

              <i className="fas fa-file-csv text-4xl mb-4 text-gray-400"></i>
              <p className="text-lg mb-2">Drag & drop a CSV file here</p>
              <p className="text-sm text-gray-500">or click to browse files</p>
              {error && <p className="text-red-500 mt-4">{error}</p>}

            </div>
          </AbstractInput >
        </Box >
      )
    case 'process':
      return (
        <Box {...props}>
          <AbstractInput Dashed={true} Focus={false} Prefix={undefined} Suffix={undefined} Icon={undefined} Placeholder={undefined}>
            <div className="grow flex justify-center items-center p-10 cursor-pointer min-h-40 flex-col">
              <i className="fas fa-spinner fa-spin text-3xl mb-4"></i>
              <p className="text-lg mb-2">Processing CSV file...</p>
            </div>
          </AbstractInput>
        </Box>
      )
    case 'map':
      const columnArray = Object.values(columns);
      const missingFields = getMissingFields();
      return (
        <Sizing>
          <BoxTitle {...props}
            Actions={<>

              <Button
                Label='Upload'
                Type='Success'
                Disabled={missingFields.length > 0}
                OnClick={() => handleComplete()}
                Confirmation='Are you sure data your data mapping is complete and that you want to upload?' />

            </>}
          />


          {missingFields.length > 0 &&
            <div className='flex flex-row gap-1 flex-wrap mb-2'>
              <h4 className='text-gray-500 dark:text-gray-400'>Missing fields : </h4>
              {missingFields.map((field, index) => (
                <div key={index} className='bg-alizarin text-white px-1.5 rounded-full'>{field}</div>
              ))}
            </div>
          }

          {columnArray.length > 0 && (
            <>
              <div className="grid grid-cols-12 gap-4 md:gap-6">
                {columnArray.map(column => (
                  <CSVColumnCard
                    key={column.Id}
                    data={column}
                    previewValues={getColumnPreviewValues(column.Name)}
                    availableFields={getAvailableFields(column)}
                    onMappingChange={(field) => handleMappingChange(column.Id, field)}
                  />
                ))}
              </div>

              <pre className='text-sm text-white'>
                {JSON.stringify(columns, null, 2)}
              </pre>
            </>
          )}
        </Sizing>
      )
    case 'upload':
      return (
        <Box {...props}>
          <AbstractInput Dashed={true} Focus={false} Prefix={undefined} Suffix={undefined} Icon={undefined} Placeholder={undefined}>
            <div className="grow flex justify-center items-center p-10 cursor-pointer min-h-40 flex-col">
              <i className="fas fa-spinner fa-spin text-3xl mb-4"></i>
              <p className="text-lg mb-2">{progress!.text}</p>
              <p className="text-sm text-gray-500">{progress!.count} %</p>
            </div>
          </AbstractInput>
        </Box>
      )
    case 'preview':
      return (
        <TableFromJson url={value!.url} {...props} />
      )
    default:
      return null;
  }
};