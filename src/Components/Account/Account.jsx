import React, { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../Context/AuthContext'

const Account = () => {
  const location = useLocation()
  const {getInforUser} = useAuth()
  const [inforUser, setInforUser] = useState({});

  const hiddenRoutes = [
    '/account/reset'
  ];

  const isHidden = hiddenRoutes.includes(location.pathname);

  useEffect(() => {
    gertin()
  }, [])

  const gertin = async() => {
    const response = await getInforUser();
    setInforUser(response);
  }


  return (
    <div className='account'>
      {!isHidden && (  
        <div className='container' style={{height: '80vh'}}>
          <div className="row">
            <div className=" col-10">
              <h3 className='mt-5'>Thông tin tài khoản</h3>
              <p>Xin chào, {inforUser.userName}</p>
              <p className='mt-3'>Đơn hàng gần nhất của bạn</p>
            </div>



            <div className="col">
              <p className='mt-5'>sdsfjkdsfhjk</p>
            </div>

            
          </div>
          





        </div>
      )}
      <Outlet /> 
    </div>
  )
}

export default Account
