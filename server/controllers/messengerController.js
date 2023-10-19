const User = require('../models/User');
const Message = require('../models/Message');
const formidable = require('formidable');
const fs = require('fs');


const getLastMessage = async(myId, fdId) => {
     const msg = await Message.findOne({
          $or: [{
               $and: [{
                    senderId : {
                        $eq: myId
                    }
               },{
                    receiverId : {
                        $eq : fdId 
                    }
               }]
          }, {
               $and : [{
                    senderId : {
                         $eq : fdId
                    } 
               },{
                    receiverId : {
                         $eq : myId
                    }
               }]
          }]

     }).sort({
          updatedAt : -1
     });
     return msg;
}

module.exports.getFriends = async (req, res) => {
     const myId = req.user.userId;
     let fnd_msg = [];
     try{
          const friendGet = await User.find({
               _id: {
                   $ne: myId
               }
          });
          for (let i = 0; i < friendGet.length; i++ ){
               let lmsg = await getLastMessage(myId,friendGet[i].id);
               fnd_msg = [...fnd_msg, {
                    fndInfo : friendGet[i],
                    msgInfo : lmsg
               }]
               
          }

          // const filter = friendGet.filter(d=>d.id !== myId );
          res.status(200).json({success:true, friends : fnd_msg})

     }catch (error) {
          res.status(500).json({
               error: {
                    errorMessage :'Internal Sever Error'
               }
          })
     } 
}

module.exports.messageUploadDB = async (req, res) =>{

     const {
          senderName,
          receiverId,
          message
     } = req.body
     const senderId = req.user.userId;

     try{
          const insertMessage = await Message.create({
               senderId : senderId,
               senderName : senderName,
               receiverId : receiverId,
               message : {
                    text: message,
                    image : ''
               }
          })
          res.status(201).json({
               success : true,
               message: insertMessage
          })

     } catch (error) {
          console.log(error);
          res.status(500).json({
               error: {
                    errorMessage : 'Internal Sever Error'
               }
          })
     }

     
}
module.exports.messageGet = async(req,res) => {
     const myId = req.user.userId;
     const fdId = req.params.id;

     try{
          let getAllMessage = await Message.find({
               
               $or: [{
                    $and: [{
                         senderId : {
                             $eq: myId
                         }
                    },{
                         receiverId : {
                             $eq : fdId 
                         }
                    }]
               }, {
                    $and : [{
                         senderId : {
                              $eq : fdId
                         } 
                    },{
                         receiverId : {
                              $eq : myId
                         }
                    }]
               }]
          })
          
          // getAllMessage = getAllMessage.filter(m=>m.senderId === myId && m.receiverId === fdId || m.receiverId ===  myId && m.senderId === fdId );
          
          res.status(200).json({
               success: true,
               message: getAllMessage
          })

     }catch (error){
          res.status(500).json({
               error: {
                    errorMessage : 'Internal Server error'
               }
          })

     }
      
}


module.exports.ImageMessageSend = (req,res) => {
     const senderId = req.user.userId;
     const form = formidable();

     form.parse(req, (err, fields, files) => {
          const {
              senderName,
              receiverId,
              imageName 
          } = fields;

          const newPath = __dirname + `../../client/public/image/${imageName}`
          files.image.originalFilename = imageName;

          try{
               fs.copyFile(files.image.filepath, newPath, async (err)=>{
                    if (err) {
                         console.log(err);
                         res.status(500).json({
                              error : {
                                   errorMessage: 'Image upload fail'
                              }
                         })
                    } else{
                         const insertMessage = await Message.create({
                              senderId : senderId,
                              senderName : senderName,
                              receiverId : receiverId,
                              message : {
                                   text: '',
                                   image : files.image.originalFilename
                              }
                         })
                         res.status(201).json({
                              success : true,
                              message: insertMessage
                         })

                    }
               } )

          } catch (error) {
               console.log(error);
               res.status(500).json({
                    error : {
                         errorMessage: 'Internal Sever Error'
                    }
               })

          }


     })
}

module.exports.messageSeen = async (req,res) => {
     const messageId = req.body._id;

     await Message.findByIdAndUpdate(messageId, {
         status : 'seen' 
     })
     .then(() => {
          res.status(200).json({
               success : true
          })
     }).catch(() => {
          res.status(500).json({
               error : {
                    errorMessage : 'Internal Server Error'
               }
          })
     })
}


module.exports.deliveredMessage = async (req,res) => {
     const messageId = req.body._id;

     await Message.findByIdAndUpdate(messageId, {
         status : 'delivered' 
     })
     .then(() => {
          res.status(200).json({
               success : true
          })
     }).catch(() => {
          res.status(500).json({
               error : {
                    errorMessage : 'Internal Server Error'
               }
          })
     })
}