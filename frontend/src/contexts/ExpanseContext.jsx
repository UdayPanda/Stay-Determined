import { useContext, createContext, useState } from "react";


const ExpanseContext = createContext()

export const ExpanseProvider = ({ children }) => {
    const [expanses, setExpanses] = useState([])
    const [balance, setBalance] = useState(0)


    return <ExpanseContext.Provider value={{expanses, balance, setExpanses, setBalance}}>
        { children }
    </ExpanseContext.Provider>
}

export const useExpanse = ()=>{
    return useContext(ExpanseContext)
}