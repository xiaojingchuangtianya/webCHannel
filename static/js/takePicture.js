//摄像设置
var settings={
    audio:false,
    video:{
        frameRate:{ideal:10,max:15},
        width:640,
        height:360,
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
        var video =document.getElementById("video");
        video.srcObject =stream;
        video.onloadedmetadata =function (e){
            video.play();
        }
    })
    .catch(function (error) {
    //    处理获取不到流的情况
        console.log(error.name +":"+error.message);
    })

function takePhoto() {
    var video =document.getElementById("video");
    var img =document.getElementById("image");
    var canvas =document.createElement("canvas");
    canvas.width =video.videoWidth;
    canvas.height =video.videoHeight;
    canvas.getContext('2d').drawImage(video,0,0,canvas.width,canvas.height);

    img.value=canvas.toDataURL("image/png");
    console.log(canvas.toDataURL("img/png"));
}
