import { supabase } from './supabase.js';

// Helper function to set user context for RLS
const setUserContext = async (clerkUserId) => {
  if (!clerkUserId) return;

  try {
    // Set the user context for RLS policies
    await supabase.rpc('set_claim', {
      claim: 'sub',
      value: clerkUserId
    });
  } catch (error) {
    console.log('Could not set user context (this is expected if RPC function is not available):', error.message);
  }
};

// Simple database check function
export const initializeDatabase = async () => {
  try {
    console.log('Checking database connection...');

    // Simple connection test
    const { data, error } = await supabase
      .from('forums')
      .select('count')
      .limit(1);

    if (error) {
      console.error('Database connection error:', error);
      return { success: false, error };
    }

    console.log('Database connection successful');
    return { success: true };
  } catch (error) {
    console.error('Database initialization error:', error);
    return { success: false, error };
  }
};

// Forum operations
export const forumOperations = {
  // Get all forum posts
  async getAllPosts() {
    try {
      const { data, error } = await supabase
        .from('forums')
        .select(`
          *,
          forum_replies (
            id,
            content,
            user_name,
            created_at
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error fetching posts:', error);
      return { success: false, error: error.message };
    }
  },

  // Create a new forum post
  async createPost(postData) {
    try {
      await setUserContext(postData.clerk_user_id);

      const { data, error } = await supabase
        .from('forums')
        .insert([postData])
        .select();

      if (error) {
        console.error('Error creating post:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Error creating post:', error);
      return { success: false, error: error.message };
    }
  },

  // Add a reply to a forum post
  async addReply(replyData) {
    try {
      await setUserContext(replyData.clerk_user_id);

      const { data, error } = await supabase
        .from('forum_replies')
        .insert([replyData])
        .select();

      if (error) {
        console.error('Error adding reply:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Error adding reply:', error);
      return { success: false, error: error.message };
    }
  },

  // Get a specific forum post with replies
  async getPost(postId) {
    try {
      const { data, error } = await supabase
        .from('forums')
        .select(`
          *,
          forum_replies (
            id,
            clerk_user_id,
            user_name,
            content,
            created_at,
            is_solution
          )
        `)
        .eq('id', postId)
        .single();

      if (error) {
        console.error('Error fetching post:', error);
        return { success: false, error: error.message };
      }
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching post:', error);
      return { success: false, error: error.message };
    }
  },

  // Update a forum post
  async updatePost(postId, updates, clerkUserId) {
    try {
      await setUserContext(clerkUserId);

      const { data, error } = await supabase
        .from('forums')
        .update(updates)
        .eq('id', postId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error updating post:', error);
      return { success: false, error: error.message };
    }
  },

  // Delete a forum post
  async deletePost(postId, clerkUserId) {
    try {
      console.log('Attempting to delete post with ID:', postId);
      console.log('User ID:', clerkUserId);

      await setUserContext(clerkUserId);

      // First delete all replies for this post
      console.log('Deleting replies for post:', postId);
      const { data: repliesData, error: repliesError } = await supabase
        .from('forum_replies')
        .delete()
        .eq('forum_id', postId)
        .select();

      if (repliesError) {
        console.error('Error deleting replies:', repliesError);
        return { success: false, error: repliesError.message };
      }

      console.log('Deleted replies:', repliesData);

      // Then delete the post
      console.log('Deleting main post:', postId);
      const { data: postData, error: postError } = await supabase
        .from('forums')
        .delete()
        .eq('id', postId)
        .select();

      if (postError) {
        console.error('Error deleting post:', postError);
        return { success: false, error: postError.message };
      }

      console.log('Deleted post:', postData);

      if (!postData || postData.length === 0) {
        console.warn('No post was deleted. This might indicate the post doesn\'t exist or user lacks permission.');
        return { success: false, error: 'Post not found or insufficient permissions' };
      }

      console.log('Post deletion successful');
      return { success: true };
    } catch (error) {
      console.error('Error deleting post:', error);
      return { success: false, error: error.message };
    }
  },

  // Delete a reply
  async deleteReply(replyId, clerkUserId) {
    try {
      await setUserContext(clerkUserId);

      const { error } = await supabase
        .from('forum_replies')
        .delete()
        .eq('id', replyId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting reply:', error);
      return { success: false, error: error.message };
    }
  }
};

// Farmer Support operations
export const farmerSupportOperations = {
  // Get all farmer cases
  async getAllFarmerCases() {
    try {
      const { data, error } = await supabase
        .from('farmer_cases')
        .select(`
          *,
          donations (
            id,
            amount,
            donor_name,
            message,
            created_at
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching farmer cases:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error fetching farmer cases:', error);
      return { success: false, error: error.message };
    }
  },

  // Create a new farmer case
  async createFarmerCase(caseData) {
    try {
      await setUserContext(caseData.clerk_user_id);

      const { data, error } = await supabase
        .from('farmer_cases')
        .insert([caseData])
        .select();

      if (error) {
        console.error('Error creating farmer case:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Error creating farmer case:', error);
      return { success: false, error: error.message };
    }
  },

  // Add a donation to a farmer case
  async addDonation(donationData) {
    try {
      const { data, error } = await supabase
        .from('donations')
        .insert([donationData])
        .select();

      if (error) {
        console.error('Error adding donation:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Error adding donation:', error);
      return { success: false, error: error.message };
    }
  },

  // Get donations for a specific farmer case
  async getDonationsForCase(caseId) {
    try {
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .eq('case_id', caseId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching donations:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error fetching donations:', error);
      return { success: false, error: error.message };
    }
  }
};

// Land lease operations
export const landLeaseOperations = {
  // Get all land listings
  async getAllLandListings() {
    try {
      const { data, error } = await supabase
        .from('land_listings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching land listings:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error fetching land listings:', error);
      return { success: false, error: error.message };
    }
  },

  // Create a new land listing
  async createLandListing(listingData) {
    try {
      await setUserContext(listingData.clerk_user_id);

      const { data, error } = await supabase
        .from('land_listings')
        .insert([listingData])
        .select();

      if (error) {
        console.error('Error creating land listing:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Error creating land listing:', error);
      return { success: false, error: error.message };
    }
  },

  // Create a lease proposal
  async createLeaseProposal(proposalData) {
    try {
      await setUserContext(proposalData.clerk_user_id);

      const { data, error } = await supabase
        .from('lease_proposals')
        .insert([proposalData])
        .select();

      if (error) {
        console.error('Error creating lease proposal:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Error creating lease proposal:', error);
      return { success: false, error: error.message };
    }
  },

  // Get proposals for a specific land listing
  async getProposalsForListing(listingId) {
    try {
      const { data, error } = await supabase
        .from('lease_proposals')
        .select('*')
        .eq('land_listing_id', listingId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching proposals:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error fetching proposals:', error);
      return { success: false, error: error.message };
    }
  },

  // Get user's land listings
  async getUserLandListings(clerkUserId) {
    try {
      const { data, error } = await supabase
        .from('land_listings')
        .select('*')
        .eq('clerk_user_id', clerkUserId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user land listings:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error fetching user land listings:', error);
      return { success: false, error: error.message };
    }
  },

  // Get user's lease proposals
  async getUserLeaseProposals(clerkUserId) {
    try {
      const { data, error } = await supabase
        .from('lease_proposals')
        .select(`
          *,
          land_listings (
            title,
            location,
            area,
            price_per_acre,
            owner_name
          )
        `)
        .eq('clerk_user_id', clerkUserId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user lease proposals:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error fetching user lease proposals:', error);
      return { success: false, error: error.message };
    }
  }
};

// Equipment lease operations
export const equipmentLeaseOperations = {
  // Get all equipment listings
  async getAllEquipmentListings() {
    try {
      const { data, error } = await supabase
        .from('equipment_listings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching equipment listings:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error fetching equipment listings:', error);
      return { success: false, error: error.message };
    }
  },

  // Create a new equipment listing
  async createEquipmentListing(listingData) {
    try {
      await setUserContext(listingData.clerk_user_id);

      const { data, error } = await supabase
        .from('equipment_listings')
        .insert([listingData])
        .select();

      if (error) {
        console.error('Error creating equipment listing:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Error creating equipment listing:', error);
      return { success: false, error: error.message };
    }
  },

  // Create an equipment rental request
  async createRentalRequest(requestData) {
    try {
      await setUserContext(requestData.clerk_user_id);

      const { data, error } = await supabase
        .from('equipment_rental_requests')
        .insert([requestData])
        .select();

      if (error) {
        console.error('Error creating rental request:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Error creating rental request:', error);
      return { success: false, error: error.message };
    }
  },

  // Get rental requests for a specific equipment listing
  async getRequestsForEquipment(equipmentId) {
    try {
      const { data, error } = await supabase
        .from('equipment_rental_requests')
        .select('*')
        .eq('equipment_listing_id', equipmentId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching rental requests:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error fetching rental requests:', error);
      return { success: false, error: error.message };
    }
  },

  // Get user's equipment listings
  async getUserEquipmentListings(clerkUserId) {
    try {
      const { data, error } = await supabase
        .from('equipment_listings')
        .select('*')
        .eq('clerk_user_id', clerkUserId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user equipment listings:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error fetching user equipment listings:', error);
      return { success: false, error: error.message };
    }
  },

  // Get user's rental requests
  async getUserRentalRequests(clerkUserId) {
    try {
      const { data, error } = await supabase
        .from('equipment_rental_requests')
        .select(`
          *,
          equipment_listings (
            name,
            type,
            location,
            price_per_day,
            owner_name
          )
        `)
        .eq('clerk_user_id', clerkUserId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user rental requests:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error fetching user rental requests:', error);
      return { success: false, error: error.message };
    }
  }
}; 