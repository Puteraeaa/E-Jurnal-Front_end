import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../features/common/headerSlice'
import AddLaporan from '../../../features/Laporan/Add-Laporan'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Rekap Absen"}))
      }, [])


    return(
        <AddLaporan />
    )
}

export default InternalPage