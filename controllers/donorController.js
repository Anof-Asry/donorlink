import Donor from "../models/Donor.js";

export const createDonor = async (req, res) => {
    try{
        const donarData = new Donor(req.body);
        const {contact} = donarData;
        const donorExist = await Donor.findOne({contact})
        if(donorExist){
            return res.status(400).json({message : "Donor already exists."})
        }
        const savedDonor = await donarData.save();
        res.status(200).json(savedDonor);
    }catch(error){
        res.status(500).json({ error: "Internal server error."});
    }
};

export const getAllDonors = async (req, res) => {
    try {
      const donors = await Donor.find();

      if(donors.length===0){
        return res.status(404).json({message : "Donors not Found."})
      }
      res.status(200).json(donors);
    } catch (error) {
      res.status(500).json({error: "Internel server Error. "});
    }
};

export const getDonorById = async (req, res) => {
    try {
      const donor = await Donor.findById(req.params.id);
      if (!donor) {
        return res.status(404).json({message: 'Donor not found' });
      }
      res.status(200).json(donor);
    } catch (error) {
      res.status(500).json({error:"Internal server error" });
    }
};

export const updateDonor = async (req, res) => {
    try {
        const id = req.params.id;
        const donor = await Donor.findByIdAndUpdate(id, req.body, {new: true});
        if (!donor) {
          return res.status(404).json({message: 'Donor not found' });
        }
        res.status(201).json(donor);
    } catch (error) {
        res.status(500).json({error: "Internal server error" });
    }
};

export const deleteDonor = async (req, res) => {
    try {
      const donor = await Donor.findByIdAndDelete(req.params.id);
      if (!donor) {
        return res.status(404).json({message: 'Donor not found' });
      }
      res.status(201).json({message: 'Donor deleted successfully' });
    } catch (error) {
      res.status(500).json({error: "Internal server error"});
    }
};

export const getDonorsByBloodGroup = async (req, res) => {
    try {
      const donors = await Donor.find({ 
        bloodGroup: req.params.bloodGroup,
        isAvailable: true 
      });
      if(donors.length===0){
         return res.status(404).json({message:"Donors not found"})
      }
      res.status(200).json(donors);
    } catch (error) {
      res.status(500).json({error: "Internal server error"});
    }
};