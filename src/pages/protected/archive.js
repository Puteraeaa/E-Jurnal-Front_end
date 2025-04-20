import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import Archive from '../../features/Archive/index'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Archive Data Siswa PKL"}))    
      }, [])


    return(
        <Archive />
    )
}

export default InternalPage