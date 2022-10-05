const WebSocket = require('ws');

let logs = []
let clients = []
let flag = true

const ws = new WebSocket.Server({
    port: process.env.PORT
})

ws.on('connection',function(Socket){
    console.log('cliente conectado')
    clients.push(clients.length+1)
    Socket.send(`id-${clients[clients.length-1]}`);
    if(logs.length){
        Socket.send('start backup logs')
        logs.forEach(function(log){
            if(log.split('-')[1] === 'acquire')
                Socket.send(`${log.split('-')[1]}-${log.split('-')[2]}`)
            else{
                Socket.send(`${log.split('-')[0]}-${log.split('-')[1]}`)
            }
        })
        Socket.send('end backup logs')
    }
    else{
        Socket.send('')
    }

    Socket.on('message', function(msg){
        if(flag){
            flag = false
            logs.push(`${msg}`)
            ws.clients.forEach(function(client){
                client.send('acquire-'+logs[logs.length-1].split('-')[2].toString())
            })
            setTimeout(() => {
                console.log(logs[logs.length-1])
                const release = 'release-'+logs[logs.length-1].split('-')[2]
                logs.push(release)
                ws.clients.forEach(function(client){
                    client.send(release)
                })
                flag = true
            },2000);
        }
        else{
            Socket.send('again')
        }
    })
})

