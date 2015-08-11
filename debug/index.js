'use strict';

var gc = require('google-client-api');
var googleClient = require('../index.js');

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
  google.calendarInsert({
    'summary': 'Test entry',
    'start': { date: '2015-08-11' },
    'end': { date: '2015-08-11' }
  }, (error, response) => {
    if (error) return console.log('Error inserting', error);
    console.log('Event created', response);
    var eventId = response.id;

    // Event updating
    google.calendarUpdate(eventId, {
      'summary': 'Updated entry',
      'start': { date: '2015-08-11' },
      'end': { date: '2015-08-17' }
    }, (err, res) => {
      if (err) return console.log('Error updating', err);
      console.log('Event updated', res);

      // Event deletion
      google.calendarDelete(eventId, (e, r) => {
          if (e) return console.log('Error deleting', e);
          console.log('Event deleted', r);
      });
    });
  });
});
