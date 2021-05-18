import React, { useEffect, useState } from 'react';
import Modulo from './component/modulo';
import Annualized from './component/annualized';
import AnnualizedBug from './component/annualizedBug';
import api from './services/api';
import { IIssues, getProjects, IProject, IModule, getModules} from './tools/array.tools';
import ReactLoading from 'react-loading';
import { Button, Container } from './main';

function App() {

  const [issues, setIssues] = useState<IIssues[]>([]);
  const [projects, setProjects] = useState<IProject[]>([]);
  const [modules, setModules] = useState<IModule[]>([]);
  const [loading, setLoading] = useState(false);
  const [showIssuesProject, setShowIssuesProject] = useState(false);
  const [showIssuesAnnualized, setShowIssuesAnnualized] = useState(false);
  const [showIssuesAnnualizedBug, setShowIssuesAnnualizedBug] = useState(false);
  
   async function loadData(skip : number, itens : IIssues[] ): Promise<void> {
     setLoading(true);
    const response = await api.get(`issues.json?status_id=*&limit=100&offset=${skip}&created_on=%3E%3C2020-01-01|2021-06-01&key=1927788238b0418601fd837aeabcdd9437042b4c`);        
    const newArray : IIssues[] = response.data.issues;
   
    if (newArray.length === 100){
     await loadData(skip+100, [...itens, ...newArray]) ;
    } else {
      setLoading(false);
      setIssues([...itens, ...newArray]);;

    }

  }

  useEffect (  () => {

    setProjects(getProjects(issues));
    setModules(getModules(issues));

  },[issues]); 

  return (
   <>
    {loading &&  <div style={{display: 'flex', alignContent: 'center', justifyContent: 'center', margin: '20px', marginTop: '50px'}}><ReactLoading type="spokes" color='#000' height={250} width={250} /></div>}

    {!loading &&
      <Container>
        <Button onClick={() => loadData(0,[])}>Carregar dados</Button>
        <Button onClick={() => setShowIssuesProject(!showIssuesProject)}> Chamados por projeto</Button>
        <Button onClick={() => setShowIssuesAnnualized(!showIssuesAnnualized)}> Chamados por módulo</Button>
        <Button onClick={() => setShowIssuesAnnualizedBug(!showIssuesAnnualizedBug)}> Origem Bug</Button>
      </Container>
    }  
      {showIssuesProject &&  
                projects.map( (itemProject, idx) => {
                  return  <Modulo key={idx} issues={issues} projeto={itemProject.name}/>
                  })
        }  
      
      {showIssuesAnnualized && 
               modules.map( (item, idx) => {
                return  <Annualized key={idx} issues={issues} modulo={item.name}/>
             })
      }
      {showIssuesAnnualizedBug && 
               modules.map( (item, idx) => {
                return  <AnnualizedBug key={idx} issues={issues} modulo={item.name}/>
             })
      }
    </>
  );
}

export default App;
