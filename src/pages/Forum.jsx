import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, Send, Loader2, ThumbsUp, Flag, 
  UserCircle2 
} from 'lucide-react';
import { Toaster, toast } from 'sonner';

const ThreadMessage = ({ message, responses, isQuestion = false }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 10));

  return (
    <div className="mb-8">
      {/* Main Question/Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-4 rounded-lg ${
          isQuestion 
            ? 'bg-green-900/40 ring-1 ring-green-800/50' 
            : 'bg-green-800/20 ring-1 ring-green-700/50'
        }`}
      >
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-green-800/50 flex items-center justify-center">
              <UserCircle2 className="w-6 h-6 text-green-400" />
            </div>
          </div>
          <div className="flex-grow">
            <div className="flex items-center mb-1">
              <h3 className="font-medium text-green-200">{message.author}</h3>
              {!isQuestion && (
                <span className="ml-2 text-sm text-green-400">
                  • {message.village} • {message.experience} years farming experience
                </span>
              )}
            </div>
            <p className="text-green-100 mb-3">{message.content}</p>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  setLiked(!liked);
                  setLikeCount(prev => liked ? prev - 1 : prev + 1);
                }}
                className={`flex items-center space-x-1 text-sm ${
                  liked ? 'text-green-400' : 'text-green-500'
                } hover:text-green-400 transition-colors`}
              >
                <ThumbsUp className="w-4 h-4" />
                <span>{likeCount}</span>
              </button>
              <button
                onClick={() => toast.info('This feature is coming soon!')}
                className="flex items-center space-x-1 text-sm text-green-500 hover:text-red-400 transition-colors"
              >
                <Flag className="w-4 h-4" />
                <span>Report</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Thread Line and Responses */}
      {responses && responses.length > 0 && (
        <div className="relative ml-5 mt-2 pl-8 border-l-2 border-green-800/50">
          {responses.map((response, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="mb-4 relative"
            >
              <div className="absolute -left-8 top-4 w-6 h-px bg-green-800/50" />
              <div className="bg-green-800/20 p-4 rounded-lg ring-1 ring-green-700/50">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-green-800/50 flex items-center justify-center">
                      <UserCircle2 className="w-6 h-6 text-green-400" />
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center mb-1">
                      <h3 className="font-medium text-green-200">{response.author}</h3>
                      <span className="ml-2 text-sm text-green-400">
                        • {response.village} • {response.experience} years farming experience
                      </span>
                    </div>
                    <p className="text-green-100">{response.content}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

const generateRandomFarmerName = () => {
  const firstNames = [
    'Rajesh', 'Suresh', 'Ramesh', 'Mahesh', 'Prakash', 
    'Dinesh', 'Bharat', 'Kishan', 'Arjun', 'Gopal'
  ];
  const lastNames = [
    'Patel', 'Singh', 'Yadav', 'Kumar', 'Sharma',
    'Verma', 'Gupta', 'Patil', 'Reddy', 'Choudhary'
  ];
  const villages = [
    'Pratappur', 'Ganeshganj', 'Ramgarh', 'Krishnanagar', 'Bhimpur',
    'Sultanpur', 'Madhavpur', 'Sitapur', 'Gopalnagar', 'Devgarh'
  ];

  return {
    name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
    village: villages[Math.floor(Math.random() * villages.length)],
    experience: Math.floor(Math.random() * 30) + 5 // 5 to 35 years
  };
};

const Forum = () => {
  const [query, setQuery] = useState('');
  const [threads, setThreads] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Sample responses for common farming topics
  const farmingResponses = {
    irrigation: [
      "I've been using drip irrigation for my crops, and it's saved about 30% water compared to flood irrigation. The initial setup cost is high, but it pays off in 2-3 seasons.",
      "In our village, we still rely on traditional canal irrigation but improved it with scheduled watering. We only irrigate in early morning or evening to reduce evaporation loss.",
      "For water conservation, I've implemented a rainwater harvesting system with small check dams. This has helped maintain groundwater levels even during dry seasons.",
      "After years of farming, I've found that mulching combined with drip irrigation works best in our soil. It reduces water usage by almost 40% and keeps weeds in check too."
    ],
    pests: [
      "For controlling aphids, I spray a mixture of neem oil and soap solution once a week. This natural remedy has worked better than chemicals for me over the years.",
      "We use companion planting in our fields - marigolds keep many pests away from vegetables. This traditional method has been passed down for generations in our village.",
      "I've had success with trap crops around the main field. Pests attack these sacrificial plants first, protecting our main crop without needing heavy pesticides.",
      "After trying many methods, I now release ladybugs in my fields to control aphids. This biological control has reduced my pesticide use by 70% in the last three years."
    ],
    soil: [
      "I've been practicing crop rotation for 15 years now, and it has maintained my soil fertility without excessive fertilizers. We rotate legumes with grains every season.",
      "In our village, we prepare our own vermicompost using farm waste. This has improved our soil structure tremendously over the years.",
      "Green manuring has been my secret to maintaining healthy soil. I grow dhaincha before rice cultivation and plow it back into the soil when it flowers.",
      "After years of chemical farming, I switched to organic methods with cow dung manure and jeevamrut. In three years, the soil texture improved significantly with better water retention."
    ],
    crops: [
      "For wheat cultivation, I've found that early sowing by mid-November gives the best yields in our region. It avoids the terminal heat stress in March-April.",
      "We've started intercropping chickpea with mustard and it's working very well. The mustard repels pests that attack chickpea, and we get two crops from the same land.",
      "In our village, we're now growing quinoa as it needs less water than rice and fetches good market prices. The initial learning curve was difficult but worth it.",
      "After experimenting with different varieties, I've settled on growing native rice varieties using SRI method. The yield is comparable to hybrid varieties but with lower input costs."
    ],
    weather: [
      "We've developed a system to predict rainfall by observing insect behavior and cloud patterns. It's more accurate for our local conditions than the weather reports.",
      "To deal with unseasonal rains, I've constructed small drainage channels throughout my fields. This simple solution has saved my crops multiple times in the last few years.",
      "In our region, we now plant heat-tolerant varieties as summers are getting hotter. The traditional varieties we used to grow are no longer suitable with changing climate.",
      "We've started using shade nets for vegetable cultivation during peak summer months. The initial investment is recovered within two seasons with better quality produce."
    ],
    market: [
      "I've joined a farmer producer organization, and we're selling directly to urban consumers. This has increased our profits by eliminating middlemen.",
      "Our village has started a WhatsApp group to share market prices from different mandis. This information helps us decide where to sell our produce for better returns.",
      "I've found that grading and sorting my vegetables before taking them to market increases my profit by at least 15%. Buyers are willing to pay premium for quality produce.",
      "We've started processing part of our produce into pickles and preserves. This value addition has doubled our income compared to selling raw produce."
    ],
    equipment: [
      "Our village collectively purchased a tractor and implements which we share on rotation. This has reduced our individual costs while making mechanization accessible.",
      "I've modified my traditional plow to work better in our stony soil. This local innovation has increased my work efficiency without expensive equipment.",
      "After trying several options, I invested in a power weeder which has reduced our labor costs by 60%. It was expensive but paid for itself within two seasons.",
      "In our area, we've reverted to using bullocks for some operations as it's more suitable for small terraced fields where tractors can't operate efficiently."
    ],
    general: [
      "I've found that maintaining a farm diary to record all activities and observations has improved my decision making. I refer to previous years' notes before planning.",
      "In our village, we practice the tradition of seed sharing which has helped preserve local varieties. These indigenous seeds are more resilient to local conditions.",
      "After farming for 25 years, I've learned that timing is more important than quantity when it comes to inputs. Applying the right input at the right growth stage makes all the difference.",
      "We've formed a knowledge sharing group in our village where the experienced farmers mentor younger ones. This has helped preserve traditional knowledge while adopting new techniques."
    ]
  };

  const generateResponse = (userQuery) => {
    // Generate farmer profiles
    const farmer1 = generateRandomFarmerName();
    const farmer2 = generateRandomFarmerName();
    
    // Determine the topic of the query
    const queryLower = userQuery.toLowerCase();
    let responseTopic = 'general';
    
    if (queryLower.includes('water') || queryLower.includes('irrigation') || queryLower.includes('rain') || queryLower.includes('drought')) {
      responseTopic = 'irrigation';
    } else if (queryLower.includes('pest') || queryLower.includes('insect') || queryLower.includes('bug') || queryLower.includes('disease')) {
      responseTopic = 'pests';
    } else if (queryLower.includes('soil') || queryLower.includes('fertilizer') || queryLower.includes('compost') || queryLower.includes('nutrient')) {
      responseTopic = 'soil';
    } else if (queryLower.includes('crop') || queryLower.includes('seed') || queryLower.includes('variety') || queryLower.includes('plant')) {
      responseTopic = 'crops';
    } else if (queryLower.includes('weather') || queryLower.includes('climate') || queryLower.includes('temperature') || queryLower.includes('season')) {
      responseTopic = 'weather';
    } else if (queryLower.includes('market') || queryLower.includes('price') || queryLower.includes('sell') || queryLower.includes('profit')) {
      responseTopic = 'market';
    } else if (queryLower.includes('equipment') || queryLower.includes('tool') || queryLower.includes('machine') || queryLower.includes('tractor')) {
      responseTopic = 'equipment';
    }
    
    // Randomly select responses for the determined topic
    const availableResponses = [...farmingResponses[responseTopic]];
    
    // Ensure we get two different responses
    const shuffleArray = array => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };
    
    shuffleArray(availableResponses);
    
    // Format responses with farmer information
    return [
      {
        author: farmer1.name,
        village: farmer1.village,
        experience: farmer1.experience,
        content: availableResponses[0] || "Based on my experience, I've seen good results with traditional farming methods combined with some modern techniques. Every region has its own unique challenges."
      },
      {
        author: farmer2.name,
        village: farmer2.village,
        experience: farmer2.experience,
        content: availableResponses[1] || "In our area, we follow practices that have been passed down for generations. It's important to adapt to changing conditions while respecting traditional knowledge."
      }
    ];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      toast.error('Please enter a question');
      return;
    }

    setIsLoading(true);
    try {
      const userMessage = {
        author: 'You',
        content: query
      };

      // Use timeout to simulate API call
      setTimeout(() => {
        const responses = generateResponse(query);
        setThreads(prev => [...prev, { question: userMessage, responses }]);
        setQuery('');
        toast.success('Farmers have responded to your question!');
        setIsLoading(false);
      }, 1500);
      
    } catch (error) {
      toast.error('Failed to get responses. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" richColors closeButton />
      
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center p-2 bg-green-900/50 rounded-full mb-4 ring-1 ring-green-800/50"
          >
            <MessageCircle className="w-6 h-6 text-green-400" />
          </motion.div>
          <h1 className="text-3xl font-bold text-green-100 mb-2">Farmers' Forum</h1>
          <p className="text-green-200">Share your farming queries and get advice from experienced farmers</p>
        </div>

        {/* Question Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-900/40 rounded-lg shadow-md p-4 mb-8 ring-1 ring-green-800/50"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask your farming related question here..."
              className="w-full px-4 py-3 rounded-lg bg-green-800/20 border border-green-800/50 text-green-100 placeholder-green-500 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              rows={3}
              disabled={isLoading}
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center space-x-2 bg-green-600 text-green-100 px-6 py-2 rounded-lg hover:bg-green-500 transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
                <span>Post Question</span>
              </button>
            </div>
          </form>
        </motion.div>

        {/* Threads */}
        <div className="space-y-6">
          {threads.map((thread, index) => (
            <ThreadMessage 
              key={index}
              message={thread.question}
              responses={thread.responses}
              isQuestion={true}
            />
          ))}
          
          {threads.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-green-500 opacity-50" />
              <p className="text-green-400">No discussions yet. Start a conversation by asking a question!</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Forum;
