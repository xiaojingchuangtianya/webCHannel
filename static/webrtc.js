var websocket;
//随机数
function randomNum(minNum,maxNum){
    switch(arguments.length){
        case 1:
            return parseInt(Math.random()*minNum+1,10);
            break;
        case 2:
            return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10);
            break;
        default:
            return 0;
            break;
    }
}
const userid = 'user' + randomNum(0,100000);


var yourVideo = document.getElementById("yours");
var theirVideo = document.getElementById("him");
var Connection;


function startPeerConnection() {
    //return;
    var config = {
        'iceServers': [
            //{ 'urls': 'stun:stun.xten.com:3478' },
            //{ 'urls': 'stun:stun.voxgratia.org:3478' },
            { 'url': 'stun:stun.l.google.com:19302' }
        ]
    };
    config = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:global.stun.twilio.com:3478?transport=udp' }
        ],
    };

    Connection = new RTCPeerConnection(config);
    Connection.onicecandidate = function(e) {
        console.log('onicecandidate');
        if (e.candidate) {
            websocket.send(JSON.stringify({
                "userid":userid,
                "event": "_ice_candidate",
                "data": {
                    "candidate": e.candidate
                }
            }));
        }
    }
    Connection.onaddstream = function(e) {
        console.log('onaddstream');

        //theirVideo.src = window.URL.createObjectURL(e.stream);
        theirVideo.srcObject = e.stream;
    }
}


createSocket();
startPeerConnection();

function f() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
            yourVideo.srcObject = stream;
            yourVideo.play();
            window.stream = stream;
            Connection.addStream(stream);
        })
        .catch(err => {
            console.log(err);
        })
}


function createOffer(){
    //发送offer和answer的函数，发送本地session描述
    Connection.createOffer()
        .then(offer => {
        Connection.setLocalDescription(offer);
        websocket.send(JSON.stringify({
            "userid":userid,
            "event": "offer",
            "data": {
                "sdp": offer
            }
        }));
    });
}



function createSocket(){
    var user = Math.round(Math.random()*1000) + ""
    websocket = new WebSocket("ws://"+window.location.host+"/ws/chat/lin/");
    eventBind();
};
function eventBind() {
    //连接成功
    websocket.onopen = function(e) {
        console.log('连接成功')
    };
    //server端请求关闭
    websocket.onclose = function(e) {
        console.log('close')
    };
    //error
    websocket.onerror = function(e) {

    };
    //收到消息
    websocket.onmessage = (event)=> {
        if(event.data == "new user") {
            location.reload();
        } else {
            var json = JSON.parse(event.data);
            console.log('onmessage: ', json);
            if(json.userid !=userid){
                //如果是一个ICE的候选，则将其加入到PeerConnection中，否则设定对方的session描述为传递过来的描述
                if(json.event === "_ice_candidate"&&json.data.candidate) {
                    Connection.addIceCandidate(new RTCIceCandidate(json.data.candidate));
                }else if(json.event ==='offer'){
                    Connection.setRemoteDescription(json.data.sdp);
                    Connection.createAnswer().then(answer => {
                        Connection.setLocalDescription(answer);
                        console.log(window.stream)
                        websocket.send(JSON.stringify({
                            "userid":userid,
                            "event": "answer",
                            "data": {
                                "sdp": answer
                            }
                        }));
                    })
                }else if(json.event ==='answer'){
                    Connection.setRemoteDescription(json.data.sdp);
                    console.log(window.stream)
                }
            }
        }
    };
}
