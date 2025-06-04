import express from 'express'
const Router = express.Router()
import { columnValidation } from '~/validations/columnValidation'
import { columnController } from '~/controllers/columnController'


Router.route('/')
  .post(columnValidation.createNew, columnController.createNew)

Router.route('/:id')
  .put(columnValidation.update, columnController.update)
  .delete(columnValidation.deleteItem, columnController.deleteItem)


export const columnRoute = Router