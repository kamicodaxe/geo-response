import chroma from 'chroma-js';

const colorScale = chroma.scale(['#fefee9', '#ff0000']);
const defaultFill = [0, 0, 0, 0];

const getFillColor = (data, globalData, colorMax=250) => {
  console.log(data)
  if (globalData.length < 0) {
    return defaultFill;
  }
  // return [...colorScale(0 / colorMax).rgb(), 150];

  const { properties } = data;
  const mappedProps = globalData.find(d => d.name === properties.name)

  const cases = mappedProps.confirmed;
  if (cases > 0) {
    return [...colorScale(cases / colorMax).rgb(), 150];
  }
  return defaultFill;

}

const onHover = (data, globalData, setToolTip) => {
  if (data.object) {
    window.globalData = globalData

    const { x, y, object: { id, properties } } = data;
    const mappedProps = globalData.find(d => d.name === properties.name)
    console.log(mappedProps)
    // const mappedProps = {
    //   name: properties.name,
    //   confirmed: properties.nombre_total_de_cas,
    //   deaths: properties.nombre_de_victimes,
    //   recovered: properties.nombre_de_personnes_retablies
    // }

    setToolTip({ id, x, y, name: mappedProps.name, data: mappedProps })
  } else {
    setToolTip(null);
  }
}


export {
  getFillColor,
  onHover
}