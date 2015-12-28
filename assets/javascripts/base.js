(function() {
  'use strict';

  var QUEUE = [];
  var SPEED = 50;
  var CUTOFF = 50;
  var DOM = {
    $window: $(window),
    $document: $(document)
  };

  function replenish() {
    return $.getJSON('/verse').then(function(lines) {
      QUEUE = QUEUE.concat(lines);
      return QUEUE;
    });
  };

  function timeOf(line) {
    return line.length * SPEED;
  };

  function down($el) {
    ($el || DOM.$window).scrollTop(DOM.$document.height());
  };

  function trim() {
    return $('span').map(function() {
      var $this = $(this);
      if ($this.offset().top < CUTOFF) $this.remove();
    });
  };

  function append($el, line) {
    $el.append('<span>' + line + '</span>');
    down();
    trim();
  };

  function next() {
    var dfd = $.Deferred();

    var exec = function() {
      var line = QUEUE.pop();
      dfd.resolve(line);
    };

    if (!QUEUE.length) {
      replenish().then(exec).fail(dfd.reject);
    } else {
      exec();
    }

    return dfd.promise();
  };

  function run($el) {
    next().then(function(line) {
      append($el, line);
      setTimeout(run.bind(null, $el), timeOf(line));
    }).fail(function() {
      setTimeout(run.bind(null, $el), SPEED * 100);
    });
  }

  $(function() {
    run($('.js-stage'));
  });
})();
