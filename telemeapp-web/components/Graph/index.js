import styles from '../../styles/components/Graph.module.css';
import { Line, LineChart, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer, Label } from 'recharts'
//import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Select from 'react-select';
import { useState } from 'react';



// Configurações estéticas do gráfico
let fontAxis = 'Arial';
let fontLabel = 'Arial';
let fontSizeAxis = '1rem';
let fontSizeLabel = '1.2rem';


// Configurações do conteúdo do gráfico
var InfoNames = [
    { value: "cBarramento", label: "Corrente Motor" },
    { value: "tModulos", label: "Tensão Mod" },
    { value: "cBaterias", label: "Corrente Baterias" },
    { value: "tBaterias", label: "Tensão Baterias" },
    { value: "velocidade", label: "Velocidade" },
    { value: "temperatura", label: "Temperatura" }
];
var colors = ['white', 'yellow', 'grey', 'blue', 'red'];


const stylesSelect = {
    option: (provided, state) => ({
        ...provided,
        fontWeight: state.isSelected ? "bold" : "normal",
        fontSize: state.selectProps.fontSize
    }),

    input: (provided, state) => ({
        ...provided,
        color: 'white',
        fontSize: state.selectProps.fontSize
    }),

    multiValue: (provided, state) => ({
        ...provided,
        color: 'grey',
        fontSize: state.selectProps.fontSize
    }),
};

const dadosRecebidos = [{cBarramento: -17.11086714643932,
    cBaterias: 97.45904081772879,
    cBateriasAux: 52.033108964819874,
    cModulos: -25.274399284026924,
    cruzeiro: 1,
    dms: 0,
    emergencia: 1,
    freio: 0,
    id: 8427,
    latitude: 120.4908312520767,
    longitude: 23.482061963224364,
    onOFF: 0,
    pPotenciometro: 71.36815794755553,
    re: 1,
    tBarramento: 95.70507262900581,
    tBaterias: 45.65596681847358,
    tBateriasAux: 69.78095133461842,
    tModulos: 75.81230989030531,
    temperatura: 5.05093085458401,
    velocidade: 97.0584668122581},
    {   cBarramento: -47.11086714643932,
        cBaterias: 17.45904081772879,
        cBateriasAux: 42.033108964819874,
        cModulos: -25.274399284026924,
        cruzeiro: 1,
        dms: 0,
        emergencia: 1,
        freio: 0,
        id: 8427,
        latitude: 120.4908312520767,
        longitude: 23.482061963224364,
        onOFF: 0,
        pPotenciometro: 71.36815794755553,
        re: 1,
        tBarramento: 95.70507262900581,
        tBaterias: 45.65596681847358,
        tBateriasAux: 69.78095133461842,
        tModulos: 75.81230989030531,
        temperatura: 5.05093085458401,
        velocidade: 97.0584668122581}]



export function CompleteGraph() {
    const [dadosExibidos, setDadosExibidos] = useState([]);

    // Pega os valores selecionados no Select e coloca no state
    const handleChangeSelect = (selectedOptions) => {
        setDadosExibidos(selectedOptions.map(o => o.value));
    }

    // Pega o Array completo retirado do banco de dados e extrai a informação a ser exibida no gráfico
    const organizarDadosParaGrafico = (linhaAtual) => {
        var dict = [];
        dadosExibidos.forEach(dado => { //Pega cada dado a ser exibido e organiza num dictionary no formato {nomeDoDado: valorDoDado_nessaLinha}
            dict[dado] = linhaAtual[dado];
            // !!! Mudar o tempo para o tempo de fato
            dict['tempo'] = linhaAtual['id'];
        });

        return dict;
    }


    return (
        <div className={styles.container}>
            <ResponsiveContainer width="100%" height="16%">
                <Select
                    options={InfoNames}
                    isMulti={true}
                    closeMenuOnSelect={false}
                    styles={stylesSelect}
                    onChange={handleChangeSelect}
                    defaultValue={{ label: "Corrente Motor", value: "cBarramento" }}
                    fontSize='15px'
                    theme={(theme) => ({
                        ...theme,
                        colors: {
                            ...theme.colors,
                            neutral0: '#242466', //Background do select
                            primary25: '#030345', //Background do item selecionado
                        },
                    })}
                />
            </ResponsiveContainer>
            <ResponsiveContainer width="95%" height="80%" className={styles.graph}>
                <LineChart
                    margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
                    data={dadosRecebidos.map(organizarDadosParaGrafico)} >
                    <CartesianGrid verticalFill={['rgba(28, 28, 73, 1)', 'rgba(0, 0, 0, 1)']} horizontalFill={['#ccc', '#fff']} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0)' }} />
                    <XAxis dataKey="tempo" stroke='white' minTickGap={50} interval="preserveStartEnd" style={{
                        fontSize: fontSizeAxis,
                        fontFamily: fontAxis,
                    }}>
                    </XAxis>
                    <YAxis stroke='white' style={{
                        fontSize: fontSizeAxis,
                        fontFamily: fontAxis,
                    }}>
                    </YAxis>
                    <Legend />

                    {dadosExibidos.map((item, index) => {
                        //Passa por todos os dados a serem exibidos e cria uma linha no gráfico para ele, com a próxima cor do array colors
                        return (
                            <Line type='monotone' dataKey={dadosExibidos[index]} key={index} stroke={colors[index]} dot={false} isAnimationActive={false} />
                        );
                    })}
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}













export function MiniGraph(props) {
    const dadosExibidos = [props.type];

    // Pega o Array completo retirado do banco de dados e extrai a informação a ser exibida no gráfico
    const organizarDadosParaMiniGrafico = (linhaAtual) => {
        var dict = [];
        dadosExibidos.forEach(dado => { //Pega cada dado a ser exibido e organiza num dictionary no formato {nomeDoDado: valorDoDado_nessaLinha}
            dict[dado] = linhaAtual[dado];
            // !!! Mudar o tempo para o tempo de fato
            dict['tempo'] = linhaAtual['id'];
        });

        return dict;
    }

    return (
        <div className={styles.miniGraph}>
            <ResponsiveContainer width="100%" height="95%">
                <LineChart
                    margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
                    data={dadosRecebidos.map(organizarDadosParaMiniGrafico)} >
                    <CartesianGrid verticalFill={['rgba(28, 28, 73, 1)', 'rgba(0, 0, 0, 1)']} horizontalFill={['#ccc', '#fff']} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0)' }} />
                    <XAxis dataKey="tempo" stroke='white' minTickGap={50} interval="preserveStartEnd" style={{
                        fontSize: fontSizeAxis,
                        fontFamily: fontAxis,
                    }}>
                    </XAxis>
                    <YAxis stroke='white' style={{
                        fontSize: fontSizeAxis,
                        fontFamily: fontAxis,
                    }}>
                    </YAxis>
                    <Legend />
                    <Line type='monotone' dataKey={props.type} stroke={props.color} dot={false} isAnimationActive={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}