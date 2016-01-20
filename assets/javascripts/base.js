(function() {
  'use strict';

  var QUEUE = window.__QUEUE__;
  var CUTOFF = 50;
  var DOM = {
    $html: $('html'),
    $window: $(window),
    $document: $(document)
  };

  var ENV = DOM.$html.data();

  var SPEED = ENV.speed;
  var DIRECTION = ENV.direction;
  var COLOR = ENV.color;

  function replenish() {
    return $.getJSON('/verse', { n: 10 }).then(function(lines) {
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
      var $this, bottom;

      $this = $(this);

      switch(DIRECTION) {
        case 'up':
          if ($this.offset().top <= CUTOFF) $this.remove();
          break;
        case 'down':
          if ($this.offset().top + $this.height() >= DOM.$window.height() - CUTOFF) $this.remove();
          break;
      };
    });
  };

  function append($el, line) {
    $el.append('<span>' + line + '</span>');
    down();
    trim();
  };

  function prepend($el, line) {
    $el.prepend('<span>' + line + '</span>');
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

  function insert($el, line) {
    switch(DIRECTION) {
      case 'up':
        append($el, line);
        break;
      case 'down':
        prepend($el, line);
        break;
    };
  }

  function run($el) {
    next().then(function(line) {
      insert($el, line);
      setTimeout(run.bind(null, $el), timeOf(line));
    }).fail(function() {
      setTimeout(run.bind(null, $el), SPEED * 100);
    });
  }

  $(function() {
    var $stage = $('.js-stage');

    QUEUE.map(function() {
      next().then(function(line) {
        insert($stage, line);
      });
    });

    run($stage.attr('data-state', 'running'));
  });
})();
