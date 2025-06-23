import { NavLink } from "react-router-dom";
import { IApplicationProps, IAppMenu, IAppMenuItem } from "../Application";
import React from "react";
import { Disclosure } from "@headlessui/react";

interface INavigationProps extends IApplicationProps {
    SideBarToggle: boolean;
    Menu: IAppMenu[];
}
export const Navigation: React.FC<INavigationProps> = (props) => {
    const hasLogo = props.LogoUrl || props.LogoDarkUrl;

    const [sideBarToggle, setSideBarToggle] = React.useState(props.SideBarToggle);

    React.useEffect(() => {
        setSideBarToggle(props.SideBarToggle);

    }, [props.SideBarToggle]);

    return (
        <aside className={`sidebar fixed top-0 left-0 z-9999 flex h-screen w-[290px] flex-col overflow-y-auto border-r border-gray-200 
          bg-white px-5 transition-all duration-300 lg:static lg:translate-x-0 dark:border-gray-800 dark:bg-gray-900 ${sideBarToggle ? 'translate-x-0 lg:w-[90px]' : '-translate-x-full'}`} >

            <div className={`sidebar-header flex items-center gap-2 pt-8 pb-7 ${sideBarToggle ? 'justify-center' : 'justify-between'}`}>
                {hasLogo &&

                    <NavLink to="/">
                        <span className={`logo ${sideBarToggle ? 'hidden' : ''}`}>
                            <img src="https://placehold.co/32x32/cccccc/000" alt="Logo" className="lg:hidden size-8" />
                            {props.LogoUrl &&
                                <img className="dark:hidden" src={props.LogoUrl} alt="Logo" />
                            }
                            {props.LogoDarkUrl &&
                                <img className="hidden dark:block" src={props.LogoDarkUrl} alt="Logo" />
                            }

                            {props.LogoIcon &&
                                <img className={`${sideBarToggle ? 'lg:block' : 'hidden'} logo-icon`} src={props.LogoIcon} alt="Logo" />
                            }
                        </span>
                    </NavLink>

                }

                {/* classHack sidebarToggle ? 'lg:block' : 'hidden' */}


            </div>



            <nav className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">


                {props.Menu && props.Menu.length > 0 &&
                    props.Menu.map((menu, index) => {
                        return (
                            <React.Fragment key={index}>
                                {menu.Name &&
                                    <h3 className="mb-4 text-xs leading-[20px] text-gray-400 uppercase">
                                        <span className={`${sideBarToggle && 'hidden'}`} >
                                            {menu.Name}
                                        </span>

                                        <svg className={`menu-group-icon mx-auto fill-current ${sideBarToggle ? 'lg:block hidden' : 'hidden'}`} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M5.99915 10.2451C6.96564 10.2451 7.74915 11.0286 7.74915 11.9951V12.0051C7.74915 12.9716 6.96564 13.7551 5.99915 13.7551C5.03265 13.7551 4.24915 12.9716 4.24915 12.0051V11.9951C4.24915 11.0286 5.03265 10.2451 5.99915 10.2451ZM17.9991 10.2451C18.9656 10.2451 19.7491 11.0286 19.7491 11.9951V12.0051C19.7491 12.9716 18.9656 13.7551 17.9991 13.7551C17.0326 13.7551 16.2491 12.9716 16.2491 12.0051V11.9951C16.2491 11.0286 17.0326 10.2451 17.9991 10.2451ZM13.7491 11.9951C13.7491 11.0286 12.9656 10.2451 11.9991 10.2451C11.0326 10.2451 10.2491 11.0286 10.2491 11.9951V12.0051C10.2491 12.9716 11.0326 13.7551 11.9991 13.7551C12.9656 13.7551 13.7491 12.9716 13.7491 12.0051V11.9951Z" fill=""></path>
                                        </svg>
                                    </h3>
                                }

                                {menu.Items && menu.Items.length > 0 &&
                                    <ul className="mb-6 flex flex-col gap-4">

                                        {menu.Items.map((item, itemIndex) => {
                                            if (item.Children && item.Children.length > 0) {
                                                return (
                                                    <li>
                                                        <Disclosure>
                                                            {({ open }) => (
                                                                <>
                                                                    <Disclosure.Button className={`w-full flex items-center rounded-lg ${open && 'bg-gray-100 dark:bg-gray-800 text-primary-500'}`}>
                                                                        <NavigationItem key={itemIndex} item={item} sideBarToggle={sideBarToggle} />
                                                                        <div className="size-8 flex items-center justify-center">
                                                                            <i className="fa-duotone fa-light fa-angle-down text-xl"></i>
                                                                        </div>
                                                                    </Disclosure.Button>

                                                                    <Disclosure.Panel className="flex flex-col gap-1 pl-9 mt-2">
                                                                        {item.Children?.map((childItem, childIndex) => {
                                                                            let child = { ...childItem };
                                                                            child.Route = (item.Route ?? '') + childItem.Route;
                                                                            return <NavigationItem key={childIndex} item={child} sideBarToggle={sideBarToggle} />
                                                                        })}
                                                                    </Disclosure.Panel>
                                                                </>
                                                            )}
                                                        </Disclosure>
                                                    </li>
                                                )
                                            }
                                            else {
                                                return (
                                                    <li>
                                                        <NavigationItem key={itemIndex} item={item} sideBarToggle={sideBarToggle} />
                                                    </li>
                                                )
                                            }

                                        })}

                                    </ul>
                                }
                            </React.Fragment>
                        )
                    })
                }

            </nav>
        </aside>
    )
}


const NavigationItem: React.FC<{ item: IAppMenuItem, sideBarToggle: boolean }> = ({ item, sideBarToggle }) => {

    let Component = 'div';
    let props: any = {};
    if (item.Route && !item.Children) {
        Component = NavLink;
        props.to = item.Route;
        props.exact = true;
        props.activeClassName = "bg-gray-100 dark:bg-gray-800 text-primary-500";
    }

    return (
        <Component {...props} className="flex items-center rounded-lg gap-1 font-medium p-1 grow cursor-pointer" >
            {item.Icon &&
                <div className="size-8 flex items-center justify-center">
                    <i className={`${item.Icon} text-xl`}></i>
                </div>
            }

            <span className={`${sideBarToggle && 'lg:hidden'}`}>
                {item.Name}
            </span>
        </Component>
    )
}