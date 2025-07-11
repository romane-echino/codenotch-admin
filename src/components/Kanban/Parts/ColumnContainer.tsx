import { useDroppable } from "@dnd-kit/core";
import { Card, CardColumn } from "../Kanban";
import React, { useMemo } from 'react';
import { SortableContext } from "@dnd-kit/sortable";
import { KanbanCard } from "../../KanbanCard/KanbanCard";

export interface IColumnContainer {
    column: CardColumn;
    cards: Card[];

    cardRenderer?: (as: string, data: any) => React.ReactNode;
}
export const ColumnContainer: React.FC<IColumnContainer> = ({ column, cards, cardRenderer }) => {
    const { setNodeRef } = useDroppable({ id: column.id });
    const cardIds = useMemo(() => {
        return cards.map((card) => card.id);
    }, [cards]);

    function defaultCardRenderer(card: any, index: number) {
        return (
            <KanbanCard CardId={card.id} ColumnId={card.columnId} Title={card.content['title']} key={index} />
        );
    }

    return (
        <SortableContext items={cardIds}>
            <div
                ref={setNodeRef}
                className="swim-lane flex flex-col gap-5 p-4 xl:p-6">
                <div className="mb-1 flex items-center justify-between">
                    <h3 className="flex items-center gap-3 text-base font-medium text-gray-800 dark:text-white/90">
                        {column.title}
                        <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-theme-xs font-medium text-gray-700 dark:bg-white/[0.03] dark:text-white/80">
                            {cards.length}
                        </span>
                    </h3>

                    <div x-data="{openDropDown: false}" className="relative">
                        <button className="text-gray-700 dark:text-gray-400">
                            <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M5.99902 10.2451C6.96552 10.2451 7.74902 11.0286 7.74902 11.9951V12.0051C7.74902 12.9716 6.96552 13.7551 5.99902 13.7551C5.03253 13.7551 4.24902 12.9716 4.24902 12.0051V11.9951C4.24902 11.0286 5.03253 10.2451 5.99902 10.2451ZM17.999 10.2451C18.9655 10.2451 19.749 11.0286 19.749 11.9951V12.0051C19.749 12.9716 18.9655 13.7551 17.999 13.7551C17.0325 13.7551 16.249 12.9716 16.249 12.0051V11.9951C16.249 11.0286 17.0325 10.2451 17.999 10.2451ZM13.749 11.9951C13.749 11.0286 12.9655 10.2451 11.999 10.2451C11.0325 10.2451 10.249 11.0286 10.249 11.9951V12.0051C10.249 12.9716 11.0325 13.7551 11.999 13.7551C12.9655 13.7551 13.749 12.9716 13.749 12.0051V11.9951Z" fill=""></path>
                            </svg>
                        </button>
                        <div x-show="openDropDown" className="absolute right-0 top-full z-40 w-[140px] space-y-1 rounded-2xl border border-gray-200 bg-white p-2 shadow-theme-md dark:border-gray-800 dark:bg-gray-dark" style={{ display: 'none' }}>
                            <button className="flex w-full rounded-lg px-3 py-2 text-left text-theme-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
                                Edit
                            </button>
                            <button className="flex w-full rounded-lg px-3 py-2 text-left text-theme-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
                                Delete
                            </button>
                            <button className="flex w-full rounded-lg px-3 py-2 text-left text-theme-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
                                Clear All
                            </button>
                        </div>
                    </div>
                </div>

                {cards.length === 0 && (
                    <div className=" grow flex items-center justify-center min-h-32 text-gray-500 dark:text-gray-400">
                        No cards in this column
                    </div>
                )}

                {cards.map((card, index) =>
                    cardRenderer ?
                        cardRenderer('item', card) :
                        defaultCardRenderer(card,index)
                )}

            </div>
        </SortableContext>
    );
}