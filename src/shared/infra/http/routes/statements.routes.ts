import { Router } from 'express';

import { CreateStatementController } from '../../../../modules/statements/useCases/createStatement/CreateStatementController';
import { GetBalanceController } from '@modules/statements/useCases/getBalance/GetBalanceController';
import { GetStatementOperationController } from '@modules/statements/useCases/getStatementOperation/GetStatementOperationController';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { CreateTransferController } from '@modules/statements/useCases/createTransfer/CreateTransferController';

const statementRouter = Router();
const getBalanceController = new GetBalanceController();
const createStatementController = new CreateStatementController();
const getStatementOperationController = new GetStatementOperationController();
const createtransferController = new CreateTransferController();

statementRouter.use(ensureAuthenticated);

statementRouter.get('/balance', getBalanceController.execute);
statementRouter.post('/deposit', createStatementController.execute);
statementRouter.post('/withdraw', createStatementController.execute);
statementRouter.post('/transfers/:receiver_id', createtransferController.execute);
statementRouter.get('/:statement_id', getStatementOperationController.execute);

export { statementRouter };
