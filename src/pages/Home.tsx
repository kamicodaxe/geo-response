import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useState, useEffect } from 'react';
import DeckGL from '@deck.gl/react';
import { GeoJsonLayer, IconLayer } from '@deck.gl/layers'; // GeoJsonLayer 
import { StaticMap, NavigationControl, _MapContext as MapContext, Marker } from 'react-map-gl';
import axios from 'axios';
// import { pick } from 'lodash';
// import { Colorscale } from 'react-colorscales';
// import chroma from 'chroma-js';
import {
  BrowserView,
  MobileView,
  // isBrowser,
  // isMobile
} from "react-device-detect";

import './Home.css';

import LeftPanel from '../components/LeftPanel';
// import CenterPanel from '../components/CenterPanel';
import Map from '../components/Map';
import { getFillColor, onHover } from '../utils';
import { COVID_DATA_ENDPOINT, MINI_PROXY_ENDPOINT } from '../constants'
import REGIONS from '../geo/regions.json';
import HOSPITALS from '../geo/hospitals.json';
import PHARMACIES from '../geo/pharmacies.json';
import POLICE_STATIONS from '../geo/police-stations.json';

// import RightPanel from '../components/RightPanel';

// const MAPBOX_STYLE = ''
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1Ijoia2FtaXJ1dmljZSIsImEiOiJjazgweHZxaWgwMTQzM2ZzM3c0djl1dXlrIn0.JnPVXLFeeQ_FgSjiC9El0w'

const initialViewState = {
  width: 400,
  height: 400,
  latitude: 3,
  longitude: 11.5,
  zoom: 6,
  pitch: 0,
  bearing: 0
};


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
  deaths: number,
  recovered: number,
}

class CustomMarker extends React.PureComponent<{ markers: any[] }, {}> {
  render() {
    if (this.props.markers.length > 0) {
      return (
        this.props.markers.map((marker: any) => (
          <Marker
              key={marker.name}
              longitude={marker.longitude}
              latitude={marker.latitude}
            >
            <p>{ marker.name }</p>
          </Marker>
        ))
      )
    }
  }
}

