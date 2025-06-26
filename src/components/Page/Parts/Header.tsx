import React from 'react';
import { NavLink } from "react-router-dom";

interface HeaderProps {
    Title?: string;
    Subtitle?: string;
    Icon?: string;
    CustomHeader?: React.ReactNode;
    ParentPageTitle?: string;
    ParentPageRoute?: string;
}
export const Header: React.FC<HeaderProps> = ({
    Title,
    Subtitle,
    Icon,
    CustomHeader,
    ParentPageTitle,
    ParentPageRoute
}) => {
    return (
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 h-11">
            <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90" x-text="pageName">
                    {Icon && <i className={`${Icon} mr-2`}></i>}
                    {Title && <span>{Title}</span>}
                </h2>
                {Subtitle && <p className="text-sm text-gray-500 dark:text-gray-400">{Subtitle}</p>}
            </div>

            {ParentPageRoute && ParentPageTitle &&
                <nav>
                    <ol className="flex items-center gap-1.5">
                        <li>
                            <NavLink to={ParentPageRoute} />
                            <a className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400" href="index.html">
                                {ParentPageTitle}
                                <svg className="stroke-current" width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366" stroke="" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                                </svg>
                            </a>
                        </li>
                        <li className="text-sm text-gray-800 dark:text-white/90" x-text="pageName">{Title}</li>
                    </ol>
                </nav>
            }

            {CustomHeader &&
                <div className="flex items-center gap-3">
                    {CustomHeader}
                </div>
            }
        </div>
    )
}