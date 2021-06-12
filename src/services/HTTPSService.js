const axios = require('axios');

export default class HTTPService {

    static async getRoutines() {
        return await axios.get('http://localhost:3000/routine/all');
        // .then(function (response) {
        //         // handle success
        //         console.log(response);
        //     })
        //     .catch(function (error) {
        //         // handle error
        //         console.log(error);
        //     })
    }
    
}