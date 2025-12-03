const Lead = require('../models/lead');

// Get all leads
// exports.getLeads = async (req, res) => {
//   try {
//     const leads = await Lead.find().sort({ createdAt: -1 });
//     res.json(leads);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

exports.getLeads = async (req, res) => {
  try {
    const leads = await Lead.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Add a new lead
// exports.createLead = async (req, res) => {
//   try {
//     const { name, email, status } = req.body;

//     // Check if email already exists
//     const existingLead = await Lead.findOne({ email });
//     if (existingLead) {
//       return res.status(400).json({ error: 'Email already exists' });
//     }

//     const lead = new Lead({ name, email, status });
//     await lead.save();

//     res.status(201).json(lead);
//   } catch (error) {
//     if (error.code === 11000) {
//       return res.status(400).json({ error: 'Email already exists' });
//     }
//     res.status(400).json({ error: error.message });
//   }
// };

exports.createLead = async (req, res) => {
  try {
    const { name, email, status } = req.body;

    const existingLead = await Lead.findOne({ email, user: req.user.id });
    if (existingLead) {
      return res.status(400).json({ error: "Email already exists for this user" });
    }

    const lead = new Lead({
      name,
      email,
      status,
      user: req.user.id
    });

    await lead.save();

    res.status(201).json(lead);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Get a specific lead by ID
exports.getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    res.json(lead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// GET /api/leads?page=1&limit=10
exports.getLeadss = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const leads = await Lead.find().skip(skip).limit(limit).sort({ createdAt: -1 });
    const totalLeads = await Lead.countDocuments();

    res.json({
      leads,
      totalLeads,
      totalPages: Math.ceil(totalLeads / limit),
      currentPage: page
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// PUT /api/leads/:id
exports.updateLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true
    });

    if (!lead) return res.status(404).json({ message: "Lead not found" });

    res.json(lead);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/leads/:id
exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) return res.status(404).json({ message: "Lead not found" });

    res.json({ message: "Lead deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
