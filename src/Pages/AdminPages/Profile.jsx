import React from 'react'
import UpdateInfor from '../../Components/UpdateInfor/UpdateInfor'

const Profile = () => {
  return (
    <div>
      <UpdateInfor/>
      <p className='container text-danger fw-bolder' style={{position: 'absolute', top: '60vh'}} >Nếu bạn là admin vui lòng nhập địa chỉ của shop</p>
    </div>
  )
}

export default Profile
