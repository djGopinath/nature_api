const express=require('express');
const app = express();

app.get('/',(req, res) => {
    res.status(200).json({message:'Hello, this is the API for Nature Tours!'});
})

app.post('/',(req, res) => {
    res.send('Hello, You have successfully posted');
})


const port=3000;
app.listen(port,()=>{
    console.log(`Server is running on port ${port}...`);
})