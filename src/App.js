import * as React from 'react';
import { Scatter as ChartJS } from 'chart.js/auto'
import { Scatter }            from 'react-chartjs-2'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { styled } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';

const length = 10;

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#1A2027',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const R = 8.31446261815324 / 6.02214076e23 // R / 1mol
const pressure = 0.1
const r = 1e-10
const sigma = Math.PI * Math.pow(2*r, 2)

function render(x, voltage, temperature) {
  const rho = pressure / (R * temperature)
  var intensity = 0
  var U = voltage * x / length;
  console.log(sigma*rho)
  while (U >= 4.9) {
    U -= 4.9;
    const distance = U * length / voltage;
    intensity += (1-intensity / sigma / rho) * sigma * rho * Math.exp(-distance*sigma*rho)
  }
  return intensity;
}

function linspace(min, max, count) {
  const result = [];
  for (var i = 0; i < count; i++) {
    result.push(min + (max - min) * i / count);
  }
  return result;
}

function CreateSelector(text, unit, initialValue, min, max, onUpdate) {
  var [variable, setter] = React.useState(initialValue)
  function onChange(event, _) {
    setter(event.target.value)
    onUpdate()
  }
  const selector = <Item>
    <h3>{text}: {variable}{unit}</h3>
    <Slider value={variable} onChange={onChange} min={min} max={max}/>
  </Item>
  return [variable, setter, selector]
}

const xs = linspace(0, length, 100)
const initialVoltage = 10
const initialTemperature = 280

function App() {
  const [intensityData, setIntensity] = React.useState(xs.map(x => {return {x: x, y: render(x, initialVoltage, initialTemperature)}}));
  function onUpdate() {
    setIntensity(xs.map(x => {return {x: x, y: render(x, voltage, temperature)}}))
  }
  var data = {datasets: [
                    {type: "scatter", label: "none", data: [{x: 0, y: 0}]},
                    {type: "line", label: "light intensity",data: intensityData},
                ]}
  
  const scatterPlot = <Scatter
    options={{type: "scatter", tooltips: {enabled: false},
              plugins: {legend: {labels: {filter: function(item, chart) {return item.text != "none"}}}}}}
              data={data}/>
  

  var [voltage, setVoltage, voltageSelector] = CreateSelector("Spannung", "V", initialVoltage, 0, 20, onUpdate)
  var [temperature, setTemperature, temperatureSelector] = CreateSelector("Temperatur", "K", initialTemperature, 273, 313, onUpdate)

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <main>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid container direction="column" item xs={2} spacing={2}>
              <Grid item>{temperatureSelector}</Grid>
              <Grid item>{voltageSelector}</Grid>
            </Grid>
            <Grid item xs={10} ys={4}><Item>{scatterPlot}</Item></Grid>
          </Grid>
        </Box>
      </main>
    </ThemeProvider>
  );
}

export default App;
