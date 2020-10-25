import React, { useCallback, useContext, useEffect, useState } from 'react'
import { FileUpload } from '../components/FileUpload'
import { Loader } from '../components/Loader'
import { AuthContext } from '../context/AuthContext'
import { useHttp } from '../hooks/http.hook'
import { useMessage } from '../hooks/message.hook'

export const FileUploadPage = () => {
    const message = useMessage()
    const [file, setFile] = useState(null)
    const { loading, request, error, clearError } = useHttp()
    const { accessToken } = useContext(AuthContext)

    useEffect(() => {
        message(error)
        clearError()
    }, [error, message, clearError])

    const changeHandler = event => {
        setFile(event.target.files[0])
    }

    const fileHandler = useCallback(async () => {
        try {
            const form = new FormData()
            form.append('file', file)
            const fetched = await request('/file/upload', 'POST', form, {
                Authorization: `Bearer ${accessToken}`
            })

            message(fetched.message)
        } catch (e) {}
    }, [accessToken, file, request, message])

    if (loading) {
        return <Loader />
    }

    return (
        <>
            {!loading && 
                <FileUpload nameBtn='Добавить' changeHandler={changeHandler} sendBtn={fileHandler} />
            }
        </>
    )
}