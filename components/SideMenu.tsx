

export default function SideMenu() {
    return (
    

            <aside
                id="default-sidebar"
                className="fixed top-0 left-0 z-60 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
                aria-label="Sidebar"
            >
                <div className="h-full pt-32 px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
                    <ul className="space-y-2 font-medium">

                        <li>
                            <a
                                href="/profile"
                                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                            >
                                <svg
                                    className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 18 18"
                                >
                                <path d="M16 0H4a2 2 0 0 0-2 2v1H1a1 1 0 0 0 0 2h1v2H1a1 1 0 0 0 0 2h1v2H1a1 1 0 0 0 0 2h1v2H1a1 1 0 0 0 0 2h1v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4.5a3 3 0 1 1 0 6 3 3 0 0 1 0-6ZM13.929 17H7.071a.5.5 0 0 1-.5-.5 3.935 3.935 0 1 1 7.858 0 .5.5 0 0 1-.5.5Z"></path>
                                </svg>
                                <span className="flex-1 ms-3 whitespace-nowrap">Profile</span>
                                
                            </a>
                        </li>
                        <li>
                            <a
                            href="/profile/saved-posts"
                                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                            >
                                <svg
                                    className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 20 18"
                                >
                                <path
                                    d="M7.00795 15.3196L2.80795 17.1196C2.14128 17.403 1.50795 17.349 0.90795 16.9576C0.30795 16.5663 0.00794983 16.012 0.00794983 15.2946V2.31963C0.00794983 1.76963 0.20395 1.29896 0.59595 0.907626C0.98795 0.516293 1.45862 0.320293 2.00795 0.319626H12.0079C12.558 0.319626 13.0289 0.515626 13.4209 0.907626C13.813 1.29963 14.0086 1.77029 14.0079 2.31963V15.2946C14.0079 16.0113 13.708 16.5656 13.108 16.9576C12.5079 17.3496 11.8746 17.4036 11.208 17.1196L7.00795 15.3196ZM7.00795 13.1196L12.0079 15.2696V2.31963H2.00795V15.2696L7.00795 13.1196ZM7.00795 2.31963H2.00795H12.0079H7.00795Z"
                            
                                />
                                </svg>
                                <span className="flex-1 ms-3 whitespace-nowrap">Saved Posts</span>
                            </a>
                        </li>
                        <li>
                            <a
                                href="/profile/notifications"
                                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                            >
                                <svg
                                    className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                <path d="M12.133 10.632v-1.8A5.406 5.406 0 0 0 7.979 3.57.946.946 0 0 0 8 3.464V1.1a1 1 0 0 0-2 0v2.364a.946.946 0 0 0 .021.106 5.406 5.406 0 0 0-4.154 5.262v1.8C1.867 13.018 0 13.614 0 14.807 0 15.4 0 16 .538 16h12.924C14 16 14 15.4 14 14.807c0-1.193-1.867-1.789-1.867-4.175ZM3.823 17a3.453 3.453 0 0 0 6.354 0H3.823Z"></path>
                                </svg>
                            
                                <span className="flex-1 ms-3 whitespace-nowrap">Notifications</span>
                                
                            </a>
                        </li>

                        <li>
                            <a
                                href="#"
                                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                            >
                            <svg
                                className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd" d="M16 5.5C16 8.53757 13.5376 11 10.5 11H7V13H5V15L4 16H0V12L5.16351 6.83649C5.0567 6.40863 5 5.96094 5 5.5C5 2.46243 7.46243 0 10.5 0C13.5376 0 16 2.46243 16 5.5ZM13 4C13 4.55228 12.5523 5 12 5C11.4477 5 11 4.55228 11 4C11 3.44772 11.4477 3 12 3C12.5523 3 13 3.44772 13 4Z" />
                                </svg>
                                <span className="flex-1 ms-3 whitespace-nowrap">Reset Password</span>
                            </a>
                        </li>
                       
                    </ul>
                </div>
            </aside>

        
    );
}
