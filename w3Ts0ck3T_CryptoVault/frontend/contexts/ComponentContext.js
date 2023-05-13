import React, { useState, createContext } from "react";

export const ComponentContext = createContext()

export const ComponentContextProvider = ({ children }) => {
    const [loading_comp, set_loading_comp] = useState(false);
    const [add_vault_comp, set_add_vault_comp] = useState(false);

    return (
        <ComponentContext.Provider value={{
            loading_comp,
            set_loading_comp,
            add_vault_comp,
            set_add_vault_comp
        }}>
            {children}
        </ComponentContext.Provider>
    )
}