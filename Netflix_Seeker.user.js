// ==UserScript==
// @name            Netflix Seeker
// @namespace       http://tampermonkey.net/
// @copyright       2017, Yasin Uslu (http://nepjua.org)
// @license         MIT; https://opensource.org/licenses/MIT
// @homepageURL     https://github.com/yasinuslu/userscripts
// @icon            https://www.netflix.com/favicon.ico
// @updateURL       https://openuserjs.org/meta/yasinuslu/Netflix_Seeker.meta.js
// @version         0.0.7
// @description     Allows you to easily fast-forward, fast-backward with arrow keys in netflix player
// @author          yasinuslu
// @match           https://www.netflix.com/watch/*
// ==/UserScript==

(function() {
  function createNetflixSeeker() {
    const DEFAULT_SEEK_AMOUNT = 5;
    const PROGRESS_CONTROL_SELECTOR =
      ".PlayerControls--control-element.progress-control";
    const ARROW_LEFT_KEYCODE = 37;
    const ARROW_RIGHT_KEYCODE = 39;

    const options = {
      seekAmount: DEFAULT_SEEK_AMOUNT
    };

    // Credits to Venryx @ https://stackoverflow.com/questions/29321742/react-getting-a-component-from-a-dom-element-for-debugging
    function findReact(dom) {
      for (var key in dom) {
        if (key.startsWith("__reactInternalInstance$")) {
          var compInternals = dom[key]._currentElement;
          var compWrapper = compInternals._owner;
          var comp = compWrapper._instance;
          return comp;
        }
      }
      return null;
    }

    function getReactFromSelector(selector) {
      const elems = document.querySelectorAll(selector);
      return elems.length > 0 ? findReact(elems[0]) : null;
    }

    function getPlayer() {
      const comp = getReactFromSelector(PROGRESS_CONTROL_SELECTOR);
      return comp ? comp.props.player : null;
    }

    function fastForward(seconds) {
      const player = getPlayer();
      if (!player) {
        return;
      }

      player.seek(player.getCurrentTime() + seconds);
    }

    function onKeyDown(e) {
      if ([ARROW_LEFT_KEYCODE, ARROW_RIGHT_KEYCODE].indexOf(e.keyCode) < 0) {
        return;
      }

      e.stopPropagation();

      if (e.keyCode === ARROW_LEFT_KEYCODE) {
        fastForward(-options.seekAmount);
      } else if (e.keyCode === ARROW_RIGHT_KEYCODE) {
        fastForward(options.seekAmount);
      }
    }

    function startCapturing() {
      window.addEventListener("keydown", onKeyDown, true);
    }

    function stopCapturing() {
      window.removeEventListener("keydown", onKeyDown, true);
    }

    function destroy() {
      stopCapturing();
    }

    startCapturing();

    return {
      startCapturing,
      stopCapturing,
      getPlayer,
      fastForward,
      options,
      destroy
    };
  }

  createNetflixSeeker();
})();