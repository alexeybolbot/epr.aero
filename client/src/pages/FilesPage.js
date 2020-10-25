import React, { useCallback, useContext, useEffect, useState } from 'react'
import { FilesList } from '../components/FilesList'
import { FileUpload } from '../components/FileUpload'
import { Loader } from '../components/Loader'
import { AuthContext } from '../context/AuthContext'
import { useHttp } from '../hooks/http.hook'
import { useMessage } from '../hooks/message.hook'
import { Modal } from '../modal/Modal'

export const FilesPage = () => {
    const message = useMessage()
    const [isModal, setIsModal] = useState(false)
    const [idFile, setIdFile] = useState(null)
    const [file, setFile] = useState(null)
    const [files, setFiles] = useState([])
    const { loading, request, downloadRequest, error, clearError } = useHttp()
    const { accessToken } = useContext(AuthContext)

    useEffect(() => {
        message(error)
        clearError()
    }, [error, message, clearError])

    const deleteHandler = async (id) => {
        try {
            const fetched = await request(`/file/delete/${id}`, 'DELETE', null, {
                Authorization: `Bearer ${accessToken}`
            })

            if (fetched.message === 'Delete') {
                setFiles(files.filter(f => f.id !== id))
            }

            message(fetched.message)
        } catch (e) {}
    }

    const editHandler = async () => {
        try {
            const form = new FormData()
            form.append('file', file)
            const fetched = await request(`/file/update/${idFile}`, 'PUT', form, {
                Authorization: `Bearer ${accessToken}`
            })

            message(fetched.message)

            if (fetched.message === 'File update') {
                closeModal()
                fetchFiles()
            }
        } catch (e) {}
    }

    const downloadHandler = async (id, name) => {
        try {
            const fetched = await downloadRequest(`/file/download/${id}`, 'GET', name, {
                Authorization: `Bearer ${accessToken}`
            })

            if (fetched.message) {
                message(fetched.message)
            }
        } catch (e) {}
    }

    const fetchFiles = useCallback(async () => {
        try {
            const fetched = await request('/file/list', 'GET', null, {
                Authorization: `Bearer ${accessToken}`
            })

            setFiles(fetched.files)
        } catch (e) {}
    }, [accessToken, request])

    useEffect(() => {
        fetchFiles()
    }, [fetchFiles])

    const openModal = (id) => {
        setIdFile(id)
        setIsModal(true)
    }

    const closeModal = () => setIsModal(false) 

    const changeHandler = event => {
        setFile(event.target.files[0])
    }

    if (loading) {
        return <Loader />
    }

    return (
        <>
            {!loading && 
                <div>
                    <Modal title='Замена файла' isModal={isModal} closeModal={closeModal}>
                        <FileUpload nameBtn='Изменить' changeHandler={changeHandler} sendBtn={editHandler}/>
                    </Modal>
                    <FilesList files={files} deleteHandler={deleteHandler} downloadHandler={downloadHandler} openModal={openModal} />
                </div>
            }
        </>
    )
}