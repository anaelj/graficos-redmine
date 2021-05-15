import React,{useState, useEffect }  from 'react'
import { arrayMonths, getTrackers, IIssues } from '../../tools/array.tools'
import { Container } from './styles'
import Chart from "react-google-charts";
import Select from 'react-select';
import ReactLoading from 'react-loading';

interface IModuloProps {
    issues : IIssues[];
    modulo : string;
}
const Annualized: React.FC<IModuloProps> = ({ children, issues, modulo, ...rest }) => {

   const [data, setData] = useState([['Mês', 'Quantidade']]);
   const [selectedYear, setSelectedYear] = useState('2021');
   const [loading, setLoading] = useState(false);
   const [selectedTracker, setSelectedTracker] = useState(0);
   const [trackerOptions, settrackerOptions] = useState([{label: 'Todos', value: 0}]);

   useEffect (  () => {

    setLoading(true);
    const issuesLocal = issues.filter(
        item => 
          item.custom_fields.find(itemModulo => itemModulo.value === modulo) 
            && item.created_on.includes(selectedYear) 
            && (item.tracker.id === selectedTracker || selectedTracker === 0)
            //&& selectedTracker > 0 ? item.tracker.id === selectedTracker : item.tracker.id !== selectedTracker 
          );

    let arrayLocal : Array<any> = [];
    arrayLocal = [];
    
    arrayMonths.map( item => {
        return  arrayLocal.push(...[[
                      item.label , 
                      issuesLocal.filter(issue => issue.created_on.includes(selectedYear+'-'+item.value)).length
                    ]])
    })
    settrackerOptions([...getTrackers(issues).map(item => { return ({ label : item.name, value : item.id})})]);
    setData([['Mês', 'Quantidade'], ...arrayLocal]);
    setLoading(false);

        
},[issues, selectedYear, selectedTracker, modulo]); 
    
  return (
   <>
        {loading &&  <ReactLoading type="spokes" color='#000' height={250} width={250} />}
        <Container style={{height:'30px'}}>
          <h1>{modulo}</h1>
        </Container>
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
          chartType="BarChart"
          loader={<div>Loading Chart</div>}
          data={ data }
          options={{
            title: 'Chamados por módulo',
            legend: {position: 'top'},
            chartArea: { width: '65%' },
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

export default Annualized;
