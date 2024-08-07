import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../features/common/headerSlice'
import Data from '../../../features/leads/DataIndustri'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Data Industri"}))
      }, [])


    return(
        <Data />
    )
}

export default InternalPage