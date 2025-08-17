import { Popover } from "@headlessui/react";
import React from "react";
import { Markdown } from "../Markdown/Markdown";

interface IHelperProps {
    Size?: 'small' | 'large';
}

export const Helper: React.FC<IHelperProps> = ({ children, Size = 'small' }) => {
    return (
        <Popover className="relative flex items-center justify-center">
            <Popover.Button className={`bg-primary mb-1 cursor-pointer rounded-lg outline-none text-white/75 hover:text-white flex items-center justify-center border border-white/10
                ${Size === 'small' ? 'size-6' : 'size-[42px]'} `}>
                <i className={`  ${Size === 'small' ? 'far text-base' : 'far text-lg'} fa-circle-info  flex items-center justify-center`}></i>
            </Popover.Button>
            <Popover.Panel
                className="absolute top-full text-gray-800 dark:text-white/90 max-w-screen right-0 z-50 px-4 py-2 text-sm bg-white border border-gray-300  dark:border-gray-700 dark:bg-gray-800 translate-y-0.5 rounded-lg shadow-lg overflow-hidden">
                <Markdown Type="Normal">
                    {children}
                </Markdown>
            </Popover.Panel>
        </Popover>
    );
    //text-gray-800 dark:text-white/90 bg-white border border-gray-300  dark:border-gray-700 dark:bg-gray-800
}