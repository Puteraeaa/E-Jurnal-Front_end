import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../features/common/headerSlice'
import AddLaporan from '../../../features/Laporan/DetailLaporan'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Detail Laporan"}))
      }, [])


    return(
        <AddLaporan />
    )
}

export default InternalPage