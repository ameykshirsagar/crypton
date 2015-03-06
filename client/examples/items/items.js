
$(document).ready(function () {
  $('#username').focus();

  $('#userInput').submit(function (e) {
    e.preventDefault();
    var $btn = $(this).find('input[type=submit]:focus');
    var action = $btn.attr('value') || 'authorize';
    var username = $('#username').val();
    var passphrase = $('#password').val();
    actions[action](username, passphrase);
  });
});


actions = {};

actions.authorize = function (username, passphrase, callback) {
  setStatus('authorizing...');

  crypton.authorize(username, passphrase, function (err, session) {
    if (err) {
      setStatus(err);
      $('#userInput').show();
      $('#username').focus();
      return;
    }

    app.session = session;
    $('#userInput').hide();
    $('#username').val('');
    $('#password').val('');
    setStatus('logged in');
    // loadPhoto();
  });
}

actions.register = function (username, passphrase, callback) {
  setStatus('generating account...');

  crypton.generateAccount(username, passphrase, function (err, account) {
    if (err) {
      setStatus(err);
      $('#userInput').show();
      $('#username').focus();
      return;
    }

    setStatus('account generated');
    actions.authorize(username, passphrase);
  });
}

function createItem (name, value) {
  if (!name && !value) {
    throw new Error('Missing Args!');
  }
  var _item =
  new crypton.Item(name, value, app.session, app.session.createSelfPeer(),
  function callback(err, item) {
    console.log(err, item);
    if (err) {
      console.error(err);
      return;
    }
    return item;
  });
}

function getOrCreate(name) {
  app.session.getOrCreateItem(name, function _callback(err, item) {
    if (err) {
      console.error(err);
    }
    console.log(item);
  });
}

function updateItem(name, value) {
  if (!app.session.items[name]) {
    console.error('Item not found');
    return;
  }

  var item = app.session.items[name];
  item.value = value;
}

function setStatus (status) {
  var statusEl = document.getElementById('status');
  statusEl.innerHTML = status;
}

var app = {
  session: null,

  shareItem: function shareItem (itemName, peerName) {
    app.session.getOrCreateItem(itemName, function (err, item) {
      if (err) {
        console.error(err);
        return;
      }
      app.session.getPeer(peerName, function (err, peer) {
        if (err) {
          console.error(err);
          return;
        }
        console.log('sharing with: ', peer);
        item.share(peer, function (err, result) {
          if (err) {
            console.error(err);
            return;
          }
          console.log(result);
          console.log('Item shared successully!!!');
        });
      });
    });
  }
};
