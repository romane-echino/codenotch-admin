import { Popover } from "@headlessui/react";
import React from "react";
import { Markdown } from "../Markdown/Markdown";
export const Helper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <Popover className="relative flex items-center justify-center">
            <Popover.Button className='bg-primary mb-1 cursor-pointer hover:opacity-50 rounded-lg outline-none size-6 flex items-center justify-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200'>
                <i className="far fa-circle-info size-5 text-white flex items-center justify-center"></i>
            </Popover.Button>
            <Popover.Panel
                className="absolute top-full text-gray-800 dark:text-white/90 max-w-screen right-0 z-50 px-4 py-2 text-sm bg-white border border-gray-300  dark:border-gray-700 dark:bg-gray-800 translate-y-0.5 rounded-lg shadow-lg overflow-hidden">
                <Markdown Type="Normal">
                    {children}
                </Markdown>
            </Popover.Panel>
        </Popover>
    );
}