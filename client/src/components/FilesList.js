import moment from 'moment'
import React from 'react'

export const FilesList = ({ files, deleteHandler, downloadHandler, openModal }) => {
    if (!files.length) {
        return <div className="row"><h4>Файлы отсутствуют</h4></div>
    }
    
    return (
        <table>
            <thead>
            <tr>
                <th>Название</th>
                <th>Расширение</th>
                <th>Размер</th>
                <th>Дата загрузки</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
            { files.map(file => {
                return (
                    <tr key={file.id}>
                        <td>{file.name}</td>
                        <td>{file.extension}</td>
                        <td>{file.size}</td>
                        <td>{moment(file.date).format('LTS')}</td>
                        <td>
                            <span className="waves-effect green btn-small mr10" onClick={()=>downloadHandler(file.id, file.name)}>Скачать</span>
                            <span className="waves-effect orange btn-small mr10" onClick={()=>openModal(file.id)}>Редактировать</span>
                            <span className="waves-effect red btn-small" onClick={()=>deleteHandler(file.id)}>Удалить</span>
                        </td>
                    </tr>
                )
            }) }    
            </tbody>
        </table>
    )
}