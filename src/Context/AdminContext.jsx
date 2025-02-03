import React, { createContext, useContext, useState } from 'react'

const AdminContext = createContext();


export const AdminProvider = ({ children }) => {
    const [hideSideBar, SetHideSideBar] = useState(false);

    const handleHideSideBar = () => {
        SetHideSideBar(!hideSideBar);
    }


    return (
        <AdminContext.Provider value={{hideSideBar, handleHideSideBar}}>
            {children}
        </AdminContext.Provider>

    ) 
}

export const useAdmin = () => {
    return useContext(AdminContext);
}
