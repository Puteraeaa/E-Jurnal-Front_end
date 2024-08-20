import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../features/common/headerSlice'
import Data from '../../../features/leads/DataSiswa/DataSiswa'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Data Siswa/i"}))
      }, [])


    return(
        <Data />
    )
}

export default InternalPage