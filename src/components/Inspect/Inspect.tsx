import React, { useState, useEffect } from 'react';
import { Sizing } from '../Sizing/Sizing';

interface InspectProps {
  Source: any;
  Expand?: boolean;
  Depth?: number;
  MaxDepth?: number;
}

type ValueType = 'string' | 'number' | 'boolean' | 'undefined' | 'null' | 'array' | 'object' | 'function' | 'symbol' | 'bigint';

/**
 * Inspecteur - Un composant pour visualiser des structures de données de façon interactive
 */
export const Inspect: React.FC<InspectProps> = (props) => {
  const { Source, Expand = true, Depth = 0, MaxDepth = 5 } = props;
  const [isExpanded, setIsExpanded] = useState(Expand && Depth < 2);
  const [source, setSource] = useState<any>(Source);
  
  // Mettre à jour les données quand la source change
  useEffect(() => {
    setSource(Source);
  }, [Source]);

  // Détermine le type de valeur pour l'affichage
  const getValueType = (value: any): ValueType => {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (Array.isArray(value)) return 'array';
    return typeof value as ValueType;
  };

  // Génère la couleur du badge en fonction du type
  const getTypeColor = (type: ValueType): string => {
    switch (type) {
      case 'string': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300';
      case 'number': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'boolean': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'null': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      case 'undefined': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      case 'array': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      case 'object': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300';
      case 'function': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Formatage des valeurs pour l'affichage
  const formatValue = (value: any, type: ValueType): string => {
    switch (type) {
      case 'string': return `"${value}"`;
      case 'null': return 'null';
      case 'undefined': return 'undefined';
      case 'function': return 'ƒ ()';
      case 'array': return `Array(${value.length})`;
      case 'object': return `{${Object.keys(value).length} properties}`;
      default: return String(value);
    }
  };

  // Rendu pour les valeurs primitives
  const renderPrimitive = (value: any, type: ValueType) => (
    <div className="flex items-center space-x-2 font-mono">
      <span className='dark:text-white/90 text-gray-400 font-mono'>{formatValue(value, type)}</span>
      <span className={`text-xs px-2 py-0.5 rounded-full ${getTypeColor(type)}`}>
        {type}
      </span>
    </div>
  );

  // Rendu pour les objets et tableaux
  const renderComplex = (value: any, type: ValueType) => {
    if (Depth >= MaxDepth) {
      return (
        <div className="font-mono text-gray-500 dark:text-gray-400">
          {type === 'array' ? '[...]' : '{...}'} (max depth reached)
        </div>
      );
    }

    const isArray = type === 'array';
    const entries = isArray 
      ? Array.from({ length: value.length }, (_, i) => [String(i), value[i]])
      : Object.entries(value);
    
    return (
      <div className='w-full' >
        <div 
          className="flex items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors px-2" 
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span className="mr-2 text-sm font-mono dark:text-white/90 text-gray-400">{isExpanded ? '▼' : '►'}</span>
          <span className="font-mono text-sm dark:text-white/90 text-gray-400">
            {isArray ? `[${entries.length}]` : `{${entries.length}}`}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full ml-2 ${getTypeColor(type)}`}>
            {type}
          </span>
        </div>
        
        {isExpanded && (
          <div className="pl-4 border-l border-gray-200 dark:border-gray-700 mt-1">
            {entries.length === 0 ? (
              <div className="text-gray-400 dark:text-gray-500 italic">Empty</div>
            ) : (
              entries.map(([key, val], i) => (
                <div key={key} className="py-1">
                  <div className="flex flex-wrap items-center">
                    <span className="font-mono text-gray-500 dark:text-gray-400 min-w-[50px] mr-2">
                      {isArray ? `[${key}]:` : `${key}:`}
                    </span>
                    <div className="flex-1 min-w-0">
                      <Inspect 
                        Source={val} 
                        Expand={Expand}
                        Depth={Depth + 1}
                        MaxDepth={MaxDepth}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    );
  };

  // Rendu principal
  const type = getValueType(source);
  const isPrimitive = ['string', 'number', 'boolean', 'null', 'undefined', 'function', 'symbol', 'bigint'].includes(type);
  
  return (
    <Sizing {...props} >
    <div className={`rounded-lg bg-white dark:bg-gray-900 px-2 py-1 overflow-x-auto`}> 
        {isPrimitive ? renderPrimitive(source, type) : renderComplex(source, type)}
    </div>
    </Sizing>
  );
};