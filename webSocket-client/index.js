const WebSocket = require('ws');
const ws = new WebSocket("ws://localhost:3000");

let id = 0
let logs = []
let end = true

function send(ws){
    setTimeout(() => {
        ws.send(`publish-acquire-${id}`)
    }, 1000);
}
ws.on('open',function(){
})

ws.on('message',function(msg){
    if(`${msg}` !== 'again')
        console.log(`${msg}`)
    let res = `${msg}`.split('-')
    if(res[0] === 'id')
        id = res[1]
    if(res[0] === 'acquire' || res[0] === 'release'){
        logs.push(`${msg}`)
    }
    else if(`${msg}` === '' || `${msg}` === 'again' ){
        setTimeout(()=>{
            send(ws)
        },3000)
    }
    if(`${msg}` === 'start backup logs'){
        end = false
    }
    if(`${msg}` === 'end backup logs')
    {
        end = true
        if(logs[logs.length-1].split('-')[0] === 'release' && Number(logs[logs.length-1].split('-')[1]) !== id){
            setTimeout(()=>{
                send(ws)
            },3000)
        }
    }
    else if(res[0] === 'release' && res[1] !== id && end){
        setTimeout(()=>{
            send(ws)
        },3000)
    }
})

