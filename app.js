const express = require('express');
const fs = require('fs');

const app = express();

app.use(express.json());

// read local files
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);
const getAllTours= (req, res) => {
  res
    .status(200)
    .json({ status: 'success', total_records: tours.length, data: { tours } });
}
const getTourById=(req, res) => {
  console.log(req.params)
  const id=req.params.id*1;
  const tour = tours.find((res) => res.id === id);
  if(!tour){
    return res.status(404).json({status: 'fail', message: 'Tour not found'});
  }

  res.status(200)
     .json({ status: 'success', 
       data: { tour }
     });
}
const createTour=(req, res) => {

  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    err=> {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
}
const updateTour=(req, res) => {
  if(req.params.id*1>tours.length){
    return res.status(404).json({status: 'fail', message: 'Invalid ID'});
  }
  res.status(200)
     .json({ status: 'success', 
       data: `<Updated tour here...>`
     });
}
const deleteTour=(req, res) => {
  if(req.params.id*1>tours.length){
    return res.status(404).json({status: 'fail', message: 'Invalid ID'});
  }
  res.status(204)
     .json({ status: 'success', 
       data:null
     });
}

//routes
// //get Request
// app.get('/api/v1/tours', getAllTours );
// //get Request with params
// app.get('/api/v1/tours/:id', getTourById );
// //post request
// app.post('/api/v1/tours',createTour);
// //patch request
// app.patch('/api/v1/tours/:id', updateTour);
// //delete request
// app.delete('/api/v1/tours/:id', deleteTour);

app.route('/api/v1/tours').get(getAllTours).post(createTour);
app.route('/api/v1/tours/:id').get(getTourById).patch(updateTour).delete(deleteTour);

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
