import React, { useState } from 'react';

function metrics() {
  const [metrics, setMetrics] = useState([{}]);
  this.metrics = metrics;
  this.setMetrics = setMetrics
}

metrics.prototype.setMetrics = function() {

}

export {
  metrics,
  setMetrics
}