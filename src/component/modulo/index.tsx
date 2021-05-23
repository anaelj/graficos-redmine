/* eslint-disable array-callback-return */

import React,{useState, useEffect }  from 'react'
import { daysBetween, getModules, getTrackers, IIssues } from '../../tools/array.tools'
import { Container } from './styles'
import Chart from "react-google-charts";
import Select from 'react-select';
import ReactLoading from 'react-loading';

interface IModuloProps {
    issues : IIssues[];
    projeto : string;
}
const Modulo: React.FC<IModuloProps> = ({ children, issues, projeto, ...rest }) => {

   const [data, setData] = useState([['Módulo', 'Quantidade']]);
   const [selectedYear, setSelectedYear] = useState('2021');
   const [selectedMonth, setSelectedMonth] = useState('00');
   const [loading, setLoading] = useState(false);
   const [selectedTracker, setSelectedTracker] = useState(0);
   const [trackerOptions, settrackerOptions] = useState([{label: 'Todos', value: 0}]);
   const [totalGeral, setTotalGeral] = useState(0);
   const [mediaDiaria, setMediaDiaria] = useState(0);


   useEffect (  () => {

    setLoading(true);

    const selectedYearAndMonth = selectedMonth === '00' ? selectedYear : selectedYear+'-'+selectedMonth;

    const issuesLocal = issues.filter(item => item.project.name === projeto 
      && item.created_on.includes(selectedYearAndMonth)
      && (item.tracker.id === selectedTracker || selectedTracker === 0));

    const modules =  getModules(issuesLocal);
    let arrayLocal : Array<any> = [];
    arrayLocal = [];
    
    modules.map( item => {
        if (item.name !== '') {
            arrayLocal.push(...[[
                item.name , 
                issuesLocal.filter(
                    issue => issue && issue.custom_fields && issue.custom_fields.find(
                      fd => fd.value === item.name)).length]])
        }
    })
//    const teste = arrayLocal.reduce( (acc, item)=>  acc + item[1], 0 );
    //console.log(teste);
//    console.log(arrayLocal);
    setTotalGeral(arrayLocal.reduce( (acc, item)=>  acc + item[1], 0 ));
    //console.log(totalGeral);
    settrackerOptions([...getTrackers(issues).map(item => { return ({ label : item.name, value : item.id})})]);
    setData([['Módulo', 'Quantidade'], ...arrayLocal]);
    setLoading(false);

    const dias = daysBetween(new Date(Number(selectedYear), selectedMonth === '00' ? 0 : Number(selectedMonth)-1 , 1), 
              new Date(Number(selectedYear), selectedMonth === '00' ? 11 : Number(selectedMonth) , 1));
    totalGeral > 0 && dias && setMediaDiaria(totalGeral / (dias-1));

    // console.log(dias);
    // console.log(mediaDiaria);

//    console.log(issuesLocal);
           
},[issues, selectedYear, selectedMonth, selectedTracker, projeto, totalGeral, mediaDiaria]); 
  if (data.length === 1){
    return (<></>) 
  } else {
    //console.log(data)
  
    return (
         <>
        {loading &&  <ReactLoading type="spokes" color='#000' height={250} width={250} />}
        <Container style={{height: '30px'}}><h1>{projeto}</h1></Container>
        <Container>
            
            <div >
                <Select defaultValue={{value:'2021', label: '2021'}} 
                    options={[
                                 {value: '2020', label: '2020'},
                                 {value: '2021', label: '2021'},
                                 {value: '2022', label: '2022'}
                            ]} 
                    onChange={(e)=> e && setSelectedYear(e.value) } />
            </div>
            <div>
                <Select defaultValue={{value: '00', label: 'Todos' }} options={
                    [
                        {value: '00', label: 'Todos', selected : true},
                        {value: '01', label: 'Janeiro'},
                        {value: '02', label: 'Fevereiro'},
                        {value: '03', label: 'Março'},
                        {value: '04', label: 'Abril'},
                        {value: '05', label: 'Maio'},
                        {value: '06', label: 'Junho'},
                        {value: '07', label: 'Julho'},
                        {value: '08', label: 'Agosto'},
                        {value: '09', label: 'Setembro'},
                        {value: '10', label: 'Outubro'},
                        {value: '11', label: 'Novembro'},
                        {value: '12', label: 'Dezembro'},
                    ]} onChange={(e)=> e && setSelectedMonth(e.value) } />
            </div>
            <div >
                <Select defaultValue={{value:0, label: 'Todos'}} 
                    options={trackerOptions} 
                    onChange={(e)=> e && setSelectedTracker(e.value) } />
            </div>
        </Container>        
            <div style={{ display: 'flex', maxWidth: 900 }}>

          
          <Chart
          width={'100%'}
          height={600}
          chartType="ColumnChart"
          loader={<div>Loading Chart</div>}
          data={ data }
          options={{
            title: `Total de chamados por módulo: ${totalGeral}    média diária: ${mediaDiaria.toFixed(2)}`,
            chartArea: { width: '65%' },
            legend: {position: 'top'},
            hAxis: {
              title: 'Módulos',
              minValue: 0,
            },
            vAxis: {
              title: 'Chamados',
            },
          }}
          legendToggle
        /> 
        </div> 
        </>
    )
  }
}

export default Modulo;
