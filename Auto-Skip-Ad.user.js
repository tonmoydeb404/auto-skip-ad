// ==UserScript==
// @name         Auto Skip Ad
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  automatic skip youtube ads!
// @author       tonmoydeb404
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @downloadURL  https://github.com/tonmoydeb404/auto-skip-ad/raw/main/Auto-Skip-Ad.user.js
// @updateURL    https://github.com/tonmoydeb404/auto-skip-ad/raw/main/Auto-Skip-Ad.user.js
// @grant        none
// ==/UserScript==

/*
#	Title : Auto Skip Ad
#	Description : automatic skip youtube ads!
#	Author : Tonmoy Deb (tonmoydeb404@gmail.com)
#	Date : 17/10/2023
*/

(function () {
  "use strict";

  // constant values.
  const AD_CLASS = "ad-showing";
  const SKIP_TIME = 5000;

  /**
   * get the video element
   * @returns {Element}
   */
  const getVideoElem = () => document.querySelector("video.html5-main-video");

  /**
   * Automatic AD handler: Mute AD, Skip AD
   * @param {Element} media
   */
  const adHandler = (media) => {
    // movie player element
    const moviePlayer = document.querySelector("#movie_player");

    // check Ad is currently playing or not
    if (moviePlayer.classList.contains(AD_CLASS)) {
      // mute the ad
      media.muted = true;

      // waiting to click skip button
      setTimeout(() => {
        // make sure skip button is available & not disabled
        const skipBtn = document.querySelector("button.ytp-ad-skip-button");
        if (!skipBtn) return;

        // skip the ad
        skipBtn.click();
      }, SKIP_TIME);
    } else {
      // unmute video
      media.muted = false;
    }
  };

  /**
   * check url contains "youtube.com/watch" string or not
   * @param {string} url
   * @returns {Boolean}
   */
  const urlChecker = (url) => url.includes("youtube.com/watch");

  /**
   * Detect page url change and update video event listener
   */
  const observeUrlChange = () => {
    // variable for previous url. initially it will be undefined
    let prev_url = undefined;

    const observer = new MutationObserver((_mutations) => {
      const current_url = document.location.href;

      // check previous url and check url changed or not
      if (prev_url && prev_url === current_url) return;

      // if url changed then update the previous url
      prev_url = current_url;

      if (!urlChecker(current_url)) return;

      // add event listener to the video
      const mainVideo = getVideoElem();
      if (!mainVideo) return;
      mainVideo.oncanplay = (e) => adHandler(e.target);
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  };

  // assign observer on window load
  window.onload = () => {
    if (urlChecker(window.location.href)) adHandler(getVideoElem());

    observeUrlChange();
  };
})();
