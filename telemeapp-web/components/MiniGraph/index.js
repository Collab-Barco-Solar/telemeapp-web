import styles from '../../styles/components/Graph.module.css';
import {ResponsiveContainer} from 'recharts'
import Select from 'react-select';

import { Line, defaults, Chart } from 'react-chartjs-2';
import zoomPlugin from 'chartjs-plugin-zoom';

import { useEffect, useState } from 'react';


//Adds zoom option to the charts
Chart.register(zoomPlugin);


// Configurações do conteúdo do gráfico
var InfoNames = [
    { value: "motor_current", label: "Corrente Motor" },
    { value: "alimentation_voltage", label: "Tensão Alim" },
    { value: "mppt_current", label: "Corrente MPPT" },
    { value: "batteries_voltage", label: "Tensão Baterias" },
    { value: "humidity", label: "Humidade" },
    { value: "temperature", label: "Temperatura" }
];

export default function MiniGraph(props){
    const dadosExibidos = [props.type];
    var dadosRecebidos = props.data;
    const [chartOptions, setChartOptions] = useState({
        animation: true,
        borderWidth: 1,
        lineWidth: 0.6,
        elements: {
            point:{
                radius: 0.1,
                hitRadius: 0
            }
        },
        plugins: {
            zoom: {
              zoom: {
                wheel: {
                  enabled: true,
                },
                pinch: {
                  enabled: true
                },
                mode: 'xy',
              },
              pan: {
                enabled: true,
                mode: "xy"
            },
            }
          },
        maintainAspectRatio: false
    });

    const data = {
        datasets: [{
            label: dadosExibidos[0],
            backgroundColor: props.color,
            borderColor: props.color,
            data: dadosRecebidos.map(function (line) {
                return line[dadosExibidos[0]]
            }),
        }],
        labels: dadosRecebidos.map(function (line) {
            return line['time']
        })
    };


    return (
        <div className={styles.miniGraph}>
            <Line data={data} options={chartOptions}/>
        </div>

    )
} 