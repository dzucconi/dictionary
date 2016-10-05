(function() {
  'use strict';

  var QUEUE = window.__QUEUE__;

  var DOM = {
    $html: $('html'),
    $window: $(window),
    $document: $(document),
    $stage: $('.js-stage')
  };

  var ENV = DOM.$html.data();
  var SPEED = ENV.speed;
  var DIRECTION = ENV.direction;
  var COLOR = ENV.color;

  function cutoff() {
    return DOM.$stage.offset().top;
  };

  function replenish() {
    return $.getJSON('/verse', { n: 50 }).then(function(lines) {
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
          if ($this.offset().top <= cutoff()) $this.remove();
          break;
        case 'down':
          if ($this.offset().top + $this.height() >= DOM.$window.height() - cutoff()) $this.remove();
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
    QUEUE.map(function() {
      next().then(function(line) {
        insert(DOM.$stage, line);
      });
    });

    run(DOM.$stage.attr('data-state', 'running'));
  });
})();

if (location.search.match('kiosk')) {
  var minutes = 180; // 3 hours
  setTimeout((function() {
    return location.reload();
  }), minutes * 60 * 1000);
}
