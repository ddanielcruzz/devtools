/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

const {
  UPDATE_LAYOUT,
  UPDATE_OFFSET_PARENT,
} = require("devtools/client/inspector/boxmodel/actions/index");

module.exports = {
  /**
   * Updates the layout state with the new layout properties.
   */
  updateLayout(layout) {
    return {
      type: UPDATE_LAYOUT,
      layout,
    };
  },

  /**
   * Updates the offset parent state with the new DOM node.
   */
  updateOffsetParent(offsetParent) {
    return {
      type: UPDATE_OFFSET_PARENT,
      offsetParent,
    };
  },
};
