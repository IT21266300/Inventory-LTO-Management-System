import React from 'react';
import { DataGrid} from '@mui/x-data-grid';
const TeamsTable = ({result})=>{
const data ={}
    if(result.data !== undefined){
        data = result.data.map((data) => ({
        name:data.name,
        position: data.position,
         
       }))};
      console.log(result);
return(
    <DataGrid
    checkboxSelection
    data={data}
    pageSize={10}
    
  />
)
}
export default TeamsTable