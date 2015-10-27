'use strict';

var tape = require('tape');
var gc = require('google-client-api');
var googleClient = require('../index.js');

var eventId;

gc().then((gapi) => {
  gapi.client.setApiKey(process.env.APIKEY);

  var google = new googleClient({
    apiKey: process.env.APIKEY,
    calendar: process.env.CALENDAR,
    scope: process.env.SCOPE,
    email: process.env.EMAIL,
    client: process.env.CLIENT
  });

  // Event Insertion
  tape('calendar insertion', (t) => {
    google.calendarInsert({
      'summary': 'Test entry',
      'start': { date: '2015-08-11' },
      'end': { date: '2015-08-11' }
    }, (err, res) => {
      eventId = res.id;
      t.notOk(err);
      t.ok(res, 'entry created');
      t.end();
    });
  });

  if (eventId) {
    tape('calendar updating', (t) => {
      google.calendarUpdate(eventId, {
        'summary': 'Updated entry',
        'start': { date: '2015-08-11' },
        'end': { date: '2015-08-17' }
      }, (err, res) => {
        t.notOk(err, 'No Error');
        t.ok(res, 'entry updated');
        t.end();
      });
    });

    tape('calendar deletion', (t) => {
      google.calendarDelete(eventId, (err, res) => {
        t.notOk(err, 'No Error');
        t.ok(res, 'entry deleted');
        t.end();
      });
    });
  }

  // Close the smokestack window once tests are complete
  tape('shutdown', function(t) {
    t.end();
    setTimeout(function() {
      window.close();
    });
  });
});
