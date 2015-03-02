import client from './client';
import logger from 'winston';
import Q from 'q';

var helloWorldStoredProc = {
    id: "helloWorld",
    body: function () {
        var context = getContext();
        var response = context.getResponse();

        response.setBody("Hello, World");
    }
};

var createdStoredProcedure;

client.createStoredProcedureAsync(collection._self, helloWorldStoredProc)
    .then(function (response) {
        createdStoredProcedure = response.resource;
        console.log("Successfully created stored procedure");
        console.dir(createdStoredProcedure);
    }, function (error) {
        console.log("Error", error);
    });
