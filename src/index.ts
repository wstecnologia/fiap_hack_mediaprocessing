import 'module-alias/register';
import app from "./config/server";
 
const PORT = process.env.PORT

app.listen(PORT,()=>{ 
  console.log(`Server is running in port ${PORT}`); 
}); 
