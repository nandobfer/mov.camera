import { createContext, useState } from "react"
import React from "react"
import { User } from "../types/User"

interface UserContextValue {
    user?: User | null
    setUser: React.Dispatch<React.SetStateAction<User | undefined>>

    accessToken: string
    refreshToken: string
    expirationTime: number
}

interface UserProviderProps {
    children: React.ReactNode
}

const UserContext = createContext<UserContextValue>({} as UserContextValue)

export default UserContext

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User>()

    const [accessToken, setAccessToken] = useState("")
    const [refreshToken, setRefreshToken] = useState("")
    const [expirationTime, setExpirationTime] = useState(0)

    return <UserContext.Provider value={{ user, setUser, accessToken, refreshToken, expirationTime }}>{children}</UserContext.Provider>
}
