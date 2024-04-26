const peers = []
export default defineWebSocketHandler({
    open(peer) {
        console.log("[ws] open", peer);
        peers.push(peer)
    },
    message(peer, message) {
        console.log("[ws] message", peer, message);
        if (message.text().includes("ping")) {
            
            broadcast("pong");
        }
    },
    close(peer, event) {
        console.log("[ws] close", peer, event);
        const index = peers.indexOf(peer);
        if (index !== -1) {
            peers.splice(index, 1);
        }
    },
    error(peer, error) {
        console.log("[ws] error", peer, error);
    },
});

function broadcast(message) {
    peers.forEach(peer => {
        peer.send(message);
    });
}