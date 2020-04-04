import React, { useState, useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { map, analytics, statsChart, newspaper } from 'ionicons/icons';
import Tab1 from './pages/Tab1';
import Tab2 from './pages/Tab2';
import Tab3 from './pages/Tab3';
import Home from './pages/Home';
import Article from './pages/Article';

import { COVID_DATA_ENDPOINT, MINI_PROXY_ENDPOINT } from './constants';
import axios from 'axios';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

interface FeatureData {
  "type": string;
  "id": string;
  "geometry"?: {
    "type": string;
    "coordinates": [
      number,
      number
    ]
  };
  "geometry_name"?: string;
  "properties": {
    "osm_id": string;
    "reg_ref_cog": string;
    "name": string;
    "pop_estim_2020": string;
    "nombre_total_de_cas": number;
    "nombre_de_victimes": number;
    "nombre_de_personnes_retablies": number;
  }
}

type GlobalData = {
  id: string,
  name: string,
  confirmed: number,
  death: number,
  recovered: number,
}


const App: React.FC = () => {

  const [metrics, setMetrics] = useState({});

  useEffect(() => {
    const loadData = async () => {
      try {

        const [{ data: { features } }] = await Promise.all([
          axios.post<{ type: string, features: FeatureData[] }>(MINI_PROXY_ENDPOINT, { url: COVID_DATA_ENDPOINT })
        ]);

        const globalData: GlobalData[] = []

        features.forEach((d: FeatureData) => {

          const mapFeature = (f: FeatureData) => ({
            id: f.id,
            name: f.properties.name,
            confirmed: f.properties.nombre_total_de_cas,
            death: f.properties.nombre_de_victimes,
            recovered: f.properties.nombre_de_personnes_retablies
          });

          globalData.push(mapFeature(d))

        })

        console.log(globalData)
        setMetrics(globalData);

      } catch (err) {
        console.error(err);
      }
    };
    loadData();
  }, []);

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route path="/:tab(map)"  component={Home} exact={true} />
            <Route path="/:tab(statistics)" render={() => <Tab1 metrics={metrics} setMetrics={setMetrics} />} exact={true} />
            <Route path="/:tab(charts)" render={() => <Tab2 metrics={metrics} setMetrics={setMetrics} />} exact={true} />
            <Route path="/:tab(news)" component={Tab3} exact={true} />
            <Route path="/:tab(news)/:title/:id" component={Article} />
            <Route path="/" render={() => <Redirect to="/map" />} exact={true} />
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="map" href="/map">
              <IonIcon icon={map} />
              <IonLabel>Map</IonLabel>
            </IonTabButton>
            <IonTabButton tab="statistics" href="/statistics">
              <IonIcon icon={analytics} />
              <IonLabel>Statistics</IonLabel>
            </IonTabButton>
            <IonTabButton tab="charts" href="/charts">
              <IonIcon icon={statsChart} />
              <IonLabel>Charts</IonLabel>
            </IonTabButton>
            <IonTabButton tab="news" href="/news">
              <IonIcon icon={newspaper} />
              <IonLabel>News</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
}

export default App;
