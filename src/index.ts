import http from 'http'
import express from 'express'
import dotenv from 'dotenv'
import * as bodyParser from 'body-parser'

import { sequelize } from './db'
import ProgramRouter from './routes/programs'
import ExerciseRouter from './routes/exercises'
import AuthRouter from './routes/auth'
import UserRouter from './routes/user'
import { localizationMiddleware } from './middleware/localizationMiddleware'

dotenv.config();

const app = express()

app.use(localizationMiddleware);

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/programs', ProgramRouter())
app.use('/exercises', ExerciseRouter())
app.use('/auth', AuthRouter()); 
app.use('/user', UserRouter()); 

const httpServer = http.createServer(app)

sequelize.sync()

console.log('Sync database', process.env.DB_URI)

httpServer.listen(8000).on('listening', () => console.log(`Server started at port ${8000}`))

export default httpServer
