import { useCallback, useEffect, useState } from 'react'

const storageName = 'userData'

export const useAuth = () => {
    const [ready, setReady] = useState(false)
    const [accessToken, setAccessToken] = useState(null)
    const [refreshToken, setRefreshToken] = useState(null)

    const login = useCallback((accessToken, refreshToken) => {
        setAccessToken(accessToken)
        setRefreshToken(refreshToken)
    
        localStorage.setItem(storageName, JSON.stringify({
            accessToken, refreshToken
        }))    
    }, [])

    const logout = useCallback(() => {
        setAccessToken(null)
        setRefreshToken(null)
        localStorage.removeItem(storageName)
    }, [])

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(storageName))

        if (data && data.accessToken) {
            login(data.accessToken, data.refreshToken)
        }

        setReady(true)
    }, [login])

    return { login, logout, accessToken, refreshToken, ready }
}