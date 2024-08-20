import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import RekapNilai from '../../features/rekapnilai/RekapNilai'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Rekap Nilai"}))
      }, [])


    return(
        <RekapNilai />
    )
}

export default InternalPage