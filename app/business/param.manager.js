import paramDAO from '../DAO/paramDAO';

function create(context) {

    async function query() {
        let result = paramDAO.query();
        if (result) {
            return result;
        }
     }

     async function get(id) {
        let result = await paramDAO.get(id);
        if (result) {
            return result;
        }
     }

     async function getLast() {
        let result = await paramDAO.getLast();
        if (result) {
            return result;
        }
     }     
     
     

    return {
        query:query,
        get:get,
        getLast
    };
}

export default {
    create: create
};
