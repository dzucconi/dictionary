(function() {
  'use strict';

  var QUEUE = [];
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

  function play(line) {
    var $audio, $source;

    $audio = $('.js-audio');
    $source = $('.js-source');

    $source.attr('src', 'http://damonzucconi-synthetic-tongue.herokuapp.com/render?text=' + encodeURIComponent(line));
    $audio[0].load();
    $audio[0].play();
  };

  function run($el) {
    next().then(function(line) {
      if (location.search.indexOf('speak') > -1) play(line);

      switch(DIRECTION) {
        case 'up':
          append($el, line);
          break;
        case 'down':
          prepend($el, line);
          break;
      };
      setTimeout(run.bind(null, $el), timeOf(line));
    }).fail(function() {
      setTimeout(run.bind(null, $el), SPEED * 100);
    });
  }

  $(function() {
    trim();
    setTimeout(function() {
      run($('.js-stage').attr('data-state', 'running'));
    }, 1);
  });
})();
