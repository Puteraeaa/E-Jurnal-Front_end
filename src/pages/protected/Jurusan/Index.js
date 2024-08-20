import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../features/common/headerSlice'
import Index from '../../../features/Jurusan/Index'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Data Jurusan"}))
      }, [])


    return(
        <Index />
    )
}

export default InternalPage