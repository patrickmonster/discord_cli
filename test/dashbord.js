const Dashbord = require('../src/Dashbord');
const Client = require('../src/Client');


// const client = new Client({

// });
const dashboard = new Dashbord(null, {

});
dashboard.listen(3200, ()=>{
    console.log("start server 3200p");
})
