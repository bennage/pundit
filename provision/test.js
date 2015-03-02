import client from './client';

client.executeStoredProcedureAsync(createdStoredProcedure._self)
    .then(function (response) {
        console.log(response.result); // "Hello, World"
    }, function (err) {
        console.log("Error", error);
    });
