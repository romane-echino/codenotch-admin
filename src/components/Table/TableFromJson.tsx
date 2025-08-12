import React, { useEffect, useState } from 'react';
import { Box, Button, IBoxProps, ICSVMapping, IListColumn, Label, List } from '../..';
import { Sizing } from '../Sizing/Sizing';

interface TableFromJsonProps extends IBoxProps {
    url: string;
    customColumns?: ICSVMapping[];
}

export const TableFromJson: React.FC<TableFromJsonProps> = (props) => {
    const { url, customColumns } = props;
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const pageSize = 20;

    useEffect(() => {
        setLoading(true);
        setError(null);
        fetch(url)
            .then((res) => {
                if (!res.ok) throw new Error('Erreur lors du chargement');
                return res.json();
            })
            .then((json) => {
                if (Array.isArray(json)) setData(json);
                else if (Array.isArray(json.data)) setData(json.data);
                else setError('Format JSON non supporté');
            })
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, [url]);

    const totalPages = Math.ceil(data.length / pageSize);
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const pageData = data.slice(start, end);
    const columns: IListColumn[] = [];
    if (customColumns && customColumns.length > 0) {
        columns.push(...customColumns.map((col) => ({
            Field: col.Field,
            DisplayName: col.DisplayName || col.Field,
        })));
    }


    if (loading) {
        return <div>Chargement...</div>;
    }

    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>;
    }
    return (
        <Sizing>
            <List {...props} Source={pageData} childrenProps={columns} />
            
            <div className='mb-2'></div>

            <Box>
                <div className="flex gap-2 mt-2 justify-between items-center">
                    <Button Label='Précédent' Type='Secondary' OnClick={() => setPage((p) => Math.max(1, p - 1))} Disabled={page === 1} />
                    <Label Value={`Page ${page} / ${totalPages}`} />
                    <Button Label='Suivant' Type='Secondary' OnClick={() => setPage((p) => Math.min(totalPages, p + 1))} Disabled={page === totalPages} />
                </div>
            </Box>
        </Sizing>
    );
};
