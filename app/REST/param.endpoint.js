import business from '../business/business.container';
import applicationException from "../service/applicationException";

const paramEndpoint = (router) => {
    router.get('/api/params', async (request, response, next) => {
        try {
            let result = await business.getParamManager().query();
            response.status(200).send(result);
        } catch (error) {
            applicationException.errorHandler(error, response);
        }
     });

     router.get('/api/params/last', async (request, response, next) => {
        try {
            let result = await business.getParamManager().getLast();
            response.status(200).send(result);
        } catch (error) {
            applicationException.errorHandler(error, response);
        }
     });  

     router.get('/api/params/:id', async (request, response, next) => {
        try {
            let result = await business.getParamManager().get(request.params.id);
            response.status(200).send(result);
        } catch (error) {
            applicationException.errorHandler(error, response);
        }
     });

   
};
export default paramEndpoint;
