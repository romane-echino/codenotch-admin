import React, { useState, useRef, useCallback, useEffect } from 'react';
import Papa from 'papaparse';
import { Sizing } from '../Sizing/Sizing';
import { IChildrenInheritedProps } from '@echino/echino.ui.sdk';
import { AbstractInput } from '../AbstractInput/AbstractInput';
import { Box, BoxTitle, IBoxProps } from '../Box/Box';
import { Dropdown } from '../Dropdown/Dropdown';
import { Button } from '../Button/Button';
import { transformCSV } from './CSVTransform';

// Types
interface ICSVImportProps extends IChildrenInheritedProps<ICSVMapping>, IBoxProps {
  onComplete?: (mappings: Record<string, string>, data: any[]) => void;
  maxPreviewRecords?: number;
}

interface ICSVMapping {
  Field: string;
  DisplayName: string;
  Type: TransformType;
}

interface ICSVColumn {
  [key: number]: ICSVColumnData;
}

interface ICSVColumnData {
  Id: number;
  Name: string;
  Mapping?: ICSVMapping;
}

export type TransformType = 'text' | 'gender' | 'date' | 'phone' | 'email' | 'street' | 'number';

interface ICSVRecord {
  [key: string]: string;
}

// Column Card component
const CSVColumnCard: React.FC<{
  data: ICSVColumnData;
  previewValues?: string[];
  availableFields?: ICSVMapping[];
  onMappingChange?: (mapping: ICSVMapping) => void;
}> = ({ data, previewValues, availableFields, onMappingChange }) => {
  const actions = data.Mapping ? <i className='fas fa-circle-check text-success-500'></i> : null;

  return (
    <>
      {/* @ts-ignore */}
      <Box Title={data.Name} ColSpan="1/4" Actions={actions}>
        {data.Mapping ?
          <div className='px-4 py-2.5 h-10 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-500 dark:text-gray-400 text-sm flex gap-2'>
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
              <div className='text-sm  py-1 px-2 border-r border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400'>
                {idx + 1}
              </div>
              <div className='text-sm  py-1 px-2 whitespace-nowrap text-gray-500 dark:text-gray-400 truncate'>
                {value || <i className="fa-solid fa-empty-set text-sm opacity-80"></i>}
              </div>
              <div className='text-sm  py-1 px-2 whitespace-nowrap text-gray-500 dark:text-gray-400 truncate'>
                {data.Mapping ? transformCSV(value, data.Mapping.Type) : '-'}
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
  const { childrenProps, maxPreviewRecords = 5, onComplete } = props;
  const fields: ICSVMapping[] = childrenProps;

  const [file, setFile] = useState<File | null>(null);
  const [columns, setColumns] = useState<ICSVColumn>({});
  const [data, setData] = useState<ICSVRecord[]>([]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focused, setFocused] = React.useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const recordsRef = useRef<ICSVRecord[]>([]);

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
  const isColumnEmpty = useCallback((data: ICSVRecord[], header: string): boolean => {
    if (!data.length) return true;

    // Consider a column empty if more than 90% of values are empty
    const emptyCount = data.filter(record =>
      !record[header] || record[header].trim() === ''
    ).length;

    return (emptyCount / data.length) > 0.9;
  }, []);

  // Process the CSV file in chunks to avoid memory issues
  const processCSV = useCallback((file: File) => {
    setIsProcessing(true);
    setError(null);
    setColumns([]);
    setData([]);
    recordsRef.current = [];

    // Use PapaParse to process the file with streaming to handle large files
    Papa.parse(file, {
      header: true,
      encoding: "ISO-8859-1",
      skipEmptyLines: true,
      preview: maxPreviewRecords, // Only load a limited number for preview
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

        setIsProcessing(false);
      },
      error: (err) => {
        setError(`Error parsing CSV: ${err.message}`);
        setIsProcessing(false);
      }
    });
  }, [maxPreviewRecords, isColumnEmpty]);

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
      } else {
        setError('Please upload a CSV file');
      }
    }
  }, [processCSV]);

  // Handle mapping changes
  const handleMappingChange = useCallback((columnIndex: number, mappedField: ICSVMapping) => {
    console.log('Mapping change', columnIndex, mappedField);
    setColumns(prev => {
      const next = { ...prev };
      const column = next[columnIndex];
      if (column) {
        column.Mapping = mappedField;
      }
      return next;
    });
  }, []);

  // Complete import button handler
  /*const handleComplete = useCallback(() => {
    if (onComplete && records.length > 0) {
      // Only include mapped columns in the final data
      const finalData = records.map(record => {
        const mappedRecord: Record<string, ICSVColumn> = {};
        Object.entries(mappings).forEach(([csvField, targetMapping]) => {
          mappedRecord[targetMapping.Field] = record[csvField] || '';
        });
        return mappedRecord;
      });

      onComplete(mappings, finalData);
    }
  }, [mappings, onComplete, records]);*/

  // Get preview values for each column
  const getColumnPreviewValues = (header: string): string[] => {
    return data.slice(0, maxPreviewRecords).map(record => record[header] || '');
  };

  // Get remaining fields that are not already mapped
  const getAvailableFields = (currentHeader: string): ICSVMapping[] => {
    const usedFields = new Set(Object.values(columns).map(c => c.Mapping?.Field).filter(Boolean));
    // Always include the currently mapped field for this header
    /*if (mappings[currentHeader]) {
      usedFields.delete(mappings[currentHeader]);
    }*/

    return fields.filter(f => !usedFields.has(f.Field));
  };

  if (!file) {
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
            {isProcessing ? (
              <>
                <i className="fas fa-spinner fa-spin text-3xl mb-4"></i>
                <p>Processing CSV file...</p>
              </>
            ) : (
              <>
                <i className="fas fa-file-csv text-4xl mb-4 text-gray-400"></i>
                <p className="text-lg mb-2">Drag & drop a CSV file here</p>
                <p className="text-sm text-gray-500">or click to browse files</p>
                {error && <p className="text-red-500 mt-4">{error}</p>}
              </>
            )}
          </div>

        </AbstractInput >
      </Box >
    )
  }

  //

  const columnArray = Object.values(columns);
  return (
    <Sizing>
      <BoxTitle {...props}
        Subtitle={props.Subtitle + `\n${columnArray.filter(c => c.Mapping === undefined).length} of ${columnArray.length} columns mapped`}
        Actions={<>

          <Button
            Label='Upload'
            Type='Success'
            Disabled={columnArray.filter(c => c.Mapping === undefined).length > 0}
            OnClick={() => //handleComplete()
            { }}
            Confirmation='Are you sure data your data mapping is complete and that you want to upload?' />

        </>}
      />

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
  );
};