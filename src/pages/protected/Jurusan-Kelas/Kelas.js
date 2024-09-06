import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../features/common/headerSlice'
import Index from '../../../features/Kelas/Index'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Data Kelas"}))
      }, [])


    return(
        <Index />
    )
}

export default InternalPage