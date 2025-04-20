import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import ProfileSettings from '../../features/settings/profilesettings/EditGuru'
function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Edit Profile Guru"}))
      }, [])


    return(
        <ProfileSettings />
    )
}

export default InternalPage