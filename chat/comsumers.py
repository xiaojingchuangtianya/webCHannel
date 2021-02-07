import json
from channels.generic.websocket import WebsocketConsumer,AsyncWebsocketConsumer
from asgiref.sync import async_to_sync
#Websocket消费者,接受所有连接,接收信息,返回到页面
class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print("新增连接")
        #读取路由的参数
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name
        #以房间名为群组名,新建群组
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, code):
        print("断开连接")
        #断开群组连接
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data=None, bytes_data=None):
        #接受到前端发回的信息,进行处理,这里是群组分发
        text_data_json =json.loads(text_data)
        print(text_data_json)
        # message =text_data_json["message"]
        # #接受到信息后,将信息发送到群组
        await self.channel_layer.group_send(
            self.room_group_name,{
                "type":"chat",
                "message":text_data_json.get("message"),
                "userid": text_data_json.get("userid"),
                "event": text_data_json.get("event"),
                "data": text_data_json.get("data"),
            }
        )

    async def chat(self,event):

        # print("websocket接受:"+str(event))
        message=event["message"]
        #发送信息到websocket
        await self.send(text_data=json.dumps({
            "message":message,
            "userid": event.get("userid"),
            "event": event.get("event"),
            "data": event.get("data"),
        }))
