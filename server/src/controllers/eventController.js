import Event from '../models/Event.js';
import cloudinary from '../config/cloudinary.js';
import mongoose from 'mongoose';

// @desc    Create new event
// @route   POST /api/events
// @access  Protected
export const createEvent = async (req, res) => {
  try {
    // Check if image is provided
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an image'
      });
    }

    // Verify and configure Cloudinary (configure here, after dotenv has loaded)
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return res.status(500).json({
        success: false,
        message: 'Cloudinary configuration missing. Please check .env file.'
      });
    }

    // Configure Cloudinary before use
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });

    // Upload image to Cloudinary (base64 method)
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;
    const result = await cloudinary.uploader.upload(dataURI);
    const imageUrl = result.secure_url;

    // Extract fields from request
    const { title, description, date, location, capacity } = req.body;

    // Debug logging - log the full request body
    console.log('Full req.body:', req.body);
    console.log('Received form data:', { title, description, date, location, capacity });
    console.log('Has file:', !!req.file);

    // Validate all fields are present and not empty
    const trimmedTitle = title?.trim();
    const trimmedDescription = description?.trim();
    const trimmedLocation = location?.trim();
    
    if (!trimmedTitle || !trimmedDescription || !date || !trimmedLocation || !capacity) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, description, date, location, capacity',
        received: { 
          title: trimmedTitle || null, 
          description: trimmedDescription || null, 
          date: date || null, 
          location: trimmedLocation || null, 
          capacity: capacity || null 
        }
      });
    }

    // Create event
    const event = await Event.create({
      title: trimmedTitle,
      description: trimmedDescription,
      date: new Date(date),
      location: trimmedLocation,
      capacity: Number(capacity),
      imageUrl,
      createdBy: req.user.id
    });

    // Populate creator info and return
    await event.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      event
    });
  } catch (error) {
    console.error('Create Event Error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    // Handle Cloudinary errors
    if (error.message && error.message.includes('cloudinary')) {
      return res.status(400).json({
        success: false,
        message: 'Image upload failed. Please check Cloudinary configuration.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message || 'Unknown error'
    });
  }
};

// @desc    Get all events
// @route   GET /api/events
// @access  Public
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate('createdBy', 'name email')
      .sort({ date: 1 }); // Sort ascending (earliest first)

    res.status(200).json({
      success: true,
      count: events.length,
      events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
export const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('attendees', 'name email');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Protected (creator only)
export const updateEvent = async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user is the creator
    if (event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this event'
      });
    }

    // Handle image upload if new image provided
    let imageUrl = event.imageUrl; // Keep existing image by default
    if (req.file) {
      // Verify and configure Cloudinary (configure here, after dotenv has loaded)
      if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        return res.status(500).json({
          success: false,
          message: 'Cloudinary configuration missing. Please check .env file.'
        });
      }

      // Configure Cloudinary before use
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
      });

      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      const result = await cloudinary.uploader.upload(dataURI);
      imageUrl = result.secure_url;
    }

    // Whitelist allowed fields (security: don't allow createdBy or attendees to be changed)
    const { title, description, date, location, capacity } = req.body;
    
    const updates = {};
    if (title) updates.title = title;
    if (description) updates.description = description;
    if (date) updates.date = new Date(date);
    if (location) updates.location = location;
    if (capacity) updates.capacity = Number(capacity);
    if (imageUrl) updates.imageUrl = imageUrl;

    // Update event
    event = await Event.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      event
    });
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Protected (creator only)
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user is the creator
    if (event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this event'
      });
    }

    // Delete event
    await event.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    RSVP to event
// @route   POST /api/events/:id/rsvp
// @access  Protected
export const rsvpEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID format'
      });
    }

    // Atomic operation - checks capacity and adds user in one database operation
    const event = await Event.findOneAndUpdate(
      {
        _id: id,
        $expr: { $lt: [{ $size: "$attendees" }, "$capacity"] },  // Capacity check
        attendees: { $ne: userId }  // Not already in attendees
      },
      {
        $addToSet: { attendees: userId }  // Add user atomically (prevents duplicates)
      },
      { new: true }  // Return updated document
    );

    // If update failed, determine the reason
    if (!event) {
      // Check if event exists and get failure reason
      const originalEvent = await Event.findById(id);

      if (!originalEvent) {
        return res.status(404).json({
          success: false,
          message: 'Event not found'
        });
      }

      // Check if user already RSVPed
      if (originalEvent.attendees.some(attendee => attendee.toString() === userId)) {
        return res.status(400).json({
          success: false,
          message: 'You have already RSVPed to this event'
        });
      }

      // Must be capacity full
      return res.status(400).json({
        success: false,
        message: 'Event is full'
      });
    }

    // Success - populate attendees and return
    await event.populate('attendees', 'name email');
    
    res.status(200).json({
      success: true,
      message: 'Successfully RSVPed to event',
      event
    });
  } catch (error) {
    console.error('RSVP Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Cancel RSVP to event
// @route   POST /api/events/:id/cancel
// @access  Protected
export const cancelRsvp = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID format'
      });
    }

    // Check if event exists first
    const originalEvent = await Event.findById(id);
    
    if (!originalEvent) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user is actually RSVPed
    if (!originalEvent.attendees.some(attendee => attendee.toString() === userId)) {
      return res.status(400).json({
        success: false,
        message: 'You are not RSVPed to this event'
      });
    }

    // Remove user from attendees array using $pull
    const event = await Event.findByIdAndUpdate(
      id,
      { $pull: { attendees: userId } },
      { new: true }
    ).populate('attendees', 'name email');

    res.status(200).json({
      success: true,
      message: 'RSVP cancelled successfully',
      event
    });
  } catch (error) {
    console.error('Cancel RSVP Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

