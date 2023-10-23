/* eslint-disable react/prop-types */

const ActiveFriend = ({user,setCurrentFriend}) => {
  return (
       <div onClick={()=> setCurrentFriend({
          _id : user.userInfo.id,
          email: user.userInfo.email,
          image : user.userInfo.image,
          userName : user.userInfo.userName
       })} className='active-friend'>
            <div className='image-active-icon'>
                 {user}
                 <div className='__image'>
                 <img src={user.userInfo.image} alt='' />
                    <div className='active-icon'></div>
                 </div>

                
                 

            </div>

       </div>
  )
};

export default ActiveFriend;
