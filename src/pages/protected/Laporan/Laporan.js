import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../features/common/headerSlice'
import Laporan from '../../../features/Laporan/Index'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Laporan"}))
      }, [])


    return(
        <Laporan />
    )
}

export default InternalPage