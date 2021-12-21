/**
 * webSocket.readyState
 * CONNECTING：值为0，表示正在连接。
 * OPEN：值为1，表示连接成功，可以通信了。
 * CLOSING：值为2，表示连接正在关闭。
 * CLOSED：值为3，表示连接已经关闭，或者打开连接失败
 *
 */
export class WebsocketConnect{
  constructor(url, onmessage) {
    if(!url || !(typeof url === 'string')){
      throw new Error('illegal url')
    }else{
      this.url = (location.origin + url).replace('http', 'ws');
    }
    this.websocket = {};
    if(typeof onmessage === 'function'){
      this.onmessage = onmessage;
    }
    this.connect();
  }

  /**
   * 连接
   */
  connect(){
    try {
      this.websocket = new WebSocket(this.url);
      this.websocket.onopen = this.onopen;
      this.websocket.onerror = this.onerror;
      this.websocket.onclose = this.onclose.bind(this);
      this.websocket.onmessage = this.onmessage;
    }catch (e){
      console.log(`${this.url} connect failed`);
    }

  }

  /**
   * 连接成功
   */
  onopen(){
    console.log(`${this.url} connect success`);
  }

  /**
   * 连接错误
   */
  onerror(){
    console.log(`${this.url} connect error`);
  }

  /**
   * 连接断开
   */
  onclose(){
    console.log(`${this.url} connect close`, this.websocket);
    setTimeout(() => this.connect(), 1000);
  }

  /**
   * 发送消息
   * @param message
   */
  sendMsg(message){
    if(this.websocket && this.websocket.readyState === 1){
      this.websocket.send(message);
    }else if(this.websocket.readyState === 0){
      this.connecting(message);
    }
  }

  /**
   * 正在建立连接时发送数据，需要重发
   * @param message
   */
  connecting(message){
    setTimeout(() => {
      if (this.websocket.readyState === 0) {
        this.connecting(message);
      } else {
        this.websocket.send(message);
      }
    }, 1000)
  }

  /**
   * 关闭连接
   */
  close(){
    this.websocket.close();
  }
}
