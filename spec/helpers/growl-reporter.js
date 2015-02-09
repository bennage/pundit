var growly = require('growly');

console.log('growly');

growly.register('Jasmine', '', [], function(error) {
  var warning = 'No running version of GNTP found.\n' +
                'Make sure the Growl service is installed and running.\n' +
                'For more information see https://github.com/theabraham/growly.';
  if (error) {
    console.log(warning);
  }
});


console.dir(growly);
console.dir(growly.notify);


class GrowlReporter {

    constructor (notify) {
        this.timer = new jasmine.Timer();

        this.specCount = 0;
        this.pendingCount = 0;
        this.failureCount = 0;
        // this.notify = notify || ()=>{};
    }

    jasmineStarted () {
        this.specCount = 0;
        this.pendingCount = 0;
        this.failureCount = 0;
        this.timer.start();
    }

    jasmineDone () {
        var seconds = this.timer.elapsed() / 1000;

        // TODO: This isn't executing
        // https://github.com/jasmine/jasmine-npm/issues/23
        growly.notify('final report goes here', { sticky: true });
     }

    specDone (result) {

        this.specCount++;

        if (result.status === 'pending') {
            this.pendingCount++;
        } else if (result.status === 'failed') {
            this.failureCount++;

            growly.notify(result.fullName, { title: result.status, sticky: true, priority: 100 });
            // console.dir(result);
        }
    }

    suiteDone (result) {

        if (result.failedExpectations && result.failedExpectations.length > 0) {
            this.failureCount++;
        }

        // growly.notify('suiteDone');
    }
}

jasmine.getEnv().addReporter(new GrowlReporter());
