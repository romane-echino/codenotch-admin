export enum SourceType {
    Array = 'array',
    SIOQL = 'sioql',
    API = 'api',
    Unknown = 'unknown'
}

export interface IDataRequest {
    data: any;
    state: 'loading' | 'error' | 'success' | 'idle';
    meta: any;
}

export function getSourceType(source: any): SourceType {
    if (source === null || source === undefined) {
        return SourceType.Unknown;
    }
    else if (Array.isArray(source)) {
        return SourceType.Array;
    }
    else if (typeof source === 'object') {
        let request = source as IDataRequest;
        if (request && request.state && request.state !== 'success') {
            return SourceType.Unknown
        }
        else if (Array.isArray(request.data)) {
            return SourceType.API;
        }
        else if (typeof request.data === 'object' && request.data !== null) {
            return SourceType.SIOQL;
        }
    }

    return SourceType.Unknown;
}


export function getDataFromSource(source: any): any[] {
    if (source === null || source === undefined) {
        return [];
    }

    switch (getSourceType(source)) {
        case SourceType.Array: return source;
        case SourceType.Unknown: return [];
        case SourceType.API: return source.data || [];
        case SourceType.SIOQL:
            let arrayKey = getArrayKey(source);
            return arrayKey ? source.data[arrayKey] : [];
    }
}


export function getArrayKey(source: any): string | undefined {
    if (source === null || source === undefined || getSourceType(source) !== SourceType.SIOQL) {
        return undefined;
    }

    return Object.keys(source.data).find(key => Array.isArray(source.data[key]));
}

export function getColumnsFromSource(source: any, customColumns:any[]): any[] {
    if (customColumns && customColumns.length > 0) {
        return customColumns;
    }
    
    if (source === null || source === undefined) {
        return [];
    }

    switch (getSourceType(source)) {
        case SourceType.Array:
            return Object.keys(source[0]);
        case SourceType.Unknown:
            return [];
        case SourceType.API:
            return Object.keys(source.data[0])
        case SourceType.SIOQL:
            let arrayKey = getArrayKey(source);
            if (arrayKey && source.data[arrayKey].length > 0) {
                return Object.keys(source.data[arrayKey][0]);
            }
            return [];
    }
}