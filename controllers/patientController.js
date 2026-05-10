import Patient from "../models/Patient.js";

export const createPatient = async (req, res) => {
    try{
        const patientData = new Patient(req.body);
        const {contact} = patientData;
        const patientExist = await Patient.findOne({contact})
        if(patientExist){
            return res.status(400).json({message : "Patient already exists."})
        }
        const savedPatient = await patientData.save();
        res.status(200).json(savedPatient);
    }catch(error){
        res.status(500).json({ error: "Internal server error."});
    }
};

export const getAllPatients = async (req, res) => {
    try {
      const patients = await Patient.find();

      if(patients.length===0){
        return res.status(404).json({message : "Patients not Found."})
      }
      res.status(200).json(patients);
    } catch (error) {
      res.status(500).json({error: "Internel server Error. "});
    }
};

export const getPatientById = async (req, res) => {
    try {
      const patient = await Patient.findById(req.params.id);
      if (!patient) {
        return res.status(404).json({message: 'Patient not found' });
      }
      res.status(200).json(patient);
    } catch (error) {
      res.status(500).json({error:"Internal server error" });
    }
};

export const updatePatient = async (req, res) => {
    try {
        const id = req.params.id;
        const patient = await Patient.findByIdAndUpdate(id, req.body, {new: true});
        if (!patient) {
          return res.status(404).json({message: 'Patient not found' });
        }
        res.status(201).json(patient);
    } catch (error) {
        res.status(500).json({error: "Internal server error" });
    }
};

export const deletePatient = async (req, res) => {
    try {
      const patient = await Patient.findByIdAndDelete(req.params.id);
      if (!patient) {
        return res.status(404).json({message: 'Patient not found' });
      }
      res.status(201).json({message: 'Patient deleted successfully' });
    } catch (error) {
      res.status(500).json({error: "Internal server error"});
    }
};