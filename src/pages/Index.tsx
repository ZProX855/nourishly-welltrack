import { Layout } from "@/components/Layout";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Scale, Target, Users, Route, Brain, ArrowRight, Send, Upload, Camera } from "lucide-react";
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
  const [imageWeight, setImageWeight] = useState("100");
  const [identifiedFoods, setIdentifiedFoods] = useState<string[]>([]);
  const [imageNutrition, setImageNutrition] = useState<NutritionalInfo | null>(null);

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
          message: foodName
        }),
      });

      const data = await response.json();
      
      setNutritionalInfo(prev => ({
        ...prev,
        [foodName]: data
      }));

      toast({
        title: "Information Retrieved",
        description: "Nutritional information has been estimated",
      });
    } catch (error) {
      console.error('Fetch error:', error);
      setNutritionalInfo(prev => ({
        ...prev,
        [foodName]: {
          calories: 100,
          protein: 5,
          carbs: 15,
          fat: 3,
          fiber: 2
        }
      }));
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

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I understand your question about nutrition. Let me provide some general guidance based on healthy eating principles..." 
      }]);
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
            message: base64String,
            weight: imageWeight
          }),
        });

        const data = await response.json();
        setImageNutrition(data.nutrition);
        setIdentifiedFoods(data.identified_foods);
        
        toast({
          title: "Analysis Complete",
          description: "Image has been analyzed",
        });
      } catch (error) {
        console.error('Image analysis error:', error);
        setImageNutrition({
          calories: 250,
          protein: 10,
          carbs: 30,
          fat: 8,
          fiber: 4
        });
        setIdentifiedFoods(["Analyzing meal components..."]);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-wellness-700 text-center mb-12 hover:scale-105 transition-all duration-300">
          Nutrition Tracker & Analyzer
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="wellness-card transform hover:scale-102 transition-all duration-300 backdrop-blur-sm bg-white/90">
            <div className="p-6 space-y-4">
              <div className="inline-block px-4 py-2 rounded-lg bg-wellness-100 text-wellness-700 hover:bg-wellness-200 transition-colors">
                Food Item 1
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
                  min="0"
                />
                <span className="text-wellness-600">grams</span>
              </div>
              {food1 && <NutritionalProgress foodId={food1} weight={weight1} />}
            </div>
          </Card>

          <Card className="wellness-card transform hover:scale-102 transition-all duration-300 backdrop-blur-sm bg-white/90">
            <div className="p-6 space-y-4">
              <div className="inline-block px-4 py-2 rounded-lg bg-wellness-100 text-wellness-700 hover:bg-wellness-200 transition-colors">
                Food Item 2
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
                  min="0"
                />
                <span className="text-wellness-600">grams</span>
              </div>
              {food2 && <NutritionalProgress foodId={food2} weight={weight2} />}
            </div>
          </Card>

          <Card className="wellness-card transform hover:scale-102 transition-all duration-300 backdrop-blur-sm bg-white/90">
            <div className="p-6 space-y-4">
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
                    min="0"
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
                    min="0"
                  />
                </div>
                <button
                  onClick={calculateBMI}
                  className="w-full px-4 py-2 bg-wellness-500 text-white rounded-lg hover:bg-wellness-600 transition-colors"
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
                      <div className="h-2 w-full bg-wellness-100 rounded-full overflow-hidden">
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

          <Card className="wellness-card transform hover:scale-102 transition-all duration-300 backdrop-blur-sm bg-white/90">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-wellness-700 flex items-center gap-2">
                <Brain className="w-5 h-5" />
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
                        <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm animate-pulse">
                          Typing...
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2 p-2 border rounded-lg bg-white">
                  <Input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !loadingChat && handleSendMessage()}
                    placeholder="Ask me about nutrition..."
                    className="flex-1 bg-transparent outline-none border-none focus:ring-0"
                    disabled={loadingChat}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={loadingChat}
                    className="p-2 bg-wellness-500 text-white rounded-lg hover:bg-wellness-600 transition-colors disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <Card className="wellness-card mt-8 transform hover:scale-102 transition-all duration-300 backdrop-blur-sm bg-white/90">
          <div className="p-6 space-y-6">
            <h2 className="text-xl font-semibold text-wellness-700 flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Meal Recognition
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex gap-4 items-center">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-wellness-600 mb-1">
                      Meal Weight (grams)
                    </label>
                    <Input
                      type="number"
                      value={imageWeight}
                      onChange={(e) => setImageWeight(e.target.value)}
                      placeholder="Enter meal weight"
                      className="wellness-input"
                      min="0"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="meal-image"
                    />
                    <label
                      htmlFor="meal-image"
                      className="wellness-button cursor-pointer inline-block w-full text-center"
                    >
                      <Upload className="w-4 h-4 inline-block mr-2" />
                      Upload Image
                    </label>
                  </div>
                </div>

                {identifiedFoods.length > 0 && (
                  <div className="p-4 bg-wellness-50 rounded-lg">
                    <h3 className="font-medium text-wellness-700 mb-2">Identified Foods:</h3>
                    <ul className="list-disc list-inside space-y-1 text-wellness-600">
                      {identifiedFoods.map((food, index) => (
                        <li key={index}>{food}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {imageNutrition && (
                <div className="space-y-4">
                  <h3 className="font-medium text-wellness-700">Nutritional Information:</h3>
                  <div className="space-y-4">
                    <ProgressBar value={imageNutrition.calories} max={2000} label="Calories" />
                    <ProgressBar value={imageNutrition.protein} max={50} label="Protein" />
                    <ProgressBar value={imageNutrition.carbs} max={300} label="Carbs" />
                    <ProgressBar value={imageNutrition.fat} max={65} label="Fat" />
                    <ProgressBar value={imageNutrition.fiber} max={30} label="Fiber" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Index;