const Home: React.FC = () => {
  // eslint-disable-next-line no-unused-vars
  const [staticMap, setStaticMap] = useState();
  const [geoJson, setGeoJson] = useState(REGIONS);
  const [globalData, setGlobalData] = useState({});
  const [toolTipData, setToolTip] = useState<{
    x: number,
    y: number,
    name: string,
    id: string,
    data: {
      confirmed: number,
      deaths: number,
      recovered: number,
      active: number,
      lastUpdate: number | string
    }
  }>(); // { x, y, id, name, data: { confirmed, deaths, recovered } }
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        
        const [{ data: { type, features } }] = await Promise.all([
          axios.post<{ type: string, features: FeatureData[] }>(MINI_PROXY_ENDPOINT, { url: COVID_DATA_ENDPOINT})
        ]);

        
        // const features: FeatureData[] = [{ "type": "Feature", "id": "regions_view.fid--79f94bfd_171412a2335_e2c",  "properties": { "osm_id": "1", "reg_ref_cog": "CM001", "name": "Adamaoua", "pop_estim_2020": "1360655", "nombre_total_de_cas": 0, "nombre_de_victimes": 0, "nombre_de_personnes_retablies": 0 } }, { "type": "Feature", "id": "regions_view.fid--79f94bfd_171412a2335_e2d",  "properties": { "osm_id": "2", "reg_ref_cog": "CM002", "name": "Centre", "pop_estim_2020": "5403531", "nombre_total_de_cas": 230, "nombre_de_victimes": 6, "nombre_de_personnes_retablies": 17 } }, { "type": "Feature", "id": "regions_view.fid--79f94bfd_171412a2335_e2e",  "properties": { "osm_id": "3", "reg_ref_cog": "CM003", "name": "Est", "pop_estim_2020": "1016707", "nombre_total_de_cas": 0, "nombre_de_victimes": 0, "nombre_de_personnes_retablies": 0 } }, { "type": "Feature", "id": "regions_view.fid--79f94bfd_171412a2335_e2f",  "properties": { "osm_id": "4", "reg_ref_cog": "CM004", "name": "Extrême-Nord", "pop_estim_2020": "4482315", "nombre_total_de_cas": 0, "nombre_de_victimes": 0, "nombre_de_personnes_retablies": 0 } }, { "type": "Feature", "id": "regions_view.fid--79f94bfd_171412a2335_e30",  "properties": { "osm_id": "5", "reg_ref_cog": "CM005", "name": "Littoral", "pop_estim_2020": "4222616", "nombre_total_de_cas": 268, "nombre_de_victimes": 1, "nombre_de_personnes_retablies": 0 } }, { "type": "Feature", "id": "regions_view.fid--79f94bfd_171412a2335_e31",  "properties": { "osm_id": "6", "reg_ref_cog": "CM006", "name": "Nord", "pop_estim_2020": "2889247", "nombre_total_de_cas": 0, "nombre_de_victimes": 0, "nombre_de_personnes_retablies": 0 } }, { "type": "Feature", "id": "regions_view.fid--79f94bfd_171412a2335_e32",  "properties": { "osm_id": "7", "reg_ref_cog": "CM007", "name": "Nord-Ouest", "pop_estim_2020": "2186144", "nombre_total_de_cas": 0, "nombre_de_victimes": 0, "nombre_de_personnes_retablies": 0 } }, { "type": "Feature", "id": "regions_view.fid--79f94bfd_171412a2335_e33",  "properties": { "osm_id": "8", "reg_ref_cog": "CM009", "name": "Sud", "pop_estim_2020": "927007", "nombre_total_de_cas": 0, "nombre_de_victimes": 0, "nombre_de_personnes_retablies": 0 } }, { "type": "Feature", "id": "regions_view.fid--79f94bfd_171412a2335_e34",  "properties": { "osm_id": "9", "reg_ref_cog": "CM010", "name": "Sud-Ouest", "pop_estim_2020": "1822484", "nombre_total_de_cas": 3, "nombre_de_victimes": 1, "nombre_de_personnes_retablies": 0 } }, { "type": "Feature", "id": "regions_view.fid--79f94bfd_171412a2335_e35",  "properties": { "osm_id": "10", "reg_ref_cog": "CM008", "name": "Ouest", "pop_estim_2020": "2022251", "nombre_total_de_cas": 8, "nombre_de_victimes": 0, "nombre_de_personnes_retablies": 0 } }]
        // console.log({ features })
        
        const globalData: GlobalData[] = []

        features.forEach((d:FeatureData) => {

          const mapFeature = (f: FeatureData) => ({
            id: f.id,
            name: f.properties.name,
            confirmed: f.properties.nombre_total_de_cas,
            deaths: f.properties.nombre_de_victimes,
            recovered: f.properties.nombre_de_personnes_retablies
          });

          globalData.push(mapFeature(d))

        })

        console.log(globalData)
        setGlobalData(globalData);

      } catch (err) {
        console.error(err);
      }
    };
    loadData();
  }, []);

  const _renderTooltip = () => {
    if (!toolTipData) {
      return null;
    }
    const { x, y, id, name, data: { confirmed = 0, deaths = 0, recovered = 0, lastUpdate = null } = {} } = toolTipData;
    return (
      <React.Fragment>
        <BrowserView>
          <div style={{ position: 'fixed', zIndex: 5, pointerEvents: 'none', left: x, top: y, backgroundColor: 'white', padding: '1rem', borderRadius: '4px', minWidth: '200px' }}>
            <h2 style={{ margin: '0 0 1rem 0' }}>{name}</h2>
            <div>confirmed: {confirmed}</div>
            <div>deaths: {deaths}</div>
            <div>recovered: {recovered}</div>
            {lastUpdate && (<div>last update: {new Date(lastUpdate).toLocaleString()}</div>)}
          </div>
        </BrowserView>
        <MobileView>
          <div style={{ position: 'absolute', zIndex: 5, left: '1rem', right: '1rem', bottom: '1rem', backgroundColor: 'white', padding: '1rem', borderRadius: '4px' }}>
            <h2 style={{ margin: '0 0 1rem 0' }}>{name}</h2>
            <div>confirmed: {confirmed}</div>
            <div>deaths: {deaths}</div>
            <div>recovered: {recovered}</div>
            {lastUpdate && (<div>last update: {new Date(lastUpdate).toLocaleString()}</div>)}
          </div>
        </MobileView>
      </React.Fragment>
    );
  }

  const layers = [
    new GeoJsonLayer({
      id: 'regions-geo-json',
      data: geoJson,
      highlightColor: [0, 0, 0, 50],
      autoHighlight: true,
      getFillColor: (data: any) => getFillColor(data, globalData),
      updateTriggers: {
        getFillColor: [globalData]
      },
      stroked: true,
      filled: true,
      strokeColor: [255, 0, 0],
      getStrokeColor: () => [0, 0, 0, 255],

      /* interact */
      pickable: true,
      onHover: (data: any) => onHover(data, globalData, setToolTip),
      onClick: (data: any) => {
        
        console.log('clicked:', data)
        // console.log('country data:', globalData[data.object.id]);
      }
    }),
    new IconLayer({
      id: 'police',
      data: POLICE_STATIONS,
      getIcon: () => ({
        url: 'https://img.icons8.com/ios-filled/50/000000/policeman-male--v1.png',
        width: 128,
        height: 128,
        anchorY: 128
      }),
      pickable: true,
      sizeScale: 0,
      getPosition: (d: any) => d.geometry.coordinates,
    }),
    new IconLayer({
      id: 'hospitals',
      data: HOSPITALS,
      getIcon: () => ({
        url: 'https://img.icons8.com/android/96/000000/hospital-2.png',
        width: 128,
        height: 128,
        anchorY: 128
      }),
      pickable: true,
      sizeScale: 30,
      getPosition: (d: any) => d.geometry.coordinates,
    }),
    new IconLayer({
      id: 'pharmacies',
      data: PHARMACIES,
      getIcon: () => ({
        url: 'https://img.icons8.com/cotton/64/000000/hand-with-a-pill.png',
        width: 128,
        height: 128,
        anchorY: 128
      }),
      pickable: true,
      sizeScale: 50,
      getPosition: (d: any) => d.geometry.coordinates,
    })
  ]

  return (
    <IonPage>
      <IonContent>
        {/* <IonHeader>
          <IonToolbar>
            <IonTitle>Covid-19</IonTitle>
          </IonToolbar>
        </IonHeader> */}

        {/* <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Covid-19</IonTitle>
          </IonToolbar>
        </IonHeader> */}

        <DeckGL
          initialViewState={initialViewState}
          controller={true}
          layers={layers}
          Style={{ width: '100vw', height: '100vh' }}
          ContextProvider={MapContext.Provider}
        >
          <StaticMap
            ref={ref => setStaticMap(ref)} width='100%' height='100%'
            mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
            // Uncomment to add custom styles
            // mapStyle={MAPBOX_STYLE}
            />
          <div style={{ position: "absolute", right: '1rem', bottom: '6rem', zIndex: 10 }}>
            <NavigationControl showCompass={false} />
          </div>
          {
            markers.length > 0 && <CustomMarker markers={markers} />
          }
        </DeckGL>

        {_renderTooltip()}

        

      </IonContent>
    </IonPage>
  );
};

export default Home;
