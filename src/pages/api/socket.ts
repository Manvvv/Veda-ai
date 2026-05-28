import { Server } from 'socket.io'
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const anyRes = res as any
  if (!anyRes.socket.server.io) {
    const io = new Server(anyRes.socket.server, {
      path: '/api/socket',
      addTrailingSlash: false,
      cors: { origin: '*' },
    })
    anyRes.socket.server.io = io
    io.on('connection', (socket) => {
      console.log('[WS] Client connected:', socket.id)
      socket.on('disconnect', () => console.log('[WS] Client disconnected:', socket.id))
    })
    console.log('[WS] Socket.io server initialized')
  }
  res.end()
}
