import { Router } from 'express'
import { getClients } from '../controllers/clients'

const clientsRouter = Router()

clientsRouter.get('/clients', getClients)

export default clientsRouter