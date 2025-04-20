import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import ProfileSettings from '../../features/settings/profilesettings/EditIndustri'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Edit Profile Industri"}))
      }, [])


    return(
        <ProfileSettings />
    )
}

export default InternalPage