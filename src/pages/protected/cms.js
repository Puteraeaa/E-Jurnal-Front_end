import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import Absen from '../../features/cms'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
    dispatch(setPageTitle({ title : "CMS Page"}))
      }, [])


    return(
        <Absen />
    )
}

export default InternalPage