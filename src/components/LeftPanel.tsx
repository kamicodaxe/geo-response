import React from 'react';
import './LeftPanel.css';
import METRICS from '../geo/metrics.json'
import {
  // BrowserView,
  // MobileView,
  // isBrowser,
  isMobile
} from "react-device-detect";

interface ContainerProps {
  metrics: any,
  setMetrics: any
}

interface DataItem {
  name: string;
  confirmed: number;
  recovered: number;
  death: number;
}

const mapMmetrics = (m: any) => ({
  ...m
})

const TownListItem: React.FC<any> = ({ name, confirmed, recovered, death}) => (
  <div className="list-container" key={name}>
    <p className="town">{name}</p>
    <p className="cases">{confirmed}</p>
    <p className="death">{death}</p>
    <p className="recovered">{recovered}</p>
  </div>
)

const LeftPanel: React.FC<ContainerProps> = ({ metrics }) => {
  let data = []
  let [confirmed, death, recovered] = [0, 0, 0]
  if (metrics.length > 0) {
    data = metrics.map(mapMmetrics).sort((a: any, b: any) => a.confirmed > b.confirmed ? -1 : +1);
    data.forEach((m: DataItem) => {
      confirmed += m.confirmed;
      death +=m.death;
      recovered += m.recovered
    })
  }
  
  return (
    <div className={isMobile ? 'left-panel-container mobile' : 'left-panel-container'}> 
      <div className='header-container'>
        <div>
          <p className="big-text color-cases">{confirmed}</p>
          <p className="small-head-text">Confirmed</p>
        </div>
        <div>
          <p className="big-text color-victims">{death}</p>
          <p className="small-head-text">Victims</p>
        </div>
        <div>
          <p className="big-text color-recovered">{recovered}</p>
          <p className="small-head-text">Recovered</p>
        </div>
      </div>
      {/* ./header-container */}

      <div className="data-list">
        {
          data.map(TownListItem)
        }
      </div>
    </div>
  );
};

export default LeftPanel;
