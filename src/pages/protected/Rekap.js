import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import Absen from '../../features/Absen/Rekap'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Rekap Absen"}))
      }, [])


    return(
        <Absen />
    )
}

export default InternalPage