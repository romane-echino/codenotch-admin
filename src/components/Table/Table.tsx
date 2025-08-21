import React, { useCallback, useEffect, useMemo } from 'react';

import { Sizing } from '../Sizing/Sizing';
import { IAbstractListAction, IInputProps } from '../AbstractInput/AbstractInput';
import { Helper } from '../AbstractInput/Helper';
import { IBindableComponentProps, IChildrenInheritedProps } from '@echino/echino.ui.sdk';

interface ITableProps extends IInputProps, IChildrenInheritedProps<{ DisplayName: string, Field: string }>, IBindableComponentProps {
    AddText?: string;
}

interface RowData {
    id: string;
    data: any;
}

export const Table: React.FC<ITableProps> = (props) => {
    // Utiliser un tableau d'objets avec des IDs stables au lieu d'un tableau simple
    const [rows, setRows] = React.useState<RowData[]>([]);
    let changeTimer: any = null;

    // Fonction pour générer un ID unique
    const generateId = useCallback(() => {
        return Math.random().toString(36).substring(2, 15);
    }, []);

    // Effet pour initialiser les données depuis props
    useEffect(() => {
        if (props.Value !== undefined && props.Value !== null) {
            if (Array.isArray(props.Value) && props.Value.length > 0) {
                // Convertir le tableau simple en tableau d'objets avec des IDs
                setRows(props.Value.map(item => ({
                    id: generateId(),
                    data: item
                })));
            }
            else if (typeof props.Value === 'string') {
                try {
                    const dataFromString = JSON.parse(props.Value);
                    if (Array.isArray(dataFromString) && dataFromString.length > 0) {
                        setRows(dataFromString.map(item => ({
                            id: generateId(),
                            data: item
                        })));
                    }
                } catch (e) {
                    console.error("Error parsing data from string", e);
                }
            }
        }
    }, [props.Value, generateId]);

    // Extraire juste les données pour la sortie
    const data = useMemo(() => rows.map(row => row.data), [rows]);

    // Notifier les changements de données
    useEffect(() => {
        clearTimeout(changeTimer);
        changeTimer = setTimeout(() => {
            props.OnChange?.(data);
            props._internalOnChange?.(data);
            props.onPropertyChanged?.('value', null, data);
        }, 750);
    }, [data, props.OnChange, props.onPropertyChanged, props._internalOnChange]);

    // Fonction pour mettre à jour une cellule spécifique
    const handleUpdate = useCallback((rowId: string, colName: string, value: any) => {
        console.log(`Updating row ${rowId}, column ${colName} to ${value}`);

        setRows(prevRows => {
            return prevRows.map(row => {
                if (row.id === rowId) {
                    return {
                        ...row,
                        data: { ...row.data, [colName]: value }
                    };
                }
                return row;
            });
        });
    }, []);

    // Fonction pour supprimer une ligne
    const removeRow = useCallback((rowId: string) => {
        setRows(prevRows => {
            return prevRows.filter(row => row.id !== rowId);
        });
    }, []);

    // Fonction pour ajouter une ligne
    const addRow = useCallback(() => {
        const newObj = {};
        props.childrenProps.forEach(col => {
            newObj[col.Field] = '';
        });

        setRows(prevRows => [
            ...prevRows, 
            { 
                id: generateId(), 
                data: newObj 
            }
        ]);
    }, [props.childrenProps, generateId]);

    // Mémoriser la fonction de rendu des cellules
    const renderCell = useCallback((rowData: any, rowId: string, childIndex: number) => {
        const child = React.Children.toArray(props.children)[childIndex];
        const field = props.childrenProps[childIndex]?.Field;

        if (!field || !React.isValidElement(child)) {
            return null;
        }

        // Copier les props de l'enfant en évitant une référence directe
        const effectiveProps = { ...child.props };

        // Créer des props spécifiques pour cette cellule
        if (effectiveProps.children && effectiveProps.children.props) {
            const cellValue = rowData && rowData[field] !== undefined ? rowData[field] : '';

            effectiveProps.children = React.cloneElement(
                effectiveProps.children,
                {
                    ...props.childrenProps[childIndex],
                    ...effectiveProps.children.props,
                    Containered: true,
                    Full: true,
                    Value: cellValue,
                    OnChange: (value: any) => handleUpdate(rowId, field, value),
                    OnSelect: (value: IAbstractListAction) => handleUpdate(rowId, field, value.value),
                    // Utiliser rowId au lieu de rowIndex pour l'identifiant
                    id: `cell-${rowId}-${field}`,
                    key: `input-${rowId}-${field}`,
                }
            );
        }

        return (
            <div
                key={`cell-${rowId}-${childIndex}-${field}`}
                className={`border-r border-b border-gray-200 dark:border-gray-800 relative ${
                    childIndex === props.childrenProps.length - 1 ? '' : 'border-r'
                }`}
            >
                {React.cloneElement(child, effectiveProps)}
            </div>
        );
    }, [props.children, props.childrenProps, handleUpdate]);

    // Rendu des lignes mémorisé
    const renderRows = useMemo(() => {
        return rows.map((row) => (
            <React.Fragment key={`row-${row.id}`}>
                {props.childrenProps.map((_, childIndex) =>
                    renderCell(row.data, row.id, childIndex)
                )}

                {rows.length > 1 && (
                    <div 
                        className='size-10 cursor-pointer flex items-center justify-center' 
                        onClick={() => removeRow(row.id)}
                    >
                        <i className='fas fa-minus-circle text-red-500'></i>
                    </div>
                )}
            </React.Fragment>
        ));
    }, [rows, props.childrenProps, renderCell, removeRow]);

    return (
        <Sizing {...props} Containered={true}>
            <div className='flex justify-between'>
                <div>
                    {props.Title &&
                        <label className={`${props.Subtitle ? '' : 'mb-1.5'} block text-sm font-medium text-gray-700 dark:text-gray-400`}>
                            {props.Title}
                        </label>
                    }
                    {props.Subtitle &&
                        <label className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-500">
                            {props.Subtitle}
                        </label>
                    }
                </div>
                {props.Helper &&
                    <Helper>
                        {props.Helper}
                    </Helper>
                }
            </div>

            {/* En-tête de la table */}
            <div className='grid h-10 border-t border-l border-r border-gray-300 dark:border-gray-700 rounded-t-lg'
                style={{ gridTemplateColumns: `repeat(${props.childrenProps.length}, minmax(0, 1fr)) auto` }}>
                {props.childrenProps.map((col, index) => (
                    <div key={`header-${index}`} className={`flex items-center justify-between px-4 py-2 border-r border-gray-200 dark:border-gray-800 ${index === props.childrenProps.length - 1 ? '' : 'border-r'}`}>
                        <span className="text-sm font-medium text-gray-800 dark:text-white">{col.DisplayName ?? col.Field}</span>
                    </div>
                ))}
                {rows.length > 1 && <div className='size-10 flex items-center justify-center'></div>}
            </div>

            {/* Corps de la table */}
            {rows.length > 0 &&
                <div
                    className="dark:bg-dark-900 min-h-11 w-full border bg-transparent text-sm dark:bg-gray-900 text-gray-800 dark:text-white/90 border-gray-300 dark:border-gray-700 grid"
                    style={{ gridTemplateColumns: `repeat(${props.childrenProps.length}, minmax(0, 1fr)) auto` }}
                >
                    {renderRows}
                </div>
            }

            {/* Bouton d'ajout */}
            <div
                className={`flex justify-center items-center h-10 border-b border-l border-r border-gray-300 dark:border-gray-700 rounded-b-lg cursor-pointer ${rows.length === 0 ? 'border-t' : 'border-t-0'}`}
                onClick={addRow}
            >
                <div className='flex gap-2 items-center justify-center text-gray-800 dark:text-white/90'>
                    <i className='fas fa-plus-circle text-green-500'></i>
                    {props.AddText &&
                        <span className='text-sm text-gray-500 dark:text-gray-400'>{props.AddText}</span>
                    }
                </div>
            </div>

        </Sizing>
    );
};