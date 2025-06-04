import express from 'express'
const Router = express.Router()
import { cardValidation } from '~/validations/cardValidation.js'
import { cardController } from '~/controllers/cardController.js'


Router.route('/')
  .post(cardValidation.createNew, cardController.createNew)
export const cardRoute = Router