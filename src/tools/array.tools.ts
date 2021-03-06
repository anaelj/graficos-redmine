/* eslint-disable array-callback-return */

export const arrayMonths = [{value: '01', label: 'Janeiro'},
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
{value: '12', label: 'Dezembro'},];

interface ICustom_fields {
  id : number;
  name: string;
  value: string;  
}

export interface IIssues {
  id : number;
  custom_fields : ICustom_fields[];  
  project: {id: number, name: string} 
  created_on: string;
  tracker : ITraker;
}

export interface IModule {
    name : string;
}

export interface ITraker {
    id: number;
    name : string;
}

export interface IProject {
    name : string;
}


export function getModules ( pArray : IIssues[] ){
   const modules : Array<IModule>= [];
    
   pArray.map( item => {
    item && item.custom_fields && item.custom_fields.filter(
            subItem => {  
                if ((subItem.name === 'Módulo') && (!modules.find( el => el.name === subItem.value))) {
                    modules.push({ name:  subItem.value});
                }
         })}); 

   return  modules;     
 
}
export function getTrackers ( pArray : IIssues[] ){
    const trakers : Array<ITraker>= [];
    trakers.push({ id: 0, name: 'Todos'});
    
    pArray.map( item =>
                  { 
                     if (item.tracker && !trakers.find( el => el.name === item.tracker.name)) {
                         trakers.push({ id: item.tracker.id, name:  item.tracker.name});
                  }
          });
 
 //         console.log(trakers)
    return  trakers;     
}

export function daysBetween (dateStart : any, dateEnd: any){
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const now = new Date();
    let dataFinal ;
    
    if (dateEnd.getFullYear() === now.getFullYear() ) {
      if (dateEnd.getMonth() > now.getMonth()) {
          dataFinal = now;
      } else {
        dataFinal = dateEnd;
      }
    }  
    else  {
        if (dateEnd.getMonth() === 11) {
            dataFinal = new Date( dateEnd.getFullYear() +1, 0, 1 );
        } else {
            dataFinal = dateEnd;
        }
    }

    // console.log(dateStart);
    // console.log(dataFinal);

    return Math.round(Math.abs((dateStart - dataFinal) / oneDay));
}

export function getProjects ( pArray : IIssues[] ){
   const projects : Array<IProject>= [];
    
   pArray.map( item =>
                 {
                    if (!projects.find( el => el.name === item.project.name)) {
                        projects.push({ name:  item.project.name});
                 }
         });

//         console.log(projects)
   return  projects;     
 
}


