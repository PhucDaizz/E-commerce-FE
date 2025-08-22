import React, { useEffect } from 'react'
import UpdateInfor from '../../Components/UpdateInfor/UpdateInfor'
import { toast } from 'react-toastify'

const Profile = () => {
  useEffect(() => {
    notify()
  },[])

  const notify = () => {
    toast.warning('Nếu bạn là admin vui lòng nhập địa chỉ của shop');
  }

  return (
    <div>
      <UpdateInfor/>
      {/* <p className='container text-danger fw-bolder' style={{position: 'absolute', top: '87vh'}} >Nếu bạn là admin vui lòng nhập địa chỉ của shop</p> */}
    </div>
  )
}

export default Profile
