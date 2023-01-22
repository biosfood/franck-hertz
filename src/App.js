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

function render(x, voltage) {
  var intensity = 0
  var U = voltage * x / length;
  while (U >= 4.9) {
    U -= 4.9;
    const distance = U * length / voltage;
    intensity = (1-intensity) * Math.exp(-distance)
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


function App() {
  var [voltage, setVoltage] = React.useState(10)
  function onVoltageChange(event, newVoltage) {
    console.log(setVoltage)
    setVoltage(event.target.value)
    onUpdate()
  }
  const voltageSelector = <Item>
    <h3>Spannung: {voltage}V</h3>
    <Slider value={voltage} onChange={onVoltageChange} min={0} max={20}/>
  </Item>

  const xs = linspace(0, length, 100);
  const [intensityData, setIntensity] = React.useState(xs.map(x => {return {x: x, y: render(x, voltage)}}));
  var data = {datasets: [
                    {type: "scatter", label: "none", data: [{x: 0, y: 0}]},
                    {type: "line", label: "light intensity",data: intensityData},
                ]}
  
  const scatterPlot = <Scatter
    options={{type: "scatter", tooltips: {enabled: false},
              plugins: {legend: {labels: {filter: function(item, chart) {return item.text != "none"}}}}}}
              data={data}/>
  
  function onUpdate() {
    setIntensity(xs.map(x => {return {x: x, y: render(x, voltage)}}))
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <main>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={2}>{voltageSelector}</Grid>
            <Grid item xs = {10}><Item>{scatterPlot}</Item></Grid>
          </Grid>
        </Box>
      </main>
    </ThemeProvider>
  );
}

export default App;
