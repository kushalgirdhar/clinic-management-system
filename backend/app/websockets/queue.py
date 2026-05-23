from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.websockets.connection_manager import manager

router = APIRouter()

@router.websocket("/ws/queue")
async def queue_websocket(websocket: WebSocket):
    await manager.connect(websocket)
    print(f"🔌 WebSocket connected from: {websocket.client.host}")
    try:
        while True:
            data = await websocket.receive_text()
            print(f"📨 Message received from client: {data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        print(f"🔴 WebSocket client disconnected")
        