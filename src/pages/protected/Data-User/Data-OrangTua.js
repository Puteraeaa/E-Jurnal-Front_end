import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../features/common/headerSlice'
import Leads from '../../../features/leads/DataOrangTua/DataOrangTua'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Data Orang Tua"}))
      }, [])


    return(
        <Leads />
    )
}

export default InternalPage