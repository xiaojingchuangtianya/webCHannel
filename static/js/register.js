//视频开启,截获图片
//摄像设置

var settings={
    audio:false,
    video:{
        frameRate:{ideal:10,max:15},
    }
};



if(navigator.mediaDevices.getUserMedia === undefined){
    navigator.mediaDevices.getUserMedia = function(settings) {
    //适应旧版本浏览器
    var getUserMedia =navigator.mediaDevices.getUserMedia ||
                          navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia;
        if (!getUserMedia){
            return Promise.reject(new Error("你的摄像头或语音权限无法获取,请使用FireFox,Chrome和尽可能高版本的浏览器"))
        }
        return new Promise(function (resolve,reject) {
            getUserMedia.call(navigator,settings,resolve,reject)
        });
    };
}

navigator.mediaDevices.getUserMedia(settings)
    .then(function (stream) {
        var video =document.getElementById("photo");
        video.srcObject =stream;
        video.onloadedmetadata =function (e){
            video.play();
        }
    })
    .catch(function (error) {
    //    处理获取不到流的情况
        console.log(error.name +":"+error.message);
    })

var takePic=false;
var postBase64=null;

function takePhoto() {
    takePic =true;
    var video =document.getElementById("photo");
    video.pause();
    var canvas =document.createElement("canvas");

    canvas.width =video.videoWidth;
    canvas.height =video.videoHeight;
    canvas.getContext('2d').drawImage(video,0,0,canvas.width,canvas.height);

    var postImg= document.getElementById("postImg");
    postBase64 =canvas.toDataURL("image/png").split(",")[1]
    postImg.value =canvas.toDataURL("image/png");
}

