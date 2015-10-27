'use strict';

import xhr from 'xhr';

function googleClient(opts) {
  var client = {};

  if (!opts.apiKey || !opts.scope || !opts.client) {
    throw new Error('Missing required options');
  }

  function loadCal(cb) {
    var auth = {
      client_id: opts.client,
      scope: opts.scope,
      immediate: true
    };

    gapi.auth.init(() => {
      gapi.auth.authorize(auth, (res) => {
        if (res.error) {
          client.auth((err) => {
            if (err) return cb(err);
            gapi.client.load('calendar', 'v3', () => cb(null));
          });
        } else {
          gapi.client.load('calendar', 'v3', () => cb(null));
        }
      });
    });
  }

  /**
   * Authenticates with a Google App
   *
   * @param {Function} cb Function that is called after request execution
   */
  client.auth = function(cb) {
    gapi.auth.authorize({
      client_id: opts.client,
      scope: opts.scope,
      immediate: false
    }, (res) => {

      // Test the validity of the email authorized
      gapi.client.load('oauth2','v2', () => {
        gapi.client.oauth2.userinfo.get().execute((resp) => {
          if (resp.error) {
            cb('Failed to authorize with Google');
            return;
          }

          // Revoke via xhr (There's no supported gapi method.)
          if (opts.email && resp.email.toLowerCase() !== opts.email.toLowerCase()) {
            xhr({
              uri: 'https://accounts.google.com/o/oauth2/revoke?token=' + gapi.auth.getToken().access_token
            }, () => {
              cb('The email you authorized did not match ' + opts.email + '. Please try again.');
            });

          } else {
            cb(null, res);
          }
        });
      });
    });
  };

  /**
   * Inserts a calendar entry
   *
   * @param {Object} resource A resource object as documented here: https://goo.gl/z8bFhX
   * @param {Function} cb Function that is called after request execution
   */
  client.calendarInsert = function(resource, cb) {
    loadCal((err) => {
      if (err) return cb(err);
      var request = gapi.client.calendar.events.insert({
        'calendarId': opts.calendar,
        'resource': resource
      });
      request.execute((res) => cb(null, res));
    });
  };

  /**
   * Updates a calendar entry
   *
   * @param {String} eventId eventId for an existing calendar entry
   * @param {Object} resource A resource object as documented here: https://goo.gl/z8bFhX
   * @param {Function} cb Function that is called after request execution
   */
  client.calendarUpdate = function(eventId, resource, cb) {
    loadCal((err) => {
      if (err) return cb(err);
      var request = gapi.client.calendar.events.update({
        'calendarId': opts.calendar,
        'eventId': eventId,
        'resource': resource
      });
      request.execute((res) => cb(null, res));
    });
  };

  /**
   * Deletes a calendar entry
   *
   * @param {String} eventId eventId for an existing calendar entry
   * @param {Function} cb Function that is called after request execution
   */
  client.calendarDelete = function(eventId, cb) {
    loadCal((err) => {
      if (err) return cb(err);
      var request = gapi.client.calendar.events.delete({
        'calendarId': opts.calendar,
        'eventId': eventId
      });
      request.execute((res) => cb(null, res));
    });
  };

 return client;
}

if (typeof module !== 'undefined') module.exports = googleClient;
