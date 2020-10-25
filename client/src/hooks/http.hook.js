import { useCallback, useState } from 'react'
import { useAuth } from './auth.hook'
import download from 'downloadjs'

export const useHttp = () => {
    const { logout } = useAuth()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const request = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
        setLoading(true)

        try {
            const response = await fetch(url, { method, body, headers })
            const data = await response.json()

            if (!response.ok && response.status === 401) {
                logout()
                setLoading(false)
                return window.location.reload(true)
            }

            if (!response.ok) {
                throw new Error(data.message || 'Ошибка на сервере')
            }

            setLoading(false)

            return data
        } catch (e) {
            setLoading(false)
            setError(e.message)
            throw e
        }
    }, [logout])

    const downloadRequest = useCallback(async (url, method = 'GET', name = 'download', headers = {}) => {
        try {
            const response = await fetch(url, { method, headers })

            if (!response.ok && response.status === 401) {
                logout()
                return window.location.reload(true)
            }

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.message || 'Ошибка на сервере')
            }

            const blob = await response.blob()
            download(blob, name)
        } catch (e) {
            setError(e.message)
            throw e
        }
    }, [logout])

    const clearError = useCallback(() => setError(null), [])

    return { loading, request, downloadRequest, error, clearError }
}