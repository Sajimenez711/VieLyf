const User = require('../../models/User');
const Diet = require('../../models/Diet');
const BodyAnalysis = require('../../models/BodyAnalysis');
const PatientRequest = require('../../models/PatientRequest');
module.exports=(app) => {

  app.get('/api/accounts/nutritionistcatalog',(req,res,next)=>{
    //get the chart Id
    const {query}=req;
    const {chart}=query;
    
    User.find({'Role':'Nutritionist'}, (err, doc)  => {
      return res.json(doc);
    });
  });

  app.post('/api/accounts/newPatientRequest', (req,res) =>{
    const { body } = req;
    const {
        Nutritionist_id,
        Client_id
    } = body;
         
    const newPatientRequest = new PatientRequest();
    newPatientRequest.Nutritionist_id=Nutritionist_id;
    newPatientRequest.Client_id=Client_id;
                
    newPatientRequest.save((err,nPatient)=>{
        if(err){
            return  res.send({
                success:false,
                message:'Error',
            });
        }else{
            return  res.send({
                success:true,
                message:'Information PatientRequest captured',
            });
        }
    });
  });

  app.post("/api/account/relationup", (req, res, next) => {
    const { body } = req;
    const {
      Client_id,
      Nutritionist_id,
    } = body;

    PatientRequest.find({ Client_id: Client_id, Status: 'accepted' }, (err, previousUser) => {
    if (err) {
        return res.send("Error");
    } else if (previousUser.length > 0) {
        return res.send({
            success:false,
            message:"Error in users"
        });
    }
    const newPatientRequest = new PatientRequest();
    newPatientRequest.Nutritionist_id=Nutritionist_id;
    newPatientRequest.Client_id=Client_id;
    newPatientRequest.Status='accepted'
    
    newPatientRequest.save((err, doc)=>{
        if(err){
            return  res.send({
                success:false,
                message:'Error',
            });
        }else{
            const newDiet = new Diet();
            newDiet.patient= newPatientRequest._id
            newDiet.breakfastMilk=0;
            newDiet.breakfastVeg=0;
            newDiet.breakfastFruit=0;
            newDiet.breakfastCereal=0;
            newDiet.breakfastMeat=0;
            newDiet.breakfastFat=0;
            newDiet.breakfastSugar=0;
            newDiet.lunchMilk=0;
            newDiet.lunchVeg=0;
            newDiet.lunchFruit=0;
            newDiet.lunchCereal=0;
            newDiet.lunchMeat=0;
            newDiet.lunchFat=0;
            newDiet.lunchSugar=0;
            newDiet.dinnerMilk=0;
            newDiet.dinnerVeg=0;
            newDiet.dinnerFruit=0;
            newDiet.dinnerCereal=0;
            newDiet.dinnerMeat=0;
            newDiet.dinnerFat=0;
            newDiet.dinnerSugar=0;
            newDiet.collationMilk=0;
            newDiet.collationVeg=0;
            newDiet.collationFruit=0;
            newDiet.collationCereal=0;
            newDiet.collationMeat=0;
            newDiet.collationFat=0;
            newDiet.collationSugar=0;
            newDiet.save((err,DietM)=>{
                if(err)
                {
                return  res.send({
                    success:false,
                    message:'Error'
                });
                }else{
                return  res.send({
                success:true,
                message:'Information PatientRequest captured',
            });
            }
        });
            
        }
    })
  });
  })
}