import { Popover } from "@headlessui/react";
import React from "react";
export const Helper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <Popover className="relative">
            <Popover.Button className=' outline-none size-6 flex items-center justify-end text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200'>
                <i className="far fa-circle-info"></i>
            </Popover.Button>
            <Popover.Panel
                className="absolute text-white min-w-sm right-0 z-50 px-4 py-2 text-sm bg-white border border-gray-300  dark:border-gray-700 dark:bg-gray-800 translate-y-0.5 rounded-lg shadow-lg overflow-hidden">
                {children}
            </Popover.Panel>
        </Popover>
    );
}