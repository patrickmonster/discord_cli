const Dashbord = require('../src/Dashbord');
const Client = require('../src/Client');


// const client = new Client({

// });
Dashbord(null, {

}).then(dashboard => {

    dashboard.run(()=>{
        console.log("running dashboard");
    })
});
