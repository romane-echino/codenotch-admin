import Papa from "papaparse";
import { ICSVColumnData, ICSVRecord } from "./CSV";
import { Dispatch, SetStateAction, useRef } from "react";
import { isColumnEmpty, transformCSV } from "./CSVTransform";
import { UploadedFile } from "../ImageInput/ImageInput";

const jsonData: ICSVRecord[] = [];

export const sendCSV = (
    clusterUrl, file: File,
    columns: ICSVColumnData[],
    setProgress: Dispatch<SetStateAction<{ count?: number; text: string; } | null>>,
    onFinish: (data: UploadedFile) => void
) => {
    jsonData.length = 0; // Clear previous records

    let progress = 0;
    setProgress({ count: progress, text: "Transforming..." });
    Papa.parse(file, {
        header: true,
        encoding: "ISO-8859-1",
        skipEmptyLines: true,
        chunk: (results) => processChunk(results, columns, setProgress),
        complete: async () => {
            await processComplete(clusterUrl, setProgress, onFinish);
        },
        error: (err) => {
            throw new Error(`CSV parsing error: ${err.message}`);
        }
    });
};



const processChunk = (
    results: Papa.ParseResult<unknown>,
    columns: ICSVColumnData[],
    setProgress: Dispatch<SetStateAction<{ count?: number; text: string; } | null>>
) => {
    if (results.data && results.data.length > 0) {
        setProgress({ count: results.meta.cursor, text: "Processing chunk..." });
        const data = results.data as ICSVRecord[];
        for (const record of data) {
            const recordTransform = {};

            for (const column of columns) {
                const value = transformCSV(record[column.Name], column.Mapping!.Type, true);
                if (value !== undefined && value !== null && value !== '') {
                    if (typeof value === 'object') {
                        Object.assign(recordTransform, value);
                    }
                    else {
                        recordTransform[column.Mapping!.Field] = value;
                    }
                }
            }

            if (Object.keys(recordTransform).length > 0) {
                jsonData.push(recordTransform);
            }
        }
    }
}


const processComplete = async (
    clusterUrl: string,
    setProgress: Dispatch<SetStateAction<{ count?: number; text: string; } | null>>,
    onFinish: (data: UploadedFile) => void
) => {
    setProgress({ count: undefined, text: "Uploading..." });
    const reader = new FileReader();

    reader.onloadend = async () => {
        await upload(clusterUrl, reader.result, onFinish);
    }

    reader.onerror = (error) => {
        throw new Error(`File reading error: ${error}`);
    };

    var blob = new Blob([JSON.stringify(jsonData)], {
        type: 'application/json'
    });

    reader.readAsText(blob);
}


const upload = async (clusterUrl: string, data: string | ArrayBuffer | null, onFinish: (data: UploadedFile) => void) => {
    const Endpoint = clusterUrl + '/portal/api/upload-image';
    const ContentTypeEndpoint = clusterUrl + '/portal/api/update-content-type';

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
            "contentType": 'application/json'
        })
    });

    if (contentTypeResponse.ok === false) {
        throw new Error(`${contentTypeResponse.status} ${await contentTypeResponse.text()}`);
    }

    onFinish({
        url: jobject.DownloadUrl,
        name: jobject.FileName
    });
}