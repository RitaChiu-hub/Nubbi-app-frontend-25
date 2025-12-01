import { createContext, useContext } from "react"
import { useSubject } from "./useSubject";

export const SubjectContext = createContext();

function SubContext({ children }) {

    const subject = useSubject();

    return (
        <SubjectContext.Provider value={subject}>
            {children}
        </SubjectContext.Provider>
    );
}

export default SubContext;