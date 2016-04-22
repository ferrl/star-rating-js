/**
 * Plugin starRating
 *
 * Renders a star based rating system from a jQuery object. It uses data
 * attributes to stores it data. All the attributes used:
 *
 *   	- data-sr-init: defines if the object has been initialized
 *   	- data-sr-value: defines the current value for the object
 *   	- data-sr-settings: defines custom settings for the star rating
 *   	- data-sr-index: defines the icon index
 *
 * The events thrown by the plugin are:
 *
 *   	- ready.ferrl.star_rating: when an object is initialized
 *   	- changed.ferrl.star_rating: when the object value changes
 */
$.fn.starRating = function(action, parameters) {
  "use strict";

  return this.each(function() {
    action = action || 'init';

    /**
     * All function of a star rating
     * @type {Object}
     */
    var functions = {
      /**
       * Stores plugin default settings.
       * @type {Object}
       */
      default_settings: {
        filledIcon: 'glyphicon glyphicon-star',
        outlineIcon: 'glyphicon glyphicon-star-empty',
        topLimit: 5,
      },

      /**
       * Initialize object
       * @param  {DOMElement} element
       * @return {void}
       */
      init: function(element) {
        if (element.getAttribute('data-sr-init')) {
          this.destroy(element);
        }

        var value = parseInt(element.innerHTML);

        element.setAttribute('data-sr-init', true);
        element.setAttribute('data-sr-value', value);

        this.render(element);
        this.bind(element);

        this.emit('ready', element);
      },

      /**
       * Destroy plugin
       * @param  {DOMElement} element
       * @return {void}
       */
      destroy: function(element) {
        var value = element.getAttribute('data-sr-value') || element.innerHTML;

        element.removeAttribute('data-sr-init');
        element.removeAttribute('data-sr-value');

        element.innerHTML = value;
      },

      /**
       * Update rating value
       * @param  {DOMElement} element
       * @param  {int} value
       * @return {void}
       */
      update: function(element, value) {
        element.setAttribute('data-sr-value', value);
        this.render(element);

        this.emit('changed', element, value);
      },

      /**
       * Bind events to the view.
       * @param  {DOMElement} element
       * @return {void}
       */
      bind: function(element) {
        element.addEventListener('click', function(event) {
          var value = event.target.getAttribute('data-sr-index');
          if (value) {
            value = value == element.getAttribute('data-sr-value') ? 0 : value;
            this.update(element, value);
          }
        }.bind(this));
      },

      /**
       * Load settings from data attribute.
       * @return {void}
       */
      settings: function(element, key) {
        var settings, specific;

        settings = this.default_settings;
        if ((specific = element.getAttribute('data-sr-settings')) !== null) {
          settings = $.extend(true, settings, JSON.parse(specific));
        } else if ((specific = window.StarRating_SETTINGS) !== null) {
          settings = $.extend(true, settings, specific);
        }

        if (key in settings) {
          return settings[key];
        }

        return settings;
      },

      /**
       * Render stars
       * @param  {DOMElement} element
       * @return {DOMElement}
       */
      render: function(element) {
        element.innerHTML = '';
        for (var i = 0; i < this.settings(element, 'topLimit'); i++) {
          var star, icon;

          icon = i < element.getAttribute('data-sr-value') ?
            this.settings(element, 'filledIcon') :
            this.settings(element, 'outlineIcon');
          star = document.createElement('i');
          star.setAttribute('data-sr-index', i + 1);
          star.className = icon;

          element.appendChild(star);
        }
      },

      /**
       * Emit an module event.
       * @param  {string} name
       * @return {void}
       */
      emit: function(name, element) {
        delete arguments[0];
        delete arguments[1];

        parameters = [];
        name = name + '.ferrl.star_rating';

        for (var key in arguments) {
          parameters.push(arguments[key]);
        }

        jQuery(element).trigger(name, parameters);
      }
    };

    functions[action].apply(functions, [this, parameters]);
  });
};
