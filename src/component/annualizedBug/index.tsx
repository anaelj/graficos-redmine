/* eslint-disable array-callback-return */

import React,{useState, useEffect }  from 'react'
import { arrayMonths, IIssues } from '../../tools/array.tools'
import { Container } from './styles'
import Chart from "react-google-charts";
import Select from 'react-select';
import ReactLoading from 'react-loading';

interface IModuloProps {
    issues : IIssues[];
    modulo : string;
}
const Annualized: React.FC<IModuloProps> = ({ children, issues, modulo, ...rest }) => {

   const [data, setData] = useState([['Mês', 'Cliente', 'Interno']]);
   const [selectedYear, setSelectedYear] = useState('2021');
   const [loading, setLoading] = useState(false);

   useEffect (  () => {

    setLoading(true);
    const issuesLocal = issues.filter(
        item =>
        item && item.custom_fields && item.custom_fields.find(icf => icf.id ===1 && icf.value === modulo) 
            && item.created_on.includes(selectedYear) 
            && item.tracker.id === 1
            //&& selectedTracker > 0 ? item.tracker.id === selectedTracker : item.tracker.id !== selectedTracker 
          );

    let arrayLocal : Array<any> = [];
    arrayLocal = [];
    
    arrayMonths.map( item => {
         return arrayLocal.push(...[[
                      item.label , 
                      issuesLocal.filter(issue => issue.created_on.includes(selectedYear+'-'+item.value) && issue.custom_fields.find(ctf => ctf.id === 10 && ctf.value === 'Cliente')).length,
                      issuesLocal.filter(issue => issue.created_on.includes(selectedYear+'-'+item.value) && issue.custom_fields.find(ctf => ctf.id === 10 && ctf.value === 'Teste Interno')).length
                    ]])
    })

    setData([['Mês', 'Cliente', 'Interno'], ...arrayLocal]);
    setLoading(false);

 // console.log(getTrackers(issuesLocal));
    
           
},[issues, selectedYear, modulo]); 
    
if (!modulo) {
  return (<></>)
} else {
   
   return (
   <>
        {loading &&  <ReactLoading type="spokes" color='#000' height={250} width={250} />}
        <Container>
            <h1>{modulo}</h1>
            <div >
                <Select defaultValue={{value:'2021', label: '2021'}} 
                    options={[
                                 {value: '2020', label: '2020'},
                                 {value: '2021', label: '2021'},
                                 {value: '2022', label: '2022'}
                            ]} 
                    onChange={(e)=> e && setSelectedYear(e.value) } />
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
}

export default Annualized;
