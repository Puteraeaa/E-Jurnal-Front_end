import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../features/common/headerSlice'
import Leads from '../../../features/leads/DataGuru/DataGuru'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Data Guru"}))
      }, [])


    return(
        <Leads />
    )
}

export default InternalPage