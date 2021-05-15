import React,{useState, useEffect }  from 'react'
import { getModules, getTrackers, IIssues } from '../../tools/array.tools'
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
        return  arrayLocal.push(...[[
                item.name === '' ? 'Sem módulo' : item.name , 
                issuesLocal.filter(
                    issue => issue.custom_fields.find(
                      fd => fd.value === item.name)).length]])
    })
    
    settrackerOptions([...getTrackers(issues).map(item => { return ({ label : item.name, value : item.id})})]);
    setData([['Módulo', 'Quantidade'], ...arrayLocal]);
    setLoading(false);

//    console.log(issuesLocal);
           
},[issues, selectedYear, selectedMonth, selectedTracker]); 
    
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
            title: 'Chamados por módulo',
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

export default Modulo;
