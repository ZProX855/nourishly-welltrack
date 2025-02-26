import { Layout } from "@/components/Layout";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Scale, Target, Users, Route, Brain, ArrowRight, Send, Upload } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useToast } from "@/components/ui/use-toast";

interface NutritionalInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Index = () => {
  const { toast } = useToast();
  const [food1, setFood1] = useState("");
  const [food2, setFood2] = useState("");
  const [weight1, setWeight1] = useState("100");
  const [weight2, setWeight2] = useState("100");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState<number | null>(null);
  const [bmiCategory, setBmiCategory] = useState<string>("");
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "👋 Hi! I'm your friendly nutrition assistant. How can I help you today?" }
  ]);
  const [loadingChat, setLoadingChat] = useState(false);

  const foodCategories = {
    'Proteins': [
      'Chicken Breast', 'Salmon', 'Beef Steak', 'Tofu', 'Eggs', 
      'Greek Yogurt', 'Tuna', 'Turkey', 'Shrimp', 'Tempeh',
      'Cottage Cheese', 'Pork Chop', 'Lamb', 'Chickpeas', 'Black Beans'
    ],
    'Grains': [
      'Brown Rice', 'Quinoa', 'Oatmeal', 'Whole Wheat Bread', 'Pasta',
      'Barley', 'Buckwheat', 'Millet', 'Couscous', 'Bulgur',
      'Rice Noodles', 'Corn Tortilla', 'Rye Bread', 'Farro', 'Wild Rice'
    ],
    'Vegetables': [
      'Broccoli', 'Spinach', 'Kale', 'Sweet Potato', 'Carrot',
      'Bell Pepper', 'Cucumber', 'Tomato', 'Zucchini', 'Cauliflower',
      'Brussels Sprouts', 'Asparagus', 'Green Beans', 'Eggplant', 'Mushrooms'
    ],
    'Fruits': [
      'Apple', 'Banana', 'Orange', 'Strawberries', 'Blueberries',
      'Mango', 'Pineapple', 'Avocado', 'Grape', 'Watermelon',
      'Kiwi', 'Peach', 'Pear', 'Pomegranate', 'Raspberries'
    ],
    'Healthy Fats': [
      'Olive Oil', 'Almonds', 'Walnuts', 'Chia Seeds', 'Flax Seeds',
      'Coconut Oil', 'Avocado Oil', 'Peanut Butter', 'Sunflower Seeds', 'Pumpkin Seeds',
      'Cashews', 'Macadamia Nuts', 'Pistachios', 'Hemp Seeds', 'Brazil Nuts'
    ]
  };

  const getFoodOptions = () => {
    return Object.entries(foodCategories).flatMap(([category, foods]) =>
      foods.map(food => ({
        value: food.toLowerCase().replace(/\s+/g, '-'),
        label: food,
        category
      }))
    );
  };

  const foodOptions = getFoodOptions();

  const [nutritionalInfo, setNutritionalInfo] = useState<Record<string, NutritionalInfo>>({});

  const fetchNutritionalInfo = async (foodName: string) => {
    try {
      const response = await fetch('https://lxkowsyqeishluutfdfw.supabase.co/functions/v1/nutrition-ai', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4a293c3lxZWlzaGx1dXRmZGZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1NTIyNjQsImV4cCI6MjA1NjEyODI2NH0.D6uaO9IsIOT-A2WK3VHbS8o1Tx4olaxYQeBeIGnD2VI'
        },
        body: JSON.stringify({
          type: 'food',
          message: `Provide nutritional information for ${foodName}`
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error('Failed to fetch nutritional info');
      }

      const nutritionData = await response.json();
      if (nutritionData.error) {
        throw new Error(nutritionData.error);
      }

      setNutritionalInfo(prev => ({
        ...prev,
        [foodName]: nutritionData
      }));
    } catch (error) {
      console.error('Fetch error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch nutritional information. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleFoodSelection = async (value: string, setFood: (value: string) => void) => {
    setFood(value);
    const foodName = foodOptions.find(f => f.value === value)?.label || '';
    if (foodName && !nutritionalInfo[foodName]) {
      await fetchNutritionalInfo(foodName);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const newMessage: Message = { role: 'user', content: chatInput };
    setMessages(prev => [...prev, newMessage]);
    setChatInput('');
    setLoadingChat(true);

    try {
      const response = await fetch('https://lxkowsyqeishluutfdfw.supabase.co/functions/v1/nutrition-ai', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4a293c3lxZWlzaGx1dXRmZGZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1NTIyNjQsImV4cCI6MjA1NjEyODI2NH0.D6uaO9IsIOT-A2WK3VHbS8o1Tx4olaxYQeBeIGnD2VI'
        },
        body: JSON.stringify({
          type: 'chat',
          message: chatInput
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setMessages(prev => [...prev, { role: 'assistant', content: data }]);
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to get AI response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoadingChat(false);
    }
  };

  const calculateBMI = () => {
    if (height && weight) {
      const heightInMeters = parseFloat(height) / 100;
      const weightInKg = parseFloat(weight);
      const calculatedBMI = weightInKg / (heightInMeters * heightInMeters);
      setBmi(Math.round(calculatedBMI * 10) / 10);

      if (calculatedBMI < 18.5) {
        setBmiCategory("Underweight");
      } else if (calculatedBMI < 25) {
        setBmiCategory("Normal weight");
      } else if (calculatedBMI < 30) {
        setBmiCategory("Overweight");
      } else {
        setBmiCategory("Obese");
      }
    }
  };

  const NutritionalProgress = ({ foodId, weight }: { foodId: string; weight: string }) => {
    if (!foodId) return null;
    const foodName = foodOptions.find(f => f.value === foodId)?.label;
    if (!foodName || !nutritionalInfo[foodName]) return null;

    const baseInfo = nutritionalInfo[foodName];
    const multiplier = parseFloat(weight) / 100;
    const info = {
      calories: Math.round(baseInfo.calories * multiplier * 10) / 10,
      protein: Math.round(baseInfo.protein * multiplier * 10) / 10,
      carbs: Math.round(baseInfo.carbs * multiplier * 10) / 10,
      fat: Math.round(baseInfo.fat * multiplier * 10) / 10,
      fiber: Math.round(baseInfo.fiber * multiplier * 10) / 10,
    };

    return (
      <div className="space-y-6 mt-4 animate-fade-in">
        <h3 className="text-lg font-medium text-wellness-700">{foodName}</h3>
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-wellness-700">Calories</span>
            <span className="text-wellness-600">{info.calories} kcal</span>
          </div>
          <ProgressBar value={info.protein} max={50} label="Protein" className="bg-wellness-100" />
          <ProgressBar value={info.carbs} max={100} label="Carbs" className="bg-wellness-100" />
          <ProgressBar value={info.fat} max={40} label="Fat" className="bg-wellness-100" />
          <ProgressBar value={info.fiber} max={30} label="Fiber" className="bg-wellness-100" />
        </div>
      </div>
    );
  };

  const bodyTypes = [
    {
      type: "Ectomorph",
      description: "Naturally lean and struggles to gain weight",
      goals: ["Muscle gain", "Strength building", "Healthy weight gain"],
      tips: ["Increase caloric intake", "Focus on compound exercises", "Frequent meals"],
    },
    {
      type: "Mesomorph",
      description: "Athletic build with moderate weight gain/loss ability",
      goals: ["Muscle definition", "Athletic performance", "Body recomposition"],
      tips: ["Balanced macronutrients", "Mixed training approach", "Regular exercise"],
    },
    {
      type: "Endomorph",
      description: "Tends to gain weight more easily",
      goals: ["Fat loss", "Muscle maintenance", "Cardiovascular health"],
      tips: ["Caloric deficit", "Regular cardio", "High protein intake"],
    },
  ];

  const [selectedBodyType, setSelectedBodyType] = useState("");

  const generalTips = [
    {
      icon: <Target className="w-6 h-6 text-wellness-600" />,
      title: "Set Clear Goals",
      description: "Define specific, measurable, and time-bound objectives",
    },
    {
      icon: <Users className="w-6 h-6 text-wellness-600" />,
      title: "Find Support",
      description: "Connect with like-minded individuals or get a workout buddy",
    },
    {
      icon: <Route className="w-6 h-6 text-wellness-600" />,
      title: "Track Progress",
      description: "Monitor your journey and celebrate small victories",
    },
    {
      icon: <Brain className="w-6 h-6 text-wellness-600" />,
      title: "Stay Consistent",
      description: "Build healthy habits through regular practice",
    },
  ];

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      
      try {
        const response = await fetch('https://lxkowsyqeishluutfdfw.supabase.co/functions/v1/nutrition-ai', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4a293c3lxZWlzaGx1dXRmZGZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1NTIyNjQsImV4cCI6MjA1NjEyODI2NH0.D6uaO9IsIOT-A2WK3VHbS8o1Tx4olaxYQeBeIGnD2VI'
          },
          body: JSON.stringify({
            type: 'image',
            message: base64String
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error('Failed to analyze image');
        }

        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }

        toast({
          title: "Image Analysis Complete",
          description: data,
        });
      } catch (error) {
        console.error('Image analysis error:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to analyze image. Please try again.",
          variant: "destructive"
        });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-2xl font-semibold text-wellness-700 text-center mb-8 hover:scale-105 transition-all duration-300">
          Compare the nutritional value of any two foods!
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="wellness-card transform hover:scale-102 transition-all duration-300 bg-white/80">
            <div className="space-y-4">
              <div className="inline-block px-4 py-2 rounded-lg bg-wellness-100 text-wellness-700 hover:bg-wellness-200 transition-colors">
                Manual Input
              </div>
              <Select 
                value={food1} 
                onValueChange={(value) => handleFoodSelection(value, setFood1)}
              >
                <SelectTrigger className="wellness-input hover:border-wellness-500 transition-colors">
                  <SelectValue placeholder="Select first food" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(foodCategories).map(([category, foods]) => (
                    <div key={category}>
                      <div className="px-2 py-1.5 text-sm font-semibold text-wellness-700 bg-wellness-50">
                        {category}
                      </div>
                      {foods.map((food) => (
                        <SelectItem
                          key={food}
                          value={food.toLowerCase().replace(/\s+/g, '-')}
                        >
                          {food}
                        </SelectItem>
                      ))}
                    </div>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  value={weight1}
                  onChange={(e) => setWeight1(e.target.value)}
                  className="wellness-input hover:border-wellness-500 transition-colors"
                />
                <span className="text-wellness-600">grams</span>
              </div>
              {food1 && <NutritionalProgress foodId={food1} weight={weight1} />}
            </div>
          </Card>

          <Card className="wellness-card transform hover:scale-102 transition-all duration-300 bg-white/80">
            <div className="space-y-4">
              <div className="inline-block px-4 py-2 rounded-lg bg-wellness-100 text-wellness-700 hover:bg-wellness-200 transition-colors">
                Manual Input
              </div>
              <Select 
                value={food2} 
                onValueChange={(value) => handleFoodSelection(value, setFood2)}
              >
                <SelectTrigger className="wellness-input hover:border-wellness-500 transition-colors">
                  <SelectValue placeholder="Select second food" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(foodCategories).map(([category, foods]) => (
                    <div key={category}>
                      <div className="px-2 py-1.5 text-sm font-semibold text-wellness-700 bg-wellness-50">
                        {category}
                      </div>
                      {foods.map((food) => (
                        <SelectItem
                          key={food}
                          value={food.toLowerCase().replace(/\s+/g, '-')}
                        >
                          {food}
                        </SelectItem>
                      ))}
                    </div>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  value={weight2}
                  onChange={(e) => setWeight2(e.target.value)}
                  className="wellness-input hover:border-wellness-500 transition-colors"
                />
                <span className="text-wellness-600">grams</span>
              </div>
              {food2 && <NutritionalProgress foodId={food2} weight={weight2} />}
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:col-span-2">
            <Card className="wellness-card transform hover:scale-102 transition-all duration-300 bg-white/80">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Scale className="w-5 h-5 text-wellness-500" />
                  <h2 className="text-xl font-semibold text-wellness-700">BMI Calculator</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-wellness-600 mb-1">Height (cm)</label>
                    <Input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      placeholder="Enter your height"
                      className="wellness-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-wellness-600 mb-1">Weight (kg)</label>
                    <Input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="Enter your weight"
                      className="wellness-input"
                    />
                  </div>
                  <button
                    onClick={calculateBMI}
                    className="wellness-button w-full"
                  >
                    Calculate BMI
                  </button>
                  {bmi !== null && (
                    <div className="mt-4 p-4 rounded-lg bg-wellness-50">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-wellness-700">{bmi}</p>
                        <p className="text-wellness-600">{bmiCategory}</p>
                      </div>
                      <div className="mt-4">
                        <div className="h-2 w-full bg-wellness-100 rounded-full">
                          <div
                            className="h-full bg-wellness-500 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${Math.min((bmi / 40) * 100, 100)}%` }}
                          />
                        </div>
                        <div className="flex justify-between mt-1 text-xs text-wellness-600">
                          <span>18.5</span>
                          <span>25</span>
                          <span>30</span>
                          <span>40</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            <Card className="wellness-card transform hover:scale-102 transition-all duration-300 bg-white/80">
              <h2 className="text-xl font-semibold mb-4 text-wellness-700">
                AI Nutrition Assistant
              </h2>
              <div className="h-[400px] flex flex-col">
                <div className="flex-1 bg-wellness-50/50 rounded-lg p-4 mb-4 overflow-y-auto">
                  <div className="flex flex-col space-y-4">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex items-start gap-2 ${
                          message.role === 'assistant' ? 'justify-start' : 'justify-end'
                        }`}
                      >
                        <div
                          className={`p-3 rounded-lg ${
                            message.role === 'assistant'
                              ? 'bg-white rounded-tl-none shadow-sm max-w-[80%]'
                              : 'bg-wellness-100 rounded-tr-none shadow-sm max-w-[80%]'
                          }`}
                        >
                          {message.content}
                        </div>
                      </div>
                    ))}
                    {loadingChat && (
                      <div className="flex justify-start">
                        <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm">
                          Typing...
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2 p-2 border rounded-lg bg-white">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask me about nutrition..."
                    className="flex-1 bg-transparent outline-none"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={loadingChat}
                    className="wellness-button p-2"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          </div>

          <Card className="wellness-card md:col-span-2 transform hover:scale-102 transition-all duration-300 bg-white/80">
            <h2 className="text-xl font-semibold mb-4 text-wellness-700">
              Meal Recognition
            </h2>
            <div className="border-2 border-dashed border-wellness-200 rounded-lg p-8 text-center hover:border-wellness-300 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="meal-image"
              />
              <p className="text-wellness-600 mb-4">
                Drop a photo of your meal here or click to upload
              </p>
              <label
                htmlFor="meal-image"
                className="wellness-button cursor-pointer inline-block"
              >
                <Upload className="w-4 h-4 inline-block mr-2" />
                Upload Image
              </label>
            </div>
          </Card>
        </div>

        <div className="mt-16 space-y-12">
          <h2 className="text-2xl font-semibold text-wellness-700 text-center">
            Your Wellness Journey
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {generalTips.map((tip, index) => (
              <Card 
                key={index} 
                className="wellness-card hover:scale-102 transition-all duration-300 bg-white/80"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  {tip.icon}
                  <h3 className="font-semibold text-wellness-700">{tip.title}</h3>
                  <p className="text-wellness-600 text-sm">{tip.description}</p>
                </div>
              </Card>
            ))}
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-wellness-700 text-center">
              Understand Your Body Type
            </h3>
            
            <div className="flex justify-center space-x-4">
              {bodyTypes.map((type) => (
                <button
                  key={type.type}
                  onClick={() => setSelectedBodyType(type.type)}
                  className={`px-6 py-3 rounded-lg transition-all duration-300 ${
                    selectedBodyType === type.type
                      ? "bg-wellness-200 text-wellness-700 shadow-md"
                      : "bg-wellness-50 text-wellness-600 hover:bg-wellness-100"
                  }`}
                >
                  {type.type}
                </button>
              ))}
            </div>

            {selectedBodyType && (
              <Card className="wellness-card animate-fade-in bg-white/80">
                {bodyTypes
                  .filter((type) => type.type === selectedBodyType)
                  .map((type) => (
                    <div key={type.type} className="space-y-6">
                      <div className="space-y-2">
                        <h4 className="text-lg font-semibold text-wellness-700">
                          {type.type}
                        </h4>
                        <p className="text-wellness-600">{type.description}</p>
                      </div>

                      <div className="space-y-4">
                        <h5 className="font-medium text-wellness-700">Common Goals:</h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {type.goals.map((goal, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2 text-wellness-600"
                            >
                              <ArrowRight className="w-4 h-4 text-wellness-500" />
                              <span>{goal}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h5 className="font-medium text-wellness-700">
                          Recommended Approach:
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {type.tips.map((tip, index) => (
                            <div
                              key={index}
                              className="bg-wellness-50 p-4 rounded-lg text-wellness-600"
                            >
                              {tip}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
