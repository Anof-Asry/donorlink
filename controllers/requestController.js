import BloodRequest from "../models/BloodRequest.js";
import Donor from "../models/Donor.js";

export  const createRequest = async (req,res) => {
    try{
        const request = await BloodRequest.create(req.body);
        res.status(200).json(request);
    }catch(error){
        res.status(500).json({error: "Internal server error"})
    }
};

export const getAllRequests = async (req, res) => {
    try {
      const requests = await BloodRequest.find()
        .populate('patient', 'name bloodGroup hospital')
        .populate('donor', 'name bloodGroup contact');
        if(requests.length===0){
            return res.status(404).json({message : "requests not Found."})
          }
      res.status(200).json(requests);
    } catch (error) {
      res.status(500).json({error: "Internal server error"});
    }
};

export const getRequestById = async (req, res) => {
    try {
      const request = await BloodRequest.findById(req.params.id)
        .populate('patient', 'name bloodGroup hospital')
        .populate('donor', 'name bloodGroup contact');
        if(!request){
            return res.status(404).json({message : "request not Found."})
          }
      res.status(200).json(requests);
    } catch (error) {
      res.status(500).json({error: "Internal server error"});
    }
};

export const updateRequest = async (req, res) => {
    try {
      const request = await BloodRequest.findByIdAndUpdate(req.params.id, req.body, {new: true});
      if (!request) {
        return res.status(404).json({message: 'Request not found' });
      }
      res.status(200).json(request);
    } catch (error) {
      res.status(400).json({error: "Internal server error"});
    }
 };

 export const deleteRequest = async (req, res) => {
    try {
      const request = await BloodRequest.findByIdAndDelete(req.params.id);
      if (!request) {
        return res.status(404).json({message: 'Request not found' });
      }
      res.status(200).json({message: 'Blood request deleted successfully' });
    } catch (error) {
      res.status(500).json({error: "Internal server error"});
    }
};

 export const matchDonor = async (req, res) => {
    try {
      const request = await BloodRequest.findById(req.params.id);
      if (!request) {
        return res.status(404).json({message: 'Request not found' });
      }
  
      const donor = await Donor.findOne({
        bloodGroup: request.bloodGroup,
        isAvailable: true
      });
  
      if (!donor) {
        return res.status(404).json({message: 'No available donor found for this blood group' });
      }
  
      request.donor = donor._id;
      request.status = 'Matched';
      await request.save();
  
      donor.isAvailable = false;
      donor.lastDonated = new Date();
      await donor.save();
  
      res.status(200).json(request);
    } catch (error) {
      res.status(500).json({error: "Internal server error"});
    }
  };