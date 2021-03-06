/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

//

import { getSelectedSource, getBreakpointPositionsForLine } from "../reducers/sources";
import { getBreakpointsList } from "../reducers/breakpoints";

function getColumn(column, selectedSource) {
  return column;
}

function getLocation(bp, selectedSource) {
  return bp.location;
}

function getBreakpointsForSource(state, selectedSource) {
  const breakpoints = getBreakpointsList(state);

  return breakpoints.filter(bp => {
    const location = getLocation(bp, selectedSource);
    return location.sourceId === selectedSource.id;
  });
}

function findBreakpointAtLocation(breakpoints, selectedSource, { line, column }) {
  return breakpoints.find(breakpoint => {
    const location = getLocation(breakpoint, selectedSource);
    const sameLine = location.line === line;
    if (!sameLine) {
      return false;
    }

    if (column === undefined) {
      return true;
    }

    return location.column === getColumn(column, selectedSource);
  });
}

// returns the closest active column breakpoint
function findClosestPosition(positions, column) {
  if (!positions || positions.length == 0) {
    return null;
  }

  return positions.reduce((closestPos, currentPos) => {
    const currentColumn = currentPos.column;
    const closestColumn = closestPos.column;
    // check that breakpoint has a column.
    if (column && currentColumn && closestColumn) {
      const currentDistance = Math.abs(currentColumn - column);
      const closestDistance = Math.abs(closestColumn - column);

      return currentDistance < closestDistance ? currentPos : closestPos;
    }
    return closestPos;
  }, positions[0]);
}

/*
 * Finds a breakpoint at a location (line, column) of the
 * selected source.
 *
 * This is useful for finding a breakpoint when the
 * user clicks in the gutter or on a token.
 */
export function getBreakpointAtLocation(state, location) {
  const selectedSource = getSelectedSource(state);
  if (!selectedSource) {
    throw new Error("no selectedSource");
  }
  const breakpoints = getBreakpointsForSource(state, selectedSource);

  return findBreakpointAtLocation(breakpoints, selectedSource, location);
}

export function getBreakpointsAtLine(state, line) {
  const selectedSource = getSelectedSource(state);
  if (!selectedSource) {
    throw new Error("no selectedSource");
  }
  const breakpoints = getBreakpointsForSource(state, selectedSource);

  return breakpoints.filter(breakpoint => getLocation(breakpoint, selectedSource).line === line);
}

export function getClosestBreakpoint(state, position) {
  const columnBreakpoints = getBreakpointsAtLine(state, position.line);
  const positions = columnBreakpoints.map(bp => bp.location);

  const closestPosition = findClosestPosition(positions, position.column);
  const breakpoint = columnBreakpoints.find(cbp => cbp.location === closestPosition);
  return breakpoint;
}

export function getClosestBreakpointPosition(state, position) {
  const selectedSource = getSelectedSource(state);
  if (!selectedSource) {
    throw new Error("no selectedSource");
  }

  const positions = getBreakpointPositionsForLine(state, selectedSource.id, position.line);

  return findClosestPosition(positions, position.column);
}
